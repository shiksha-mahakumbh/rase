import { createHmac, timingSafeEqual } from "node:crypto";
import type { AdminRole } from "@/types/registration";
import { ADMIN_SESSION_COOKIE } from "@/constants/auth";

export { ADMIN_SESSION_COOKIE };
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type AdminSessionPayload = {
  uid: string;
  email: string;
  role: AdminRole;
  exp: number;
};

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_OPS_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET (or ADMIN_OPS_SECRET) is not configured");
  }
  return secret;
}

function sign(encoded: string): string {
  return createHmac("sha256", sessionSecret()).update(encoded).digest("base64url");
}

/** Create a signed admin session token (set as HttpOnly cookie). */
export function createAdminSessionToken(payload: Omit<AdminSessionPayload, "exp">): string {
  const body: AdminSessionPayload = { ...payload, exp: Date.now() + SESSION_TTL_MS };
  const encoded = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

/** Verify signed admin session token. Works in Node; middleware uses edge variant. */
export function verifyAdminSessionToken(token: string): AdminSessionPayload | null {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return null;

    const expected = sign(encoded);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AdminSessionPayload;
    if (!parsed.uid || !parsed.email || !parsed.role || typeof parsed.exp !== "number") return null;
    if (Date.now() > parsed.exp) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function adminSessionCookieOptions(maxAgeSec = 7 * 24 * 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}
