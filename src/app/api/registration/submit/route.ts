import { NextRequest, NextResponse } from "next/server";
import { saveRegistration } from "@/server/services/registration.service";
import { isSupportedType } from "@/server/lib/registration-types";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { getRequestContext } from "@/server/lib/request";
import type { PaymentStatus } from "@/types/registration";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit({
    key: `registration-submit:${ip}`,
    limit: 15,
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
    const {
      captchaToken,
      registrationType,
      data,
      paymentStatus,
    } = body as {
      captchaToken?: string;
      registrationType?: unknown;
      data?: Record<string, unknown>;
      paymentStatus?: PaymentStatus;
    };

    if (typeof registrationType !== "string" || !isSupportedType(registrationType)) {
      return NextResponse.json(
        { error: "Invalid registration type" },
        { status: 400 }
      );
    }

    const type = registrationType;

    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid registration data" }, { status: 400 });
    }

    const fullName = String(data.fullName ?? "").trim();
    const email = String(data.email ?? "").trim();

    if (fullName.length < 2) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const captcha = await verifyRecaptchaToken(captchaToken, "registration");
    if (!captcha.ok) {
      console.warn("registration submit captcha failed:", captcha.error);
      return NextResponse.json(
        { error: "Security verification failed" },
        { status: 403 }
      );
    }

    const ctx = getRequestContext(request);
    const result = await saveRegistration({
      registrationType: type,
      data,
      paymentStatus,
      submittedIp: ctx.ip,
      userAgent: ctx.userAgent,
    });

    console.info("registration submitted", {
      registrationId: result.registrationId,
      registrationType: type,
      id: result.id,
    });

    const { createRegistrationLookupToken } = await import(
      "@/lib/security/registration-lookup"
    );
    const lookupToken = createRegistrationLookupToken(result.registrationId, email);

    return NextResponse.json({
      success: true,
      registrationId: result.registrationId,
      masterDocId: result.id,
      typeDocId: result.typeDocId,
      lookupToken,
    });
  } catch (error) {
    console.error("registration submit error:", error);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
