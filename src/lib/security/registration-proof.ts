import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const PROOF_TTL_MS = 20 * 60 * 1000;
/** Minimum time on the form before submit — blocks instant bot posts. */
export const REGISTRATION_PROOF_MIN_DWELL_MS = 3_000;

function proofSecret(): string {
  const secret =
    process.env.REGISTRATION_UPLOAD_SECRET ?? process.env.REGISTRATION_LOOKUP_SECRET;
  if (!secret) {
    throw new Error("REGISTRATION_UPLOAD_SECRET or REGISTRATION_LOOKUP_SECRET is not configured");
  }
  return secret;
}

function sign(encoded: string): string {
  return createHmac("sha256", proofSecret()).update(encoded).digest("base64url");
}

function hashIp(ip: string): string {
  return createHash("sha256").update(`${ip}:${proofSecret()}`).digest("base64url").slice(0, 16);
}

type ProofBody = {
  typ: "registration_proof";
  iat: number;
  exp: number;
  nonce: string;
  ip?: string;
};

export function createRegistrationProofToken(clientIp?: string): string {
  const now = Date.now();
  const body: ProofBody = {
    typ: "registration_proof",
    iat: now,
    exp: now + PROOF_TTL_MS,
    nonce: randomBytes(12).toString("base64url"),
    ...(clientIp ? { ip: hashIp(clientIp) } : {}),
  };
  const encoded = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyRegistrationProofToken(
  token: string,
  clientIp?: string
): { ok: true } | { ok: false; error: string } {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) {
      return { ok: false, error: "Invalid registration session" };
    }

    const expected = sign(encoded);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, error: "Invalid registration session" };
    }

    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as ProofBody;
    if (parsed.typ !== "registration_proof") {
      return { ok: false, error: "Invalid registration session" };
    }

    const now = Date.now();
    if (now > parsed.exp) {
      return { ok: false, error: "Registration session expired — refresh the page and try again" };
    }

    if (now - parsed.iat < REGISTRATION_PROOF_MIN_DWELL_MS) {
      return {
        ok: false,
        error: "Please complete the form before submitting",
      };
    }

    if (parsed.ip && clientIp && parsed.ip !== hashIp(clientIp)) {
      return { ok: false, error: "Registration session mismatch — refresh and try again" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Invalid registration session" };
  }
}
