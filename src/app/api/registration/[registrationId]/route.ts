import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import {
  REG_ID_RE,
  verifyRegistrationLookupToken,
} from "@/lib/security/registration-lookup";
import { getPublicRegistrationSummary } from "@/server/services/registration.service";

type RouteContext = {
  params: Promise<{ registrationId: string }>;
};

async function resolveVerifiedEmail(
  registrationId: string,
  request: NextRequest
): Promise<string | null> {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  if (token) {
    const verified = verifyRegistrationLookupToken(registrationId, token);
    return verified?.email ?? null;
  }

  const email = request.nextUrl.searchParams.get("email")?.trim();
  return email || null;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { registrationId } = await context.params;

  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `registration-lookup:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  if (!REG_ID_RE.test(registrationId)) {
    return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
  }

  const email = await resolveVerifiedEmail(registrationId, request);
  if (!email) {
    return NextResponse.json(
      { error: "Email or confirmation token required" },
      { status: 401 }
    );
  }

  try {
    const summary = await getPublicRegistrationSummary(registrationId, email);
    if (!summary) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }
    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("registration lookup error:", message);
    return NextResponse.json(
      {
        error: "Unable to load registration",
        ...(process.env.NODE_ENV !== "production" ? { detail: message } : {}),
      },
      { status: 500 }
    );
  }
}
