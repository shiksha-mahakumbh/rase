import { NextRequest, NextResponse } from "next/server";
import { saveRegistration } from "@/server/services/registration.service";
import { isSupportedType } from "@/server/lib/registration-types";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { getRequestContext } from "@/server/lib/request";
import { sendRegistrationConfirmation, mapDeliveryStatus } from "@/server/services/email.service";
import { prisma } from "@/server/db/prisma";
import { normalizePhoneInput, validatePanForAmount } from "@/lib/registration/validation";
import { resolveRegistrationFee } from "@/lib/registration/fees";
import type { PaymentStatus, RegistrationType } from "@/types/registration";

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

    const contact = normalizePhoneInput(String(data.contactNumber ?? ""));
    if (contact.length !== 10) {
      return NextResponse.json(
        { error: "Valid 10-digit contact number is required" },
        { status: 400 }
      );
    }
    data.contactNumber = contact;

    const payment = data.payment as Record<string, unknown> | undefined;
    const fee = Number(data.registrationFee ?? payment?.registrationFee ?? 0);
    const expectedFee = resolveRegistrationFee(type as RegistrationType, {
      delegateCategory: String(data.delegateCategory ?? ""),
      projectStudentType:
        data.projectStudentType === "College Student"
          ? "College Student"
          : data.projectStudentType === "School Student"
            ? "School Student"
            : String(data.category ?? "").includes("College")
              ? "College Student"
              : "School Student",
      accommodationBedType:
        data.accommodationBedType === "Double Bed"
          ? "Double Bed"
          : String(data.title ?? "").includes("Double")
            ? "Double Bed"
            : "Single Bed",
    });

    if (type !== "Olympiad" && fee !== expectedFee) {
      return NextResponse.json(
        { error: "Registration fee does not match selected category" },
        { status: 400 }
      );
    }
    const panErr = validatePanForAmount(
      String(data.panNumber ?? payment?.panNumber ?? ""),
      fee
    );
    if (panErr) {
      return NextResponse.json({ error: panErr }, { status: 400 });
    }

    if (fee > 0) {
      const hasProof = Boolean(
        data.razorpayPaymentId ||
          payment?.razorpayPaymentId ||
          data.utrNumber ||
          payment?.utrNumber ||
          data.paymentReceipt
      );
      if (!hasProof) {
        return NextResponse.json(
          { error: "Payment proof is required for paid registration" },
          { status: 400 }
        );
      }
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

    void sendRegistrationConfirmation({
      registrationId: result.registrationId,
      registrationUuid: result.id,
      fullName,
      email,
    })
      .then(async (log) => {
        await prisma.registration.update({
          where: { id: result.id },
          data: {
            emailDeliveryStatus: mapDeliveryStatus(log.status),
          },
        });
      })
      .catch((err) => {
        console.error("[registration submit] email queue failed:", {
          registrationId: result.registrationId,
          registrationUuid: result.id,
          recipient: email,
          error: err instanceof Error ? err.message : String(err),
        });
        void prisma.registration.update({
          where: { id: result.id },
          data: { emailDeliveryStatus: "failed" },
        });
      });

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
