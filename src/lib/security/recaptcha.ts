const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

const DEFAULT_ALLOWED_HOSTNAMES = [
  "www.shikshamahakumbh.com",
  "shikshamahakumbh.com",
  "www.rase.co.in",
  "rase.co.in",
  "localhost",
];

function allowedHostnames(): string[] {
  const fromEnv = process.env.RECAPTCHA_ALLOWED_HOSTNAMES?.split(",")
    .map((h) => h.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_ALLOWED_HOSTNAMES;
}

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

  if (token === "dev-bypass" && process.env.NODE_ENV !== "production") {
    return { ok: true, score: 1 };
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
    hostname?: string;
    "error-codes"?: string[];
  };

  if (!data.success) {
    const codes = data["error-codes"]?.join(", ") ?? "Verification failed";
    console.warn("recaptcha siteverify failed:", {
      codes,
      hostname: data.hostname,
      action: data.action,
    });
    return { ok: false, error: codes };
  }

  if (data.hostname) {
    const allowed = allowedHostnames();
    if (!allowed.includes(data.hostname)) {
      console.warn("recaptcha hostname not in allowlist:", data.hostname, allowed);
      return { ok: false, error: `Hostname not allowed: ${data.hostname}` };
    }
  }

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? "0.3");
  if (typeof data.score === "number" && data.score < minScore) {
    return {
      ok: false,
      score: data.score,
      error: `Low confidence score (${data.score} < ${minScore})`,
    };
  }

  if (expectedAction && data.action && data.action !== expectedAction) {
    return {
      ok: false,
      error: `Action mismatch (expected ${expectedAction}, got ${data.action})`,
    };
  }

  return { ok: true, score: data.score };
}
