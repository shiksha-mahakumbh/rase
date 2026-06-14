import { PaymentStatus, RegistrationType } from "@/types/registration";
import { requiresPaymentForFee } from "@/lib/registration/fees";

export const CMT_SUBMISSION_URL =
  "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/";

/** Microsoft CMT — immediate redirect, no on-site form */
export const EXTERNAL_REDIRECT_TYPES = [
  "Multi Track Conference",
] as const satisfies readonly RegistrationType[];

/** Categories that may require payment (actual step depends on fee > 0) */
export const PAID_CAPABLE_TYPES = [
  "Delegate Registration",
  "Accommodation",
  "Projects",
] as const satisfies readonly RegistrationType[];

export function isExternalRedirectType(type: RegistrationType): boolean {
  return (EXTERNAL_REDIRECT_TYPES as readonly string[]).includes(type);
}

export function isPaidCapableType(type: RegistrationType): boolean {
  return (PAID_CAPABLE_TYPES as readonly string[]).includes(type);
}

/** @deprecated use requiresPaymentStep(type, fee) */
export function isPaidRegistrationType(type: RegistrationType): boolean {
  return isPaidCapableType(type);
}

export function requiresPaymentStep(
  type: RegistrationType,
  fee = 0
): boolean {
  if (!isPaidCapableType(type)) return false;
  return requiresPaymentForFee(fee);
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

  const fee = options.registrationFee ?? 0;

  if (!isPaidCapableType(registrationType) || fee === 0) {
    return "Submitted";
  }

  if (options.hasPaymentProof) {
    return "Paid";
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
