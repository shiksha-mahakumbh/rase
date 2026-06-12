import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { REG_ID_RE } from "@/lib/security/registration-lookup";
import { getPublicRegistrationSummary } from "@/server/services/registration.service";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit({
    key: `registration-lookup-post:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const body = await request.json();
    const registrationId = String(body.registrationId ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (!REG_ID_RE.test(registrationId)) {
      return NextResponse.json({ error: "Invalid registration ID" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json(
        { error: "Email or confirmation token required" },
        { status: 401 }
      );
    }

    const summary = await getPublicRegistrationSummary(registrationId, email);
    if (!summary) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("registration lookup POST error:", message);
    return NextResponse.json({ error: "Unable to load registration" }, { status: 500 });
  }
}
