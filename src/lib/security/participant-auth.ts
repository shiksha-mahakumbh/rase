import { prisma } from "@/server/db/prisma";
import {
  REG_ID_RE,
  emailsMatch,
  verifyRegistrationLookupToken,
} from "@/lib/security/registration-lookup";

type VerifyOptions = {
  lookupToken?: string;
  /** Set when reCAPTCHA was verified server-side (email + ID match only). */
  captchaVerified?: boolean;
};

/** Participant auth via lookup token or captcha-verified email match. */
export async function verifyParticipantCredentials(
  registrationId: string,
  email: string,
  options?: VerifyOptions
): Promise<{ ok: true; email: string } | { ok: false }> {
  const id = registrationId.trim();
  const normalizedEmail = email.trim();
  if (!REG_ID_RE.test(id) || !normalizedEmail) return { ok: false };

  const reg = await prisma.registration.findFirst({
    where: { registrationId: id, deletedAt: null },
    select: { email: true },
  });
  if (!reg || !emailsMatch(reg.email, normalizedEmail)) return { ok: false };

  const token = options?.lookupToken?.trim();
  if (token) {
    const verified = verifyRegistrationLookupToken(id, token);
    if (!verified || !emailsMatch(verified.email, normalizedEmail)) {
      return { ok: false };
    }
    return { ok: true, email: reg.email };
  }

  if (options?.captchaVerified) {
    return { ok: true, email: reg.email };
  }

  return { ok: false };
}
