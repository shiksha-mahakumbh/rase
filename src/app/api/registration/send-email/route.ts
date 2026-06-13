import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { sendRegistrationConfirmation } from "@/server/services/email.service";
import { prisma } from "@/server/db/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REG_ID_RE = /^SMK2026-\d{6}$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit({
    key: `email:${ip}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  const emailSecret = process.env.REGISTRATION_EMAIL_SECRET;
  if (emailSecret) {
    const provided =
      request.headers.get("x-registration-secret") ??
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const requireSecret =
      process.env.REGISTRATION_EMAIL_REQUIRE_SECRET === "true";
    if (provided && provided !== emailSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (requireSecret && provided !== emailSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const body = await request.json();
    const { registrationId, fullName, email } = body;
    const registrationUuid = body.registrationUuid ?? body.masterDocId;

    if (!registrationId || !email || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!REG_ID_RE.test(registrationId)) {
      return NextResponse.json(
        { error: "Invalid registration ID" },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email) || String(fullName).length < 2) {
      return NextResponse.json(
        { error: "Invalid email or name" },
        { status: 400 }
      );
    }

    const log = await sendRegistrationConfirmation({
      registrationId,
      fullName: String(fullName),
      email: String(email),
    });

    if (registrationUuid) {
      await prisma.registration.update({
        where: { id: registrationUuid },
        data: {
          emailDeliveryStatus:
            log.status === "sent"
              ? "sent"
              : log.status === "queued" || log.status === "sending"
                ? "pending"
                : log.status,
        },
      });
    }

    return NextResponse.json({
      success: true,
      emailStatus: log.status === "sent" ? "sent" : "queued",
      emailLogId: log.id,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, emailStatus: "failed", error: "Failed to queue email" },
      { status: 500 }
    );
  }
}
