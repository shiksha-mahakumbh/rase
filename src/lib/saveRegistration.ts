import {
  REGISTRATION_ID_PREFIX,
  RegistrationType,
  PaymentStatus,
  RegistrationStatus,
  AccommodationStatus,
} from "@/types/registration";
export interface SaveRegistrationInput {
  registrationType: RegistrationType | string;
  data: Record<string, unknown>;
  paymentStatus?: PaymentStatus;
  registrationStatus?: RegistrationStatus;
  accommodationStatus?: AccommodationStatus;
}

export interface SaveRegistrationResult {
  registrationId: string;
  masterDocId: string;
  typeDocId: string;
}

/** Submit registration via server API (Supabase/Prisma). */
export async function saveRegistration(
  input: SaveRegistrationInput
): Promise<SaveRegistrationResult> {
  const res = await fetch("/api/v2/registration/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Registration submission failed"
    );
  }

  const body = await res.json();
  return {
    registrationId: body.registrationId,
    masterDocId: body.id ?? body.masterDocId ?? body.registrationId,
    typeDocId: body.typeDocId ?? body.id ?? body.registrationId,
  };
}

/** @deprecated IDs are allocated server-side on submit. */
export async function generateRegistrationId(): Promise<string> {
  return `${REGISTRATION_ID_PREFIX}-000000`;
}
