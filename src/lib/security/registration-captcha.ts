import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { verifyRegistrationProofToken } from "@/lib/security/registration-proof";

/**
 * Registration submit abuse protection.
 * Priority: verified Razorpay payment → first-party proof token → optional reCAPTCHA fallback.
 */
export async function verifyRegistrationSubmitProtection(input: {
  registrationProof?: string | null;
  captchaToken?: string | null;
  fee?: number;
  razorpayPaymentId?: string | null;
  clientIp?: string;
}): Promise<{ ok: boolean; error?: string; skipped?: boolean; method?: string }> {
  const paymentId = String(input.razorpayPaymentId ?? "").trim();
  if ((input.fee ?? 0) > 0 && paymentId.length > 0) {
    return { ok: true, skipped: true, method: "payment" };
  }

  const proof = String(input.registrationProof ?? "").trim();
  if (proof) {
    const checked = verifyRegistrationProofToken(proof, input.clientIp);
    if (checked.ok) {
      return { ok: true, method: "proof" };
    }
    return { ok: false, error: checked.error };
  }

  if (input.captchaToken) {
    const captcha = await verifyRecaptchaToken(input.captchaToken, "registration");
    if (captcha.ok) {
      return { ok: true, method: "captcha" };
    }
    return captcha;
  }

  return {
    ok: false,
    error: "Registration session expired. Refresh the page and submit again.",
  };
}

/** @deprecated use verifyRegistrationSubmitProtection */
export const verifyRegistrationSubmitCaptcha = verifyRegistrationSubmitProtection;
