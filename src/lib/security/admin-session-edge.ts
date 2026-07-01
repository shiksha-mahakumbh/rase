/**
 * Edge-compatible admin session verification for middleware.
 * Mirrors HMAC logic in admin-session.ts using Web Crypto API.
 */
import type { AdminSessionPayload } from "@/lib/security/admin-session";

async function hmacSign(encoded: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encoded));
  return Buffer.from(sig).toString("base64url");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyAdminSessionTokenEdge(
  token: string,
  secret: string
): Promise<AdminSessionPayload | null> {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig || !secret) return null;

    const expected = await hmacSign(encoded, secret);
    if (!timingSafeEqualStr(sig, expected)) return null;

    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as AdminSessionPayload;

    if (!parsed.uid || !parsed.email || !parsed.role || typeof parsed.exp !== "number") return null;
    if (typeof parsed.sessionVersion !== "number") return null;
    if (Date.now() > parsed.exp) return null;

    return parsed;
  } catch {
    return null;
  }
}
