import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import type { AdminRole } from "@/types/registration";

function opsSecret(): string {
  const secret = process.env.ADMIN_OPS_SECRET;
  if (!secret) {
    throw new Error("ADMIN_OPS_SECRET is not configured");
  }
  return secret;
}

/** HMAC signature for gateway-proxied admin role headers (prevents x-admin-role spoofing). */
export function signAdminGatewayContext(
  email: string,
  role: AdminRole,
  uid: string
): string {
  const payload = `${email}|${role}|${uid}`;
  return createHmac("sha256", opsSecret()).update(payload).digest("base64url");
}

/** Trust admin role only when gateway signed the context headers. */
export function verifyAdminGatewayContext(request: NextRequest): AdminRole | null {
  const email = request.headers.get("x-admin-email");
  const role = request.headers.get("x-admin-role");
  const uid = request.headers.get("x-admin-uid");
  const sig = request.headers.get("x-admin-context-sig");

  if (!email || !uid || !role || !sig) return null;
  if (role !== "Super Admin" && role !== "Admin" && role !== "Data Entry") return null;

  try {
    const expected = signAdminGatewayContext(email, role as AdminRole, uid);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return role as AdminRole;
  } catch {
    return null;
  }
}
