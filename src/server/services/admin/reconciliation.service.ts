import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import {
  getRegistrationByPublicId,
  resendPaymentEmail,
  regenerateReceipt,
  regenerateQr,
  displayRegistrationType,
  deriveArtifactStatus,
} from "@/server/services/admin/receipt-admin.service";
import { processRazorpayWebhookEvent } from "@/server/services/payment.service";

export type OrphanIssueType =
  | "verified_no_registration"
  | "registration_no_payment"
  | "payment_no_receipt"
  | "payment_email_failed"
  | "registration_no_qr";

export type OrphanRow = {
  id: string;
  issueType: OrphanIssueType;
  severity: "critical" | "warning" | "info";
  registrationId: string | null;
  registrationUuid: string | null;
  applicantName: string | null;
  email: string | null;
  mobile: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  amount: number | null;
  message: string;
  createdAt: string;
};

export async function detectOrphanPayments(): Promise<OrphanRow[]> {
  const orphans: OrphanRow[] = [];

  const verifiedUnlinked = await prisma.razorpayVerifiedPayment.findMany({
    where: { consumedAt: null },
    orderBy: { verifiedAt: "desc" },
    take: 100,
  });

  for (const vp of verifiedUnlinked) {
    orphans.push({
      id: `vp-${vp.id}`,
      issueType: "verified_no_registration",
      severity: "critical",
      registrationId: vp.registrationPublicId,
      registrationUuid: vp.registrationUuid,
      applicantName: null,
      email: String((vp.metadata as Record<string, unknown>)?.email ?? ""),
      mobile: null,
      razorpayOrderId: vp.razorpayOrderId,
      razorpayPaymentId: vp.razorpayPaymentId,
      amount: Number(vp.amount),
      message: "Payment verified but not linked to a registration",
      createdAt: vp.verifiedAt.toISOString(),
    });
  }

  const pendingPaid = await prisma.registration.findMany({
    where: {
      deletedAt: null,
      paymentStatus: "Pending_Payment",
      registrationFee: { gt: 0 },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      paymentRecords: { where: { deletedAt: null }, take: 1 },
    },
  });

  for (const reg of pendingPaid) {
    if (!reg.razorpayPaymentId && !reg.paymentRecords[0]?.razorpayPaymentId) {
      orphans.push({
        id: `reg-nopay-${reg.id}`,
        issueType: "registration_no_payment",
        severity: "warning",
        registrationId: reg.registrationId,
        registrationUuid: reg.id,
        applicantName: reg.fullName,
        email: reg.email,
        mobile: reg.contactNumber,
        razorpayOrderId: reg.razorpayOrderId,
        razorpayPaymentId: null,
        amount: Number(reg.registrationFee ?? 0),
        message: "Paid-category registration missing payment record",
        createdAt: reg.createdAt.toISOString(),
      });
    }
  }

  const paidRegs = await prisma.registration.findMany({
    where: {
      deletedAt: null,
      paymentStatus: "Paid",
      registrationFee: { gt: 0 },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      emailLogs: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  for (const reg of paidRegs) {
    const artifacts = deriveArtifactStatus(reg);

    if (artifacts.receipt === "missing") {
      orphans.push({
        id: `reg-noreceipt-${reg.id}`,
        issueType: "payment_no_receipt",
        severity: "warning",
        registrationId: reg.registrationId,
        registrationUuid: reg.id,
        applicantName: reg.fullName,
        email: reg.email,
        mobile: reg.contactNumber,
        razorpayOrderId: reg.razorpayOrderId,
        razorpayPaymentId: reg.razorpayPaymentId,
        amount: Number(reg.registrationFee ?? 0),
        message: "Payment captured but receipt not generated",
        createdAt: reg.createdAt.toISOString(),
      });
    }

    if (artifacts.email === "failed") {
      orphans.push({
        id: `reg-emailfail-${reg.id}`,
        issueType: "payment_email_failed",
        severity: "critical",
        registrationId: reg.registrationId,
        registrationUuid: reg.id,
        applicantName: reg.fullName,
        email: reg.email,
        mobile: reg.contactNumber,
        razorpayOrderId: reg.razorpayOrderId,
        razorpayPaymentId: reg.razorpayPaymentId,
        amount: Number(reg.registrationFee ?? 0),
        message: "Payment confirmed but confirmation email failed",
        createdAt: reg.createdAt.toISOString(),
      });
    }

    if (artifacts.qr === "missing") {
      orphans.push({
        id: `reg-noqr-${reg.id}`,
        issueType: "registration_no_qr",
        severity: "info",
        registrationId: reg.registrationId,
        registrationUuid: reg.id,
        applicantName: reg.fullName,
        email: reg.email,
        mobile: reg.contactNumber,
        razorpayOrderId: reg.razorpayOrderId,
        razorpayPaymentId: reg.razorpayPaymentId,
        amount: Number(reg.registrationFee ?? 0),
        message: "Registration exists but QR code not generated",
        createdAt: reg.createdAt.toISOString(),
      });
    }
  }

  return orphans.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function manualLinkPayment(input: {
  razorpayPaymentId: string;
  registrationId: string;
  actorUserId?: string;
}) {
  const reg = await getRegistrationByPublicId(input.registrationId);
  const verified = await prisma.razorpayVerifiedPayment.findUnique({
    where: { razorpayPaymentId: input.razorpayPaymentId },
  });

  if (!verified) {
    throw new ServiceError("Verified payment not found", 404, "NOT_FOUND");
  }

  await prisma.$transaction(async (tx) => {
    await tx.registration.update({
      where: { id: reg.id },
      data: {
        razorpayPaymentId: verified.razorpayPaymentId,
        razorpayOrderId: verified.razorpayOrderId,
        paymentStatus: "Paid",
        transactionId: verified.razorpayPaymentId,
      },
    });

    await tx.razorpayVerifiedPayment.update({
      where: { id: verified.id },
      data: {
        consumedAt: new Date(),
        registrationUuid: reg.id,
        registrationPublicId: reg.registrationId,
      },
    });

    const existing = await tx.paymentRecord.findFirst({
      where: { registrationId: reg.id, deletedAt: null },
    });

    if (existing) {
      await tx.paymentRecord.update({
        where: { id: existing.id },
        data: {
          razorpayPaymentId: verified.razorpayPaymentId,
          razorpayOrderId: verified.razorpayOrderId,
          status: "Paid",
          amount: verified.amount,
        },
      });
    } else {
      await tx.paymentRecord.create({
        data: {
          registrationId: reg.id,
          razorpayPaymentId: verified.razorpayPaymentId,
          razorpayOrderId: verified.razorpayOrderId,
          amount: verified.amount,
          status: "Paid",
          metadata: { linkedManually: true },
        },
      });
    }
  });

  await writeAuditLog({
    action: "payment_recovered",
    actorUserId: input.actorUserId,
    registrationId: reg.id,
    payload: {
      registration_id: input.registrationId,
      payment_id: input.razorpayPaymentId,
      order_id: verified.razorpayOrderId,
      user_email: reg.email,
      action: "manual_link",
    },
  });

  return { success: true, registrationId: input.registrationId };
}

export async function runRecoveryAction(
  action: string,
  body: Record<string, unknown>,
  actorUserId?: string
) {
  const registrationId = String(body.registrationId ?? "").trim();
  const paymentId = String(body.razorpayPaymentId ?? body.paymentId ?? "").trim();

  switch (action) {
    case "regenerate-receipt":
      if (!registrationId) throw new ServiceError("registrationId required", 400);
      return regenerateReceipt(registrationId, actorUserId);

    case "regenerate-qr":
      if (!registrationId) throw new ServiceError("registrationId required", 400);
      return regenerateQr(registrationId, actorUserId);

    case "resend-email":
      if (!registrationId) throw new ServiceError("registrationId required", 400);
      return resendPaymentEmail(registrationId, actorUserId);

    case "manual-link":
      if (!registrationId || !paymentId) {
        throw new ServiceError("registrationId and paymentId required", 400);
      }
      return manualLinkPayment({
        registrationId,
        razorpayPaymentId: paymentId,
        actorUserId,
      });

    case "send-receipt":
      if (!registrationId) throw new ServiceError("registrationId required", 400);
      await regenerateReceipt(registrationId, actorUserId);
      return resendPaymentEmail(registrationId, actorUserId);

    default:
      throw new ServiceError(`Unknown action: ${action}`, 400, "INVALID_ACTION");
  }
}

export async function listWebhookLogs(options: {
  limit?: number;
  offset?: number;
  status?: "success" | "failed" | "all";
}) {
  const { limit = 25, offset = 0, status = "all" } = options;
  const where =
    status === "success"
      ? { processed: true, signatureValid: true }
      : status === "failed"
        ? { OR: [{ processed: false }, { signatureValid: false }] }
        : {};

  const [items, total] = await Promise.all([
    prisma.webhookEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.webhookEvent.count({ where }),
  ]);

  return {
    items: items.map((e) => ({
      id: e.id,
      eventName: e.eventType,
      razorpayEventId: e.razorpayEventId,
      status: e.processed && e.signatureValid ? "success" : "failed",
      timestamp: e.createdAt.toISOString(),
      payloadSize: JSON.stringify(e.payload).length,
      retryCount: e.retryCount,
      errorMessage: e.errorMessage,
      lastProcessedAt: e.lastProcessedAt?.toISOString() ?? null,
    })),
    total,
    limit,
    offset,
  };
}

export async function retryWebhookEvent(eventId: string, actorUserId?: string) {
  const event = await prisma.webhookEvent.findUnique({ where: { id: eventId } });
  if (!event) throw new ServiceError("Webhook event not found", 404);

  const payload = event.payload as Parameters<typeof processRazorpayWebhookEvent>[0];
  const result = await processRazorpayWebhookEvent(payload);

  await prisma.webhookEvent.update({
    where: { id: eventId },
    data: {
      retryCount: { increment: 1 },
      lastProcessedAt: new Date(),
      processed: result.ok,
      errorMessage: result.error ?? null,
    },
  });

  await writeAuditLog({
    action: "webhook_retried",
    actorUserId,
    payload: {
      webhook_event_id: eventId,
      event: event.eventType,
      registration_id: result.registrationId,
      ok: result.ok,
    },
  });

  return result;
}

export { displayRegistrationType };
