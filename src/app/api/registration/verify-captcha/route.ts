import { NextRequest, NextResponse } from "next/server";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `captcha:${ip}`,
    limit: 30,
    windowMs: 60_000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  try {
    const body = await request.json();
    const { token, action } = body as { token?: string; action?: string };

    const result = await verifyRecaptchaToken(token, action ?? "registration");

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, score: result.score });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
