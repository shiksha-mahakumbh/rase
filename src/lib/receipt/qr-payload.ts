export type RegistrationQrPayload = {
  registrationId: string;
  fullName: string;
  registrationType: string;
  category: string;
  institution: string;
  email: string;
  event?: string;
  verifyUrl?: string;
};

export function buildRegistrationQrPayload(
  input: RegistrationQrPayload
): RegistrationQrPayload {
  return {
    registrationId: input.registrationId,
    fullName: input.fullName,
    registrationType: input.registrationType,
    category: input.category,
    institution: input.institution,
    email: input.email,
    event: input.event,
    verifyUrl: input.verifyUrl,
  };
}

export function serializeQrPayload(payload: RegistrationQrPayload): string {
  return JSON.stringify(buildRegistrationQrPayload(payload));
}
