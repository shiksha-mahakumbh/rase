import { verifyRecaptchaToken } from "@/lib/security/recaptcha";

/** Paid registrations with a verified Razorpay payment ID skip reCAPTCHA (checkout already validates the user). */
export async function verifyRegistrationSubmitCaptcha(input: {
  captchaToken?: string | null;
  fee?: number;
  razorpayPaymentId?: string | null;
}): Promise<{ ok: boolean; error?: string; skipped?: boolean }> {
  const paymentId = String(input.razorpayPaymentId ?? "").trim();
  if ((input.fee ?? 0) > 0 && paymentId.length > 0) {
    return { ok: true, skipped: true };
  }

  const captcha = await verifyRecaptchaToken(input.captchaToken, "registration");
  return captcha;
}
