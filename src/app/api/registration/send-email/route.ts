import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import {
  sendRegistrationCompleteEmail,
  mapDeliveryStatus,
} from "@/server/services/email.service";
import { prisma } from "@/server/db/prisma";
import {
  buildRegistrationArtifacts,
  receiptDownloadUrl,
} from "@/server/services/receipt.service";
import { createRegistrationLookupToken } from "@/lib/security/registration-lookup";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REG_ID_RE = /^SMK2026-\d{6}$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
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
  const requireSecret =
    process.env.REGISTRATION_EMAIL_REQUIRE_SECRET === "true" ||
    (process.env.NODE_ENV === "production" && Boolean(emailSecret));

  if (requireSecret) {
    if (!emailSecret) {
      return NextResponse.json({ error: "Email endpoint not configured" }, { status: 503 });
    }
    const provided =
      request.headers.get("x-registration-secret") ??
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!provided || provided !== emailSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (emailSecret) {
    const provided =
      request.headers.get("x-registration-secret") ??
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (provided && provided !== emailSecret) {
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

    const reg = await prisma.registration.findFirst({
      where: registrationUuid
        ? { id: String(registrationUuid), deletedAt: null }
        : { registrationId, deletedAt: null },
    });

    if (!reg) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const fee = reg.registrationFee != null ? Number(reg.registrationFee) : 0;
    const categoryLabel = String(reg.registrationType);
    const lookupToken = createRegistrationLookupToken(reg.registrationId, reg.email);
    const isPaidOnline = fee > 0 && Boolean(reg.razorpayPaymentId);

    const { receiptPdf, qrPng } = await buildRegistrationArtifacts(
      {
        registrationId: reg.registrationId,
        fullName: reg.fullName,
        category: categoryLabel,
        institution: reg.institution ?? "N/A",
        email: reg.email,
        contactNumber: reg.contactNumber,
        amount: fee,
        paymentId: reg.razorpayPaymentId ?? undefined,
        orderId: reg.razorpayOrderId ?? undefined,
      },
      { registrationType: String(reg.registrationType) }
    );

    const log = await sendRegistrationCompleteEmail({
      registrationId: reg.registrationId,
      registrationUuid: reg.id,
      fullName: reg.fullName,
      email: reg.email,
      category: categoryLabel,
      amountPaid: fee,
      transactionId: reg.razorpayPaymentId ?? undefined,
      receiptUrl: receiptDownloadUrl(reg.registrationId, lookupToken),
      receiptPdf,
      qrPng,
      isPaid: isPaidOnline,
    });

    await prisma.registration.update({
      where: { id: reg.id },
      data: {
        emailDeliveryStatus: mapDeliveryStatus(log.status),
      },
    });

    return NextResponse.json({
      success: log.status === "sent",
      emailStatus: log.status,
      emailLogId: log.id,
      errorMessage: log.errorMessage ?? undefined,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      {
        success: false,
        emailStatus: "failed",
        error: error instanceof Error ? error.message : "Failed to queue email",
      },
      { status: 500 }
    );
  }
}
