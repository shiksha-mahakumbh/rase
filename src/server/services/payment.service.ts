import type { PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { handleDonationWebhookPayment } from "@/server/services/donation-webhook.service";
import { ServiceError } from "@/server/lib/errors";

/**
 * Supabase payment abstraction — Razorpay webhook and order lifecycle via Prisma.
 */

export async function createPaymentRecord(input: {
  registrationId: string;
  amount: number;
  razorpayOrderId?: string;
  status?: PaymentStatus;
  metadata?: Prisma.InputJsonValue;
}) {
  const registration = await prisma.registration.findUnique({
    where: { id: input.registrationId },
  });
  if (!registration) throw new ServiceError("Registration not found", 404);

  const record = await prisma.paymentRecord.create({
    data: {
      registrationId: input.registrationId,
      amount: input.amount,
      razorpayOrderId: input.razorpayOrderId ?? null,
      status: input.status ?? "Pending_Payment",
      metadata: input.metadata ?? {},
    },
  });

  await writeAuditLog({
    action: "payment_created",
    registrationId: input.registrationId,
    entityType: "payment_records",
    entityId: record.id,
    payload: { amount: input.amount, razorpayOrderId: input.razorpayOrderId },
  });

  return record;
}

export async function recordWebhookEvent(input: {
  eventType: string;
  razorpayEventId?: string;
  payload: Prisma.InputJsonValue;
  signatureValid: boolean;
  paymentRecordId?: string;
  errorMessage?: string;
}) {
  const existing = input.razorpayEventId
    ? await prisma.webhookEvent.findUnique({ where: { razorpayEventId: input.razorpayEventId } })
    : null;

  if (existing) {
    return { event: existing, duplicate: true };
  }

  const event = await prisma.webhookEvent.create({
    data: {
      eventType: input.eventType,
      razorpayEventId: input.razorpayEventId ?? null,
      payload: input.payload,
      signatureValid: input.signatureValid,
      paymentRecordId: input.paymentRecordId ?? null,
      processed: false,
      errorMessage: input.errorMessage ?? null,
    },
  });

  return { event, duplicate: false };
}

export async function completeWebhookEvent(
  webhookEventId: string,
  ok: boolean,
  errorMessage?: string
) {
  await prisma.webhookEvent.update({
    where: { id: webhookEventId },
    data: {
      processed: ok,
      lastProcessedAt: new Date(),
      errorMessage: errorMessage ?? null,
      retryCount: ok ? undefined : { increment: 1 },
    },
  });
}

export type RazorpayWebhookBody = Parameters<typeof processRazorpayWebhookEvent>[0] & {
  id?: string;
};

/** Persist webhook event (dedupe by Razorpay event id) then process payment/refund handlers. */
export async function ingestRazorpayWebhook(body: RazorpayWebhookBody): Promise<RazorpayWebhookResult> {
  const eventName = body.event ?? "unknown";
  const razorpayEventId = typeof body.id === "string" ? body.id : undefined;

  const recorded = await recordWebhookEvent({
    eventType: eventName,
    razorpayEventId,
    payload: body as Prisma.InputJsonValue,
    signatureValid: true,
  });

  if (recorded.duplicate) {
    return {
      ok: true,
      duplicate: true,
      event: eventName,
    };
  }

  const webhookEventId = recorded.event.id;

  try {
    const result = eventName.startsWith("refund.")
      ? await processRazorpayRefundWebhook(body)
      : await processRazorpayWebhookEvent(body);

    await completeWebhookEvent(webhookEventId, result.ok, result.error);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await completeWebhookEvent(webhookEventId, false, message);
    throw error;
  }
}

export async function markPaymentCompleted(input: {
  paymentRecordId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  webhookEventId?: string;
}) {
  const duplicate = await prisma.paymentRecord.findFirst({
    where: { razorpayPaymentId: input.razorpayPaymentId },
  });
  if (duplicate && duplicate.id !== input.paymentRecordId) {
    await prisma.paymentRecord.update({
      where: { id: input.paymentRecordId },
      data: { isDuplicate: true },
    });
    return { success: false, duplicate: true };
  }

  const record = await prisma.paymentRecord.update({
    where: { id: input.paymentRecordId },
    data: {
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature ?? null,
      status: "Paid",
      webhookEventId: input.webhookEventId ?? null,
    },
  });

  await prisma.registration.update({
    where: { id: record.registrationId },
    data: { paymentStatus: "Paid", razorpayPaymentId: input.razorpayPaymentId },
  });

  await writeAuditLog({
    action: "payment_completed",
    registrationId: record.registrationId,
    entityType: "payment_records",
    entityId: record.id,
    payload: { razorpayPaymentId: input.razorpayPaymentId },
  });

  return { success: true, record, duplicate: false };
}

export type RazorpayWebhookResult = {
  ok: boolean;
  registrationId?: string;
  registrationUuid?: string;
  paymentStatus?: PaymentStatus;
  event?: string;
  error?: string;
  duplicate?: boolean;
};

type RazorpayPaymentEntity = {
  id?: string;
  order_id?: string;
  status?: string;
  amount?: number;
  notes?: Record<string, string>;
};

function mapRazorpayStatus(status?: string): PaymentStatus {
  if (status === "captured" || status === "paid") return "Paid";
  if (status === "failed") return "Failed";
  return "Pending_Payment";
}

async function findRegistrationByOrderId(orderId: string) {
  const payment = await prisma.paymentRecord.findFirst({
    where: { razorpayOrderId: orderId, deletedAt: null },
    include: { registration: true },
  });
  if (payment?.registration) {
    return {
      paymentRecordId: payment.id,
      registrationUuid: payment.registration.id,
      registrationId: payment.registration.registrationId,
      existingPaymentId: payment.razorpayPaymentId,
      existingStatus: payment.registration.paymentStatus,
    };
  }

  const registration = await prisma.registration.findFirst({
    where: { razorpayOrderId: orderId, deletedAt: null },
  });
  if (registration) {
    return {
      paymentRecordId: undefined,
      registrationUuid: registration.id,
      registrationId: registration.registrationId,
      existingPaymentId: registration.razorpayPaymentId,
      existingStatus: registration.paymentStatus,
    };
  }

  return null;
}

async function findRegistrationByNotes(notes?: Record<string, string>) {
  if (!notes) return null;

  if (notes.registrationId) {
    const registration = await prisma.registration.findFirst({
      where: { registrationId: notes.registrationId, deletedAt: null },
    });
    if (registration) {
      return {
        paymentRecordId: undefined,
        registrationUuid: registration.id,
        registrationId: registration.registrationId,
        existingPaymentId: registration.razorpayPaymentId,
        existingStatus: registration.paymentStatus,
      };
    }
  }

  return null;
}

export async function processRazorpayWebhookEvent(body: {
  event?: string;
  payload?: {
    payment?: { entity?: RazorpayPaymentEntity };
    order?: {
      entity?: {
        id?: string;
        status?: string;
        amount?: number;
        notes?: Record<string, string>;
      };
    };
  };
}): Promise<RazorpayWebhookResult> {
  const eventName = body.event ?? "unknown";
  const paymentEntity = body.payload?.payment?.entity;
  const orderEntity = body.payload?.order?.entity;

  const orderId = paymentEntity?.order_id ?? orderEntity?.id;
  const notes = paymentEntity?.notes ?? orderEntity?.notes;
  const razorpayStatus = paymentEntity?.status ?? orderEntity?.status;
  const paymentStatus = mapRazorpayStatus(razorpayStatus);
  const razorpayPaymentId = paymentEntity?.id ?? null;
  const amountPaise = paymentEntity?.amount ?? orderEntity?.amount ?? null;
  const amount = amountPaise != null ? amountPaise / 100 : null;

  if (notes?.purpose?.toLowerCase() === "donation") {
    const donationResult = await handleDonationWebhookPayment({
      orderId,
      razorpayPaymentId,
      notes,
    });

    if (donationResult) {
      return {
        ok: true,
        event: eventName,
        registrationId: donationResult.donationId,
        paymentStatus,
        duplicate: donationResult.status === "linked",
      };
    }
  }

  const match =
    (orderId ? await findRegistrationByOrderId(orderId) : null) ??
    (await findRegistrationByNotes(notes));

  if (!match?.registrationUuid) {
    return {
      ok: false,
      event: eventName,
      error: "Registration not found for payment",
    };
  }

  if (
    match.existingStatus === "Paid" &&
    razorpayPaymentId &&
    match.existingPaymentId === razorpayPaymentId
  ) {
    return {
      ok: true,
      duplicate: true,
      event: eventName,
      registrationId: match.registrationId,
      registrationUuid: match.registrationUuid,
      paymentStatus: match.existingStatus,
    };
  }

  await prisma.registration.update({
    where: { id: match.registrationUuid },
    data: {
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId: orderId ?? undefined,
      transactionId: razorpayPaymentId ?? undefined,
    },
  });

  if (match.paymentRecordId) {
    await prisma.paymentRecord.update({
      where: { id: match.paymentRecordId },
      data: {
        status: paymentStatus,
        razorpayPaymentId,
        razorpayOrderId: orderId ?? undefined,
        amount: amount ?? undefined,
      },
    });
  } else if (orderId) {
    const existing = await prisma.paymentRecord.findFirst({
      where: { razorpayOrderId: orderId, deletedAt: null },
    });
    if (existing) {
      await prisma.paymentRecord.update({
        where: { id: existing.id },
        data: {
          status: paymentStatus,
          razorpayPaymentId,
          amount: amount ?? undefined,
        },
      });
    } else {
      await prisma.paymentRecord.create({
        data: {
          registrationId: match.registrationUuid,
          razorpayOrderId: orderId,
          razorpayPaymentId,
          amount: amount ?? 0,
          status: paymentStatus,
          metadata: { event: eventName },
        },
      });
    }
  }

  await writeAuditLog({
    action: "payment_completed",
    registrationId: match.registrationUuid,
    entityType: "payment_records",
    payload: {
      event: eventName,
      paymentStatus,
      razorpayPaymentId,
      razorpayOrderId: orderId,
      duplicate: false,
    },
  });

  return {
    ok: true,
    event: eventName,
    registrationId: match.registrationId,
    registrationUuid: match.registrationUuid,
    paymentStatus,
  };
}

type RazorpayRefundEntity = {
  id?: string;
  payment_id?: string;
  status?: string;
};

export async function processRazorpayRefundWebhook(body: {
  event?: string;
  payload?: {
    refund?: { entity?: RazorpayRefundEntity };
    payment?: { entity?: RazorpayPaymentEntity };
  };
}): Promise<RazorpayWebhookResult> {
  const eventName = body.event ?? "refund.unknown";
  const refundEntity = body.payload?.refund?.entity;
  const paymentId =
    refundEntity?.payment_id ?? body.payload?.payment?.entity?.id ?? null;
  const refundId = refundEntity?.id ?? null;
  const refundStatus = refundEntity?.status ?? "processed";

  if (!paymentId || !refundId) {
    return {
      ok: false,
      event: eventName,
      error: "Refund payload missing payment or refund id",
    };
  }

  const paymentRecord = await prisma.paymentRecord.findFirst({
    where: { razorpayPaymentId: paymentId, deletedAt: null },
    include: { registration: true },
  });

  if (paymentRecord) {
    await recordRefund({
      paymentRecordId: paymentRecord.id,
      refundId,
      refundStatus,
    });

    if (paymentRecord.registration) {
      await prisma.registration.update({
        where: { id: paymentRecord.registration.id },
        data: { paymentStatus: "Failed" },
      });
    }

    return {
      ok: true,
      event: eventName,
      registrationId: paymentRecord.registration?.registrationId,
      paymentStatus: "Failed",
    };
  }

  const donation = await prisma.donationRecord.findFirst({
    where: { razorpayPaymentId: paymentId, deletedAt: null },
  });

  if (donation) {
    await prisma.donationRecord.update({
      where: { id: donation.id },
      data: { paymentStatus: "Failed" },
    });

    await writeAuditLog({
      action: "payment_refunded",
      entityType: "donation_records",
      entityId: donation.id,
      payload: { refundId, refundStatus, razorpayPaymentId: paymentId },
    });

    return {
      ok: true,
      event: eventName,
      registrationId: donation.donationId,
      paymentStatus: "Failed",
    };
  }

  return {
    ok: false,
    event: eventName,
    error: "No payment record found for refund",
  };
}

export async function recordRefund(input: {
  paymentRecordId: string;
  refundId: string;
  refundStatus: string;
}) {
  const record = await prisma.paymentRecord.update({
    where: { id: input.paymentRecordId },
    data: {
      refundId: input.refundId,
      refundStatus: input.refundStatus,
      status: "Failed",
    },
  });

  await writeAuditLog({
    action: "payment_refunded",
    registrationId: record.registrationId,
    entityType: "payment_records",
    entityId: record.id,
    payload: { refundId: input.refundId, refundStatus: input.refundStatus },
  });

  return record;
}
