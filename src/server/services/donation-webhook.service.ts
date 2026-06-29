import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";

async function findDonationByPaymentId(paymentId: string) {
  return prisma.donationRecord.findFirst({
    where: { razorpayPaymentId: paymentId, deletedAt: null },
    select: { donationId: true, receiptToken: true, receiptSentAt: true },
  });
}

/** Lightweight webhook handler — keep separate from donation.service to avoid PDF/Chromium in payment routes. */
export async function handleDonationWebhookPayment(input: {
  orderId?: string | null;
  razorpayPaymentId?: string | null;
  notes?: Record<string, string> | null;
}) {
  const purpose = input.notes?.purpose?.toLowerCase();
  if (purpose !== "donation") {
    return null;
  }

  if (input.orderId) {
    const byOrder = await prisma.donationRecord.findFirst({
      where: { razorpayOrderId: input.orderId, deletedAt: null },
      select: { donationId: true },
    });
    if (byOrder) {
      return { ok: true as const, donationId: byOrder.donationId, status: "linked" as const };
    }
  }

  if (input.razorpayPaymentId) {
    const byPayment = await findDonationByPaymentId(input.razorpayPaymentId);
    if (byPayment) {
      return { ok: true as const, donationId: byPayment.donationId, status: "linked" as const };
    }
  }

  void writeAuditLog({
    action: "system_event",
    entityType: "donation",
    payload: {
      event: "donation_webhook_pending_complete",
      order_id: input.orderId ?? null,
      payment_id: input.razorpayPaymentId ?? null,
    },
  });

  return { ok: true as const, status: "awaiting_complete" as const };
}
