import type { EmailLogStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import {
  sendRegistrationCompleteEmail,
  mapDeliveryStatus,
} from "@/server/services/email.service";
import {
  generateRegistrationQrBuffer,
  receiptDownloadUrl,
  qrStoragePathFor,
} from "@/server/services/receipt.service";
import { createRegistrationLookupToken } from "@/lib/security/registration-lookup";
import type { SaveRegistrationResult } from "@/server/services/registration.service";

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
      qrGeneratedAt: sentNow,
      qrStoragePath: undefined,
    },
  });
}

export type RegistrationPostSubmitInput = {
  result: SaveRegistrationResult;
  registrationType: string;
  data: Record<string, unknown>;
  email: string;
  fullName: string;
  contact: string;
  fee: number;
  razorpayPaymentId: string;
};

function buildReceiptPayload(input: RegistrationPostSubmitInput) {
  const payment = input.data.payment as Record<string, unknown> | undefined;
  const categoryLabel = String(
    input.data.category ??
      input.data.projectStudentType ??
      input.data.accommodationBedType ??
      input.data.delegateCategory ??
      input.registrationType
  );

  return {
    receiptPayload: {
      registrationId: input.result.registrationId,
      fullName: input.fullName,
      category: categoryLabel,
      institution: String(input.data.institution ?? "N/A"),
      email: input.email,
      contactNumber: input.contact,
      amount: input.fee,
      paymentId: input.razorpayPaymentId || undefined,
      orderId: String(input.data.razorpayOrderId ?? payment?.razorpayOrderId ?? ""),
      panNumber: String(input.data.panNumber ?? payment?.panNumber ?? "") || undefined,
    },
    categoryLabel,
    isPaidOnline: input.fee > 0 && Boolean(input.razorpayPaymentId),
  };
}

/**
 * Fast confirmation email — QR + success link only (no Chromium PDF).
 * Called synchronously on submit so delivery completes before the response ends.
 */
export async function sendRegistrationConfirmationEmailFast(
  input: RegistrationPostSubmitInput
) {
  const built = buildReceiptPayload(input);
  const lookupToken = createRegistrationLookupToken(input.result.registrationId, input.email);

  const qrPng = await generateRegistrationQrBuffer({
    registrationId: built.receiptPayload.registrationId,
    fullName: built.receiptPayload.fullName,
    registrationType: input.registrationType,
    category: built.receiptPayload.category,
    institution: built.receiptPayload.institution,
    email: built.receiptPayload.email,
  });

  try {
    const emailLog = await sendRegistrationCompleteEmail({
      registrationId: input.result.registrationId,
      registrationUuid: input.result.id,
      fullName: input.fullName,
      email: input.email,
      category: built.categoryLabel,
      amountPaid: input.fee,
      transactionId: input.razorpayPaymentId || undefined,
      receiptUrl: receiptDownloadUrl(input.result.registrationId, lookupToken),
      qrPng,
      isPaid: built.isPaidOnline,
    });

    const logRow = await prisma.emailLog.findUnique({ where: { id: emailLog.id } });

    await prisma.registration.update({
      where: { id: input.result.id },
      data: {
        qrGeneratedAt: new Date(),
        qrStoragePath: qrStoragePathFor(input.result.registrationId),
        emailDeliveryStatus: mapDeliveryStatus(emailLog.status),
        receiptSentAt: emailLog.status === "sent" ? new Date() : undefined,
        qrSentAt: emailLog.status === "sent" ? new Date() : undefined,
      },
    });

    if (emailLog.status === "skipped" || emailLog.status === "failed") {
      throw new ServiceError(
        logRow?.errorMessage ??
          "Email delivery is not configured on the server. Please download your receipt from the success page.",
        503,
        "EMAIL_NOT_CONFIGURED"
      );
    }

    return emailLog;
  } catch (err) {
    console.error("REGISTRATION_CONFIRMATION_EMAIL_FAILED", {
      registrationId: input.result.registrationId,
      error: err instanceof Error ? err.message : String(err),
    });
    try {
      await updateEmailStatus(input.result.id, "failed");
    } catch (updateErr) {
      console.error("EMAIL_FAILURE_STATUS_UPDATE_FAILED", {
        registrationId: input.result.registrationId,
        error: updateErr instanceof Error ? updateErr.message : String(updateErr),
      });
    }
    throw err;
  }
}

/** @deprecated use sendRegistrationConfirmationEmailFast */
export async function ensureRegistrationArtifacts(input: RegistrationPostSubmitInput) {
  return sendRegistrationConfirmationEmailFast(input);
}

/** @deprecated use sendRegistrationConfirmationEmailFast */
export async function runRegistrationPostSubmit(input: RegistrationPostSubmitInput) {
  await sendRegistrationConfirmationEmailFast(input);
}

/** Resend confirmation for an existing registration (success page / support). */
export async function resendRegistrationConfirmationEmail(
  input: RegistrationPostSubmitInput
) {
  return sendRegistrationConfirmationEmailFast(input);
}
