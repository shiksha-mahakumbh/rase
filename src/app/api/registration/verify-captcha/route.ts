import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { handleVerifyCaptchaPost } from "@/server/lib/registration-verify-captcha-handler";

/** @deprecated Use /api/v2/registration/verify-captcha — thin compatibility shim. */
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
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }
  return handleVerifyCaptchaPost(request);
}
