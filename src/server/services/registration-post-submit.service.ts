import type { EmailLogStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import {
  sendRegistrationCompleteEmail,
  mapDeliveryStatus,
} from "@/server/services/email.service";
import {
  buildRegistrationArtifacts,
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

/** Build receipt/QR artifacts before returning the submit response. */
export async function ensureRegistrationArtifacts(input: RegistrationPostSubmitInput) {
  const built = buildReceiptPayload(input);
  const { receiptPdf, qrPng } = await buildRegistrationArtifacts(built.receiptPayload, {
    registrationType: input.registrationType,
  });
  const artifactNow = new Date();

  await prisma.registration.update({
    where: { id: input.result.id },
    data: {
      receiptGeneratedAt: artifactNow,
      qrGeneratedAt: artifactNow,
      qrStoragePath: qrStoragePathFor(input.result.registrationId),
    },
  });

  return { receiptPdf, qrPng, ...built };
}

/** Send confirmation email after artifacts exist. */
export async function sendRegistrationConfirmationEmail(
  input: RegistrationPostSubmitInput,
  artifacts: Awaited<ReturnType<typeof ensureRegistrationArtifacts>>
) {
  const lookupToken = createRegistrationLookupToken(input.result.registrationId, input.email);

  try {
    const emailLog = await sendRegistrationCompleteEmail({
      registrationId: input.result.registrationId,
      registrationUuid: input.result.id,
      fullName: input.fullName,
      email: input.email,
      category: artifacts.categoryLabel,
      amountPaid: input.fee,
      transactionId: input.razorpayPaymentId || undefined,
      receiptUrl: receiptDownloadUrl(input.result.registrationId, lookupToken),
      receiptPdf: artifacts.receiptPdf,
      qrPng: artifacts.qrPng,
      isPaid: artifacts.isPaidOnline,
    });
    await updateEmailStatus(input.result.id, "sent", emailLog);
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

/** @deprecated use sendRegistrationConfirmationEmail */
export function queueRegistrationConfirmationEmail(
  input: RegistrationPostSubmitInput,
  artifacts: Awaited<ReturnType<typeof ensureRegistrationArtifacts>>
) {
  void sendRegistrationConfirmationEmail(input, artifacts);
}

/** Generate artifacts, then send the confirmation email (must complete on serverless). */
export async function runRegistrationPostSubmit(input: RegistrationPostSubmitInput) {
  const artifacts = await ensureRegistrationArtifacts(input);
  await sendRegistrationConfirmationEmail(input, artifacts);
}

/** Resend confirmation for an existing registration (success page / support). */
export async function resendRegistrationConfirmationEmail(
  input: RegistrationPostSubmitInput
) {
  await runRegistrationPostSubmit(input);
}
