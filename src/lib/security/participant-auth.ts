import { prisma } from "@/server/db/prisma";
import {
  REG_ID_RE,
  emailsMatch,
  verifyRegistrationLookupToken,
} from "@/lib/security/registration-lookup";

/** Token-first; falls back to registration ID + email match in DB (rate-limited at route). */
export async function verifyParticipantCredentials(
  registrationId: string,
  email: string,
  lookupToken?: string
): Promise<{ ok: true; email: string } | { ok: false }> {
  const id = registrationId.trim();
  const normalizedEmail = email.trim();
  if (!REG_ID_RE.test(id) || !normalizedEmail) return { ok: false };

  const token = lookupToken?.trim();
  if (token) {
    const verified = verifyRegistrationLookupToken(id, token);
    if (verified && emailsMatch(verified.email, normalizedEmail)) {
      return { ok: true, email: verified.email };
    }
  }

  const reg = await prisma.registration.findFirst({
    where: { registrationId: id, deletedAt: null },
    select: { email: true },
  });
  if (!reg || !emailsMatch(reg.email, normalizedEmail)) return { ok: false };
  return { ok: true, email: reg.email };
}
