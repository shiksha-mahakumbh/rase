import { PaymentStatus, RegistrationType } from "@/types/registration";

export const CMT_SUBMISSION_URL =
  "https://cmt3.research.microsoft.com/SMK2026/";

/** Microsoft CMT — immediate redirect, no on-site form */
export const EXTERNAL_REDIRECT_TYPES = [
  "Multi Track Conference",
  "Paper Submission",
  "Abstract Submission",
] as const satisfies readonly RegistrationType[];

/** Razorpay / payment step required */
export const PAID_REGISTRATION_TYPES = [
  "Delegate Registration",
  "Accommodation",
  "Projects",
] as const satisfies readonly RegistrationType[];

export const PROJECT_REGISTRATION_FEE = 200;

export function isExternalRedirectType(type: RegistrationType): boolean {
  return (EXTERNAL_REDIRECT_TYPES as readonly string[]).includes(type);
}

export function isPaidRegistrationType(type: RegistrationType): boolean {
  return (PAID_REGISTRATION_TYPES as readonly string[]).includes(type);
}

export function requiresPaymentStep(type: RegistrationType): boolean {
  return isPaidRegistrationType(type);
}

export function redirectToExternalSubmission(type: RegistrationType): void {
  if (isExternalRedirectType(type)) {
    window.location.assign(CMT_SUBMISSION_URL);
  }
}

export function resolvePaymentStatus(
  registrationType: RegistrationType,
  options: {
    registrationFee?: number;
    hasPaymentProof?: boolean;
    explicit?: PaymentStatus;
  } = {}
): PaymentStatus {
  if (options.explicit) return options.explicit;

  if (!isPaidRegistrationType(registrationType)) {
    return "Submitted";
  }

  if (options.hasPaymentProof) {
    return "Paid";
  }

  const fee = options.registrationFee ?? 0;
  if (fee === 0 && registrationType === "Delegate Registration") {
    return "Submitted";
  }

  return "Pending Payment";
}

export function displayStatusForRegistration(
  registrationType: RegistrationType | undefined,
  paymentStatus: string | undefined
): string {
  if (!paymentStatus) return "—";
  if (paymentStatus === "Pending") return "Pending Payment";
  return paymentStatus;
}

export function paidCategoryPaymentOptions(): PaymentStatus[] {
  return ["Pending Payment", "Paid", "Failed"];
}

export function freeCategoryPaymentOptions(): PaymentStatus[] {
  return ["Submitted"];
}
