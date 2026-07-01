import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import type { AdminRole } from "@/types/registration";

const GATEWAY_CONTEXT_TTL_MS = 60_000;

function opsSecret(): string {
  const secret = process.env.ADMIN_OPS_SECRET;
  if (!secret) {
    throw new Error("ADMIN_OPS_SECRET is not configured");
  }
  return secret;
}

/** Separate signing secret for gateway context (falls back to ops secret for migration). */
function gatewaySigningSecret(): string {
  return process.env.ADMIN_GATEWAY_SIGNING_SECRET ?? opsSecret();
}

/** HMAC signature for gateway-proxied admin role headers (prevents x-admin-role spoofing). */
export function signAdminGatewayContext(
  email: string,
  role: AdminRole,
  uid: string,
  sessionVersion: number,
  expMs: number = Date.now() + GATEWAY_CONTEXT_TTL_MS
): string {
  const payload = `${email}|${role}|${uid}|${sessionVersion}|${expMs}`;
  return createHmac("sha256", gatewaySigningSecret()).update(payload).digest("base64url");
}

/** Trust admin role only when gateway signed the context headers. */
export function verifyAdminGatewayContext(request: NextRequest): AdminRole | null {
  const email = request.headers.get("x-admin-email");
  const role = request.headers.get("x-admin-role");
  const uid = request.headers.get("x-admin-uid");
  const sig = request.headers.get("x-admin-context-sig");
  const sessionVerRaw = request.headers.get("x-admin-session-version");
  const expRaw = request.headers.get("x-admin-context-exp");

  if (!email || !uid || !role || !sig || !sessionVerRaw || !expRaw) return null;
  if (
    role !== "Super Admin" &&
    role !== "Admin" &&
    role !== "Data Entry" &&
    role !== "Coordinator"
  ) {
    return null;
  }

  const sessionVersion = Number(sessionVerRaw);
  const expMs = Number(expRaw);
  if (!Number.isFinite(sessionVersion) || !Number.isFinite(expMs)) return null;
  if (Date.now() > expMs) return null;

  try {
    const expected = signAdminGatewayContext(
      email,
      role as AdminRole,
      uid,
      sessionVersion,
      expMs
    );
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return role as AdminRole;
  } catch {
    return null;
  }
}
