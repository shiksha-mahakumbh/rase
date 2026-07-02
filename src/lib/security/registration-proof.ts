import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { REGISTRATION_PROOF_MIN_DWELL_MS } from "@/lib/security/registration-proof-constants";

export { REGISTRATION_PROOF_MIN_DWELL_MS };

const PROOF_TTL_MS = 20 * 60 * 1000;

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

type ProofBody = {
  typ: "registration_proof";
  iat: number;
  exp: number;
  nonce: string;
};

export function createRegistrationProofToken(): string {
  const now = Date.now();
  const body: ProofBody = {
    typ: "registration_proof",
    iat: now,
    exp: now + PROOF_TTL_MS,
    nonce: randomBytes(12).toString("base64url"),
  };
  const encoded = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyRegistrationProofToken(
  token: string
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
        error: "Please wait a moment and submit again",
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Invalid registration session" };
  }
}
