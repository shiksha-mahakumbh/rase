import { createHmac, timingSafeEqual } from "node:crypto";
import { REGISTRATION_ID_PREFIX } from "@/types/registration";

export const REG_ID_RE = new RegExp(`^${REGISTRATION_ID_PREFIX}-\\d{6}$`);

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days — post-registration confirmation window

function lookupSecret(): string {
  const secret = process.env.REGISTRATION_LOOKUP_SECRET;
  if (!secret) {
    throw new Error("REGISTRATION_LOOKUP_SECRET is not configured");
  }
  return secret;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function signPayload(payload: string): string {
  return createHmac("sha256", lookupSecret()).update(payload).digest("base64url");
}

/** Issued after successful registration — binds ID to registrant email. */
export function createRegistrationLookupToken(
  registrationId: string,
  email: string
): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = JSON.stringify({
    rid: registrationId,
    email: normalizeEmail(email),
    exp,
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = signPayload(encoded);
  return `${encoded}.${sig}`;
}

export function verifyRegistrationLookupToken(
  registrationId: string,
  token: string
): { email: string } | null {
  try {
    const [encoded, sig] = token.split(".");
    if (!encoded || !sig) return null;

    const expected = signPayload(encoded);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as {
      rid?: string;
      email?: string;
      exp?: number;
    };

    if (parsed.rid !== registrationId) return null;
    if (!parsed.email || typeof parsed.exp !== "number") return null;
    if (Date.now() > parsed.exp) return null;

    return { email: parsed.email };
  } catch {
    return null;
  }
}

export function emailsMatch(stored: string | null | undefined, provided: string): boolean {
  if (!stored) return false;
  return normalizeEmail(stored) === normalizeEmail(provided);
}

/** Public-safe fields only — never expose email or phone via lookup. */
export type PublicRegistrationSummary = {
  registrationId: string;
  registrationType: string;
  fullName: string;
  institution: string | null;
  registrationFee: number;
  paymentStatus: string;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  delegateCategory: string | null;
  accommodationRequired: string | null;
  accommodationStatus: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  qrDataUrl: string | null;
};

export function toPublicRegistrationSummary(data: {
  registrationId: string;
  registrationType: string;
  fullName: string;
  institution?: string | null;
  registrationFee?: number | null;
  paymentStatus?: string | null;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  delegateCategory?: string | null;
  accommodationRequired?: string | null;
  accommodationStatus?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
  qrDataUrl?: string | null;
}): PublicRegistrationSummary {
  return {
    registrationId: data.registrationId,
    registrationType: data.registrationType,
    fullName: data.fullName,
    institution: data.institution ?? null,
    registrationFee: data.registrationFee ?? 0,
    paymentStatus: data.paymentStatus ?? "Pending",
    razorpayPaymentId: data.razorpayPaymentId ?? null,
    razorpayOrderId: data.razorpayOrderId ?? null,
    delegateCategory: data.delegateCategory ?? null,
    accommodationRequired: data.accommodationRequired ?? null,
    accommodationStatus: data.accommodationStatus ?? null,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
    qrDataUrl: data.qrDataUrl ?? null,
  };
}

function toIsoString(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value !== null && "toDate" in value) {
    const maybeDate = (value as { toDate?: () => Date }).toDate?.();
    if (maybeDate instanceof Date) return maybeDate.toISOString();
  }
  return null;
}
