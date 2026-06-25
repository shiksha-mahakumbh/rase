import { PaymentStatus, RegistrationType } from "@/types/registration";
import { requiresPaymentForFee } from "@/lib/registration/fees";

/** Official Microsoft CMT portal for Shiksha Mahakumbh 6.0 multi-track conference. */
export const CMT_SUBMISSION_URL = "https://cmt3.research.microsoft.com/SMK2026/";

/** Legacy SMK 5.0 portal — kept for redirects only. */
export const CMT_LEGACY_SUBMISSION_URL =
  "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/";

/** CMT opens 30 June 2026 (IST). */
export const CMT_SUBMISSION_OPENS_ISO = "2026-06-30";

export function cmtSubmissionDateLabel(now = new Date()): string {
  const opens = new Date(`${CMT_SUBMISSION_OPENS_ISO}T00:00:00+05:30`);
  return now >= opens ? "Submissions open" : "Opens 30 June 2026";
}

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

/** Projects & Accommodation always use the 3-step pay flow (fee is never 0). */
export function usesMultiStepPaymentFlow(
  type: RegistrationType,
  fee = 0
): boolean {
  if (type === "Projects" || type === "Accommodation") return true;
  return requiresPaymentStep(type, fee);
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
