const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export async function verifyRecaptchaToken(
  token: string | undefined | null,
  expectedAction?: string
): Promise<{ ok: boolean; score?: number; error?: string }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "reCAPTCHA not configured" };
    }
    return { ok: true, score: 1 };
  }

  if (!token || token.length < 10) {
    return { ok: false, error: "Missing captcha token" };
  }

  const params = new URLSearchParams({
    secret,
    response: token,
  });

  const res = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = (await res.json()) as {
    success: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };

  if (!data.success) {
    return {
      ok: false,
      error: data["error-codes"]?.join(", ") ?? "Verification failed",
    };
  }

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");
  if (typeof data.score === "number" && data.score < minScore) {
    return { ok: false, score: data.score, error: "Low confidence score" };
  }

  if (expectedAction && data.action && data.action !== expectedAction) {
    return { ok: false, error: "Action mismatch" };
  }

  return { ok: true, score: data.score };
}
