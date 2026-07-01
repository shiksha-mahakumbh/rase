import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const UPLOAD_TTL_MS = 15 * 60 * 1000;

function uploadSecret(): string {
  const secret =
    process.env.REGISTRATION_UPLOAD_SECRET ?? process.env.REGISTRATION_LOOKUP_SECRET;
  if (!secret) {
    throw new Error("REGISTRATION_UPLOAD_SECRET or REGISTRATION_LOOKUP_SECRET is not configured");
  }
  return secret;
}

function sign(encoded: string): string {
  return createHmac("sha256", uploadSecret()).update(encoded).digest("base64url");
}

/** Short-lived token issued after captcha verification — required for registration uploads. */
export function createUploadToken(): string {
  const body = {
    typ: "upload" as const,
    exp: Date.now() + UPLOAD_TTL_MS,
    nonce: randomBytes(12).toString("base64url"),
  };
  const encoded = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyUploadToken(token: string): boolean {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return false;

    const expected = sign(encoded);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      typ?: string;
      exp?: number;
    };
    if (parsed.typ !== "upload" || typeof parsed.exp !== "number") return false;
    if (Date.now() > parsed.exp) return false;
    return true;
  } catch {
    return false;
  }
}
