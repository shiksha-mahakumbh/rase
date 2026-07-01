import type { NextRequest } from "next/server";
import { getPublicRegistrationSummary } from "@/server/services/registration.service";
import { ServiceError } from "@/server/lib/errors";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import {
  REG_ID_RE,
  verifyRegistrationLookupToken,
} from "@/lib/security/registration-lookup";

/** GET lookup — registrationId from path; token required (email-only removed). */
export async function handlePublicRegistrationLookup(
  request: NextRequest,
  registrationId: string
) {
  if (!REG_ID_RE.test(registrationId)) {
    throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
  }

  const token = request.nextUrl.searchParams.get("token")?.trim();
  if (!token) {
    throw new ServiceError("Confirmation token required", 401, "AUTH_REQUIRED");
  }

  const verified = verifyRegistrationLookupToken(registrationId, token);
  if (!verified?.email) {
    throw new ServiceError("Invalid or expired token", 401, "AUTH_REQUIRED");
  }

  const summary = await getPublicRegistrationSummary(registrationId, verified.email);
  if (!summary) {
    throw new ServiceError("Registration not found", 404, "NOT_FOUND");
  }

  return summary;
}

/** POST lookup — token OR captcha + email. */
export async function handlePublicRegistrationLookupPost(
  body: {
    registrationId?: string;
    email?: string;
    token?: string;
    lookupToken?: string;
    captchaToken?: string;
  },
  options?: { skipCaptcha?: boolean }
) {
  const registrationId = String(body.registrationId ?? "").trim();
  let email = String(body.email ?? "").trim();
  const token = String(body.lookupToken ?? body.token ?? "").trim();

  if (!REG_ID_RE.test(registrationId)) {
    throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
  }

  if (token) {
    const verified = verifyRegistrationLookupToken(registrationId, token);
    email = verified?.email ?? email;
  } else {
    if (!options?.skipCaptcha) {
      const captcha = await verifyRecaptchaToken(body.captchaToken, "registration_lookup");
      if (!captcha.ok) {
        throw new ServiceError(captcha.error ?? "Captcha verification failed", 403, "CAPTCHA_FAILED");
      }
    }
    if (!email) {
      throw new ServiceError("Email or confirmation token required", 401, "AUTH_REQUIRED");
    }
  }

  if (!email) {
    throw new ServiceError("Email or confirmation token required", 401, "AUTH_REQUIRED");
  }

  const summary = await getPublicRegistrationSummary(registrationId, email);
  if (!summary) {
    throw new ServiceError("Registration not found", 404, "NOT_FOUND");
  }

  return summary;
}
