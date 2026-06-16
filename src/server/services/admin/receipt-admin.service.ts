import type { Registration, PaymentRecord, EmailLog } from "@prisma/client";
import {
  generateReceiptPdfBuffer,
  generateRegistrationQrBuffer,
  receiptDownloadUrl,
  qrStoragePathFor,
  type ReceiptPayload,
} from "@/server/services/receipt.service";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { createRegistrationLookupToken } from "@/lib/security/registration-lookup";
import { sendRegistrationCompleteEmail } from "@/server/services/email.service";

const PRISMA_TYPE_LABEL: Record<string, string> = {
  Conclave: "Conclave",
  Delegate: "Delegate Registration",
  Exhibition: "Projects / Exhibition",
  Accommodation: "Accommodation",
  Volunteer: "Volunteer",
  Participant: "School Program",
  Olympiad: "Olympiad",
  Awards: "Awards",
  Best_Practices: "Best Practices",
  Talent: "Cultural Program",
  NGO: "NGO",
  Legacy_Other: "Other",
};

export function displayRegistrationType(type: string): string {
  return PRISMA_TYPE_LABEL[type] ?? type.replace(/_/g, " ");
}

export function buildReceiptPayloadFromRegistration(
  reg: Registration & { paymentRecords?: PaymentRecord[] }
): ReceiptPayload {
  const payment = reg.paymentRecords?.[0];
  const meta = (reg.metadata ?? {}) as Record<string, unknown>;
  const fee = Number(reg.registrationFee ?? payment?.amount ?? 0);

  return {
    registrationId: reg.registrationId,
    fullName: reg.fullName,
    category: String(
      meta.category ??
        meta.projectStudentType ??
        meta.accommodationBedType ??
        meta.delegateCategory ??
        displayRegistrationType(String(reg.registrationType))
    ),
    institution: reg.institution,
    email: reg.email,
    contactNumber: reg.contactNumber,
    amount: fee,
    paymentId: reg.razorpayPaymentId ?? payment?.razorpayPaymentId ?? undefined,
    orderId: reg.razorpayOrderId ?? payment?.razorpayOrderId ?? undefined,
    panNumber: String(meta.panNumber ?? "") || undefined,
    transactionDate: reg.updatedAt.toISOString(),
  };
}

export async function getRegistrationForAdmin(uuid: string) {
  const reg = await prisma.registration.findFirst({
    where: { id: uuid, deletedAt: null },
    include: {
      paymentRecords: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      emailLogs: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!reg) throw new ServiceError("Registration not found", 404, "NOT_FOUND");
  return reg;
}

export async function getRegistrationByPublicId(publicId: string) {
  const reg = await prisma.registration.findFirst({
    where: { registrationId: publicId, deletedAt: null },
    include: {
      paymentRecords: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!reg) throw new ServiceError("Registration not found", 404, "NOT_FOUND");
  return reg;
}

export async function regenerateReceipt(publicId: string, actorUserId?: string) {
  const reg = await getRegistrationByPublicId(publicId);
  const payload = buildReceiptPayloadFromRegistration(reg);
  const qrPng = await generateRegistrationQrBuffer(publicId);
  const pdf = generateReceiptPdfBuffer(payload, qrPng);
  const now = new Date();

  await prisma.registration.update({
    where: { id: reg.id },
    data: { receiptGeneratedAt: now },
  });

  await writeAuditLog({
    action: "receipt_generated",
    actorUserId,
    registrationId: reg.id,
    payload: {
      registration_id: publicId,
      payment_id: reg.razorpayPaymentId,
      order_id: reg.razorpayOrderId,
      user_email: reg.email,
    },
  });

  return { pdf, registrationId: publicId, generatedAt: now };
}

export async function regenerateQr(publicId: string, actorUserId?: string) {
  const reg = await getRegistrationByPublicId(publicId);
  const qr = await generateRegistrationQrBuffer(publicId);
  const path = qrStoragePathFor(publicId);
  const now = new Date();

  await prisma.registration.update({
    where: { id: reg.id },
    data: { qrGeneratedAt: now, qrStoragePath: path },
  });

  await writeAuditLog({
    action: "qr_generated",
    actorUserId,
    registrationId: reg.id,
    payload: {
      registration_id: publicId,
      qr_path: path,
      user_email: reg.email,
    },
  });

  return { qr, path, registrationId: publicId, generatedAt: now };
}

export async function resendPaymentEmail(publicId: string, actorUserId?: string) {
  const reg = await getRegistrationByPublicId(publicId);
  const payload = buildReceiptPayloadFromRegistration(reg);
  const fee = payload.amount;
  const isPaidOnline = fee > 0 && Boolean(reg.razorpayPaymentId);

  const qrPng = await generateRegistrationQrBuffer(publicId);
  const receiptPdf = generateReceiptPdfBuffer(payload, qrPng);
  const lookupToken = createRegistrationLookupToken(publicId, reg.email);
  const now = new Date();

  const log = await sendRegistrationCompleteEmail({
    registrationId: publicId,
    registrationUuid: reg.id,
    fullName: reg.fullName,
    email: reg.email,
    category: payload.category,
    amountPaid: fee,
    transactionId: reg.razorpayPaymentId ?? undefined,
    receiptUrl: isPaidOnline
      ? receiptDownloadUrl(publicId, lookupToken)
      : undefined,
    receiptPdf,
    qrPng,
    isPaid: isPaidOnline,
  });

  await prisma.registration.update({
    where: { id: reg.id },
    data: {
      receiptGeneratedAt: now,
      receiptSentAt: now,
      qrGeneratedAt: now,
      qrStoragePath: qrStoragePathFor(publicId),
      qrSentAt: now,
      emailDeliveryStatus: log.status === "sent" ? "sent" : "failed",
    },
  });

  await writeAuditLog({
    action: "email_resent",
    actorUserId,
    registrationId: reg.id,
    payload: {
      registration_id: publicId,
      payment_id: reg.razorpayPaymentId,
      template: "registration_complete",
      user_email: reg.email,
      email_log_id: log.id,
    },
  });

  return { emailLogId: log.id, status: log.status };
}

export type PaymentRowStatus = {
  receipt: "generated" | "missing" | "na";
  email: "sent" | "failed" | "pending" | "skipped" | "unknown";
  qr: "generated" | "missing" | "na";
};

export function deriveArtifactStatus(reg: {
  paymentStatus: string;
  registrationFee: unknown;
  receiptGeneratedAt: Date | null;
  qrGeneratedAt: Date | null;
  emailDeliveryStatus: string | null;
  emailLogs?: Pick<EmailLog, "status">[];
}): PaymentRowStatus {
  const isPaid =
    reg.paymentStatus === "Paid" && Number(reg.registrationFee ?? 0) > 0;

  let email: PaymentRowStatus["email"] = "unknown";
  if (reg.emailDeliveryStatus === "sent") email = "sent";
  else if (reg.emailDeliveryStatus === "failed") email = "failed";
  else if (reg.emailDeliveryStatus === "pending") email = "pending";
  else if (reg.emailDeliveryStatus === "skipped") email = "skipped";
  else if (reg.emailLogs?.[0]?.status === "sent") email = "sent";
  else if (reg.emailLogs?.[0]?.status === "failed") email = "failed";

  if (!isPaid) {
    return { receipt: "na", email, qr: "na" };
  }

  return {
    receipt: reg.receiptGeneratedAt ? "generated" : "missing",
    qr: reg.qrGeneratedAt ? "generated" : "missing",
    email,
  };
}
