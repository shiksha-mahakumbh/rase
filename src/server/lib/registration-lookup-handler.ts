import type { NextRequest } from "next/server";
import { getPublicRegistrationSummary } from "@/server/services/registration.service";
import { ServiceError } from "@/server/lib/errors";
import {
  REG_ID_RE,
  verifyRegistrationLookupToken,
} from "@/lib/security/registration-lookup";

/** GET lookup — registrationId from path; email or token from query. */
export async function handlePublicRegistrationLookup(
  request: NextRequest,
  registrationId: string
) {
  if (!REG_ID_RE.test(registrationId)) {
    throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
  }

  const token = request.nextUrl.searchParams.get("token")?.trim();
  const emailParam = request.nextUrl.searchParams.get("email")?.trim();

  let email: string | null = null;
  if (token) {
    const verified = verifyRegistrationLookupToken(registrationId, token);
    email = verified?.email ?? null;
  } else if (emailParam) {
    email = emailParam;
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

/** POST lookup — `{ registrationId, email }` or optional `token` / `lookupToken`. */
export async function handlePublicRegistrationLookupPost(body: {
  registrationId?: string;
  email?: string;
  token?: string;
  lookupToken?: string;
}) {
  const registrationId = String(body.registrationId ?? "").trim();
  let email = String(body.email ?? "").trim();
  const token = String(body.lookupToken ?? body.token ?? "").trim();

  if (!REG_ID_RE.test(registrationId)) {
    throw new ServiceError("Invalid registration ID", 400, "INVALID_ID");
  }

  if (token) {
    const verified = verifyRegistrationLookupToken(registrationId, token);
    email = verified?.email ?? email;
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
