import { createHmac, timingSafeEqual } from "node:crypto";

const CONFIRM_TTL_MS = 48 * 60 * 60 * 1000;
const UNSUB_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type TokenPurpose = "confirm" | "unsub";

function tokenSecret(): string | null {
  return (
    process.env.NEWSLETTER_TOKEN_SECRET?.trim() ??
    process.env.REGISTRATION_LOOKUP_SECRET?.trim() ??
    null
  );
}

function requireTokenSecret(): string {
  const secret = tokenSecret();
  if (!secret) {
    throw new Error("NEWSLETTER_TOKEN_SECRET or REGISTRATION_LOOKUP_SECRET is not configured");
  }
  return secret;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sign(encoded: string): string {
  return createHmac("sha256", requireTokenSecret()).update(encoded).digest("base64url");
}

export function newsletterTokensEnabled(): boolean {
  return Boolean(tokenSecret());
}

function createToken(purpose: TokenPurpose, email: string, ttlMs: number): string {
  const exp = Date.now() + ttlMs;
  const payload = JSON.stringify({
    purpose,
    email: normalizeEmail(email),
    exp,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function verifyToken(
  token: string,
  purpose: TokenPurpose,
  email?: string
): { email: string } | null {
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  const expected = sign(encoded);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      purpose?: TokenPurpose;
      email?: string;
      exp?: number;
    };
    if (data.purpose !== purpose || !data.email || typeof data.exp !== "number") return null;
    if (Date.now() > data.exp) return null;
    if (email && normalizeEmail(email) !== data.email) return null;
    return { email: data.email };
  } catch {
    return null;
  }
}

export function createNewsletterConfirmToken(email: string): string {
  return createToken("confirm", email, CONFIRM_TTL_MS);
}

export function verifyNewsletterConfirmToken(token: string): { email: string } | null {
  return verifyToken(token, "confirm");
}

export function createNewsletterUnsubscribeToken(email: string): string {
  return createToken("unsub", email, UNSUB_TTL_MS);
}

export function verifyNewsletterUnsubscribeToken(
  token: string,
  email: string
): boolean {
  return verifyToken(token, "unsub", email) !== null;
}
