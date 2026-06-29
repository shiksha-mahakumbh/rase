import { NextRequest, NextResponse } from "next/server";
import { saveRegistration } from "@/server/services/registration.service";
import { isSupportedType } from "@/server/lib/registration-types";
import { verifyRegistrationSubmitCaptcha } from "@/lib/security/registration-captcha";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { getRequestContext } from "@/server/lib/request";
import {
  sendRegistrationCompleteEmail,
  mapDeliveryStatus,
} from "@/server/services/email.service";
import { prisma } from "@/server/db/prisma";
import { normalizePhoneInput, validatePanForAmount } from "@/lib/registration/validation";
import { resolveRegistrationFee } from "@/lib/registration/fees";
import { validateDelegateRegistrationPayload } from "@/lib/registration/delegate-categories";
import type { PaymentStatus, RegistrationType } from "@/types/registration";
import {
  assertVerifiedPaymentForSubmit,
  markVerifiedPaymentConsumed,
} from "@/server/services/razorpay-verified.service";
import {
  buildRegistrationArtifacts,
  receiptDownloadUrl,
  qrStoragePathFor,
} from "@/server/services/receipt.service";
import { createRegistrationLookupToken } from "@/lib/security/registration-lookup";
import { ServiceError } from "@/server/lib/errors";
import { writeAuditLog } from "@/server/services/audit.service";
import type { EmailLogStatus } from "@prisma/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const maxDuration = 60;

function submitLog(event: string, payload: Record<string, unknown>) {
  console.info("REGISTRATION_SUBMIT", { event, ...payload });
}

async function updateEmailStatus(
  registrationUuid: string,
  outcome: "sent" | "failed",
  emailLog?: { id: string; status: EmailLogStatus } | null
) {
  const sentNow = new Date();
  const delivered = outcome === "sent" && emailLog?.status === "sent";
  await prisma.registration.update({
    where: { id: registrationUuid },
    data: {
      emailDeliveryStatus:
        outcome === "sent" && emailLog
          ? mapDeliveryStatus(emailLog.status)
          : outcome,
      receiptSentAt: delivered ? sentNow : undefined,
      qrSentAt: delivered ? sentNow : undefined,
    },
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
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

    console.info("REGISTRATION_START", {
      registrationType,
      userEmail: data?.email ?? null,
      fee: data?.registrationFee ?? null,
      paymentId: data?.razorpayPaymentId ?? null,
    });

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
    const rawFee = Number(data.registrationFee ?? payment?.registrationFee ?? 0);
    const fee = type === "Olympiad" ? 0 : rawFee;
    if (type === "Olympiad") {
      data.registrationFee = 0;
    }
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

    if (type === "Delegate Registration") {
      const delegateErr = validateDelegateRegistrationPayload(data);
      if (delegateErr) {
        return NextResponse.json({ error: delegateErr }, { status: 400 });
      }
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

    const razorpayPaymentId = String(
      data.razorpayPaymentId ?? payment?.razorpayPaymentId ?? ""
    ).trim();

    if (fee > 0 && razorpayPaymentId) {
      const paymentCheck = await assertVerifiedPaymentForSubmit(
        razorpayPaymentId,
        fee
      );

      submitLog("payment_check", {
        payment_id: razorpayPaymentId,
        fee,
        already_registered: paymentCheck.alreadyRegistered,
      });

      if (paymentCheck.alreadyRegistered && paymentCheck.registrationPublicId) {
        const lookupToken = createRegistrationLookupToken(
          paymentCheck.registrationPublicId,
          email
        );
        return NextResponse.json({
          success: true,
          duplicate: true,
          registrationId: paymentCheck.registrationPublicId,
          masterDocId: paymentCheck.registrationUuid,
          lookupToken,
        });
      }

      if (!paymentCheck.alreadyRegistered && paymentCheck.orderId) {
        data.razorpayOrderId = data.razorpayOrderId ?? paymentCheck.orderId;
        if (payment && !payment.razorpayOrderId) {
          payment.razorpayOrderId = paymentCheck.orderId;
        }
      }
    }

    const captcha = await verifyRegistrationSubmitCaptcha({
      captchaToken,
      fee,
      razorpayPaymentId,
    });
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

    submitLog("saved", {
      event: "REGISTRATION_SAVED",
      registration_id: result.registrationId,
      registration_uuid: result.id,
      registration_type: type,
      payment_id: razorpayPaymentId || null,
      fee,
      user_email: email,
    });

    if (razorpayPaymentId) {
      await markVerifiedPaymentConsumed(
        razorpayPaymentId,
        result.id,
        result.registrationId
      );
    }

    await writeAuditLog({
      action: "registration_saved",
      registrationId: result.id,
      ipAddress: ctx.ip,
      userAgent: ctx.userAgent,
      payload: {
        registration_id: result.registrationId,
        registration_type: type,
        payment_id: razorpayPaymentId || null,
        order_id: data.razorpayOrderId ?? payment?.razorpayOrderId ?? null,
        user_email: email,
      },
    });

    const lookupToken = createRegistrationLookupToken(result.registrationId, email);

    const categoryLabel = String(
      data.category ??
        data.projectStudentType ??
        data.accommodationBedType ??
        data.delegateCategory ??
        type
    );

    const isPaidOnline = fee > 0 && Boolean(razorpayPaymentId);

    const receiptPayload = {
      registrationId: result.registrationId,
      fullName,
      category: categoryLabel,
      institution: String(data.institution ?? "N/A"),
      email,
      contactNumber: contact,
      amount: fee,
      paymentId: razorpayPaymentId || undefined,
      orderId: String(data.razorpayOrderId ?? payment?.razorpayOrderId ?? ""),
      panNumber: String(data.panNumber ?? payment?.panNumber ?? "") || undefined,
    };

    const { receiptPdf, qrPng } = await buildRegistrationArtifacts(receiptPayload, {
      registrationType: type,
    });
    const artifactNow = new Date();

    await prisma.registration.update({
      where: { id: result.id },
      data: {
        receiptGeneratedAt: artifactNow,
        qrGeneratedAt: artifactNow,
        qrStoragePath: qrStoragePathFor(result.registrationId),
      },
    });

    submitLog("artifacts", {
      registration_id: result.registrationId,
      receipt_pdf_bytes: receiptPdf.length,
      qr_png_bytes: qrPng.length,
    });

    void sendRegistrationCompleteEmail({
      registrationId: result.registrationId,
      registrationUuid: result.id,
      fullName,
      email,
      category: categoryLabel,
      amountPaid: fee,
      transactionId: razorpayPaymentId || undefined,
      receiptUrl: receiptDownloadUrl(result.registrationId, lookupToken),
      receiptPdf,
      qrPng,
      isPaid: isPaidOnline,
    })
      .then(async (emailLog) => {
        try {
          await updateEmailStatus(result.id, "sent", emailLog);
        } catch (err) {
          console.error("EMAIL_STATUS_UPDATE_FAILED", {
            registrationId: result.registrationId,
            emailLogId: emailLog?.id ?? null,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      })
      .catch(async (err) => {
        console.error("EMAIL_SEND_FAILED", {
          template: "registration_complete",
          registrationId: result.registrationId,
          recipient: email,
          error: err instanceof Error ? err.message : String(err),
        });
        try {
          await updateEmailStatus(result.id, "failed");
        } catch (updateErr) {
          console.error("EMAIL_FAILURE_STATUS_UPDATE_FAILED", {
            registrationId: result.registrationId,
            error: updateErr instanceof Error ? updateErr.message : String(updateErr),
          });
        }
      });

    return NextResponse.json({
      success: true,
      registrationId: result.registrationId,
      masterDocId: result.id,
      typeDocId: result.typeDocId,
      lookupToken,
    });
  } catch (error) {
    submitLog("error", {
      event: "REGISTRATION_FAILED",
      error: error instanceof Error ? error.message : String(error),
    });
    console.error("registration submit error:", error);
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
