import type { DonationKind, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { expectedDonationAmountRupees } from "@/lib/donation/tier-amount";
import { isPrismaUniqueViolation } from "@/lib/prisma/errors";
import { buildDonationReceiptData } from "@/lib/receipt/donation-receipt";
import { generateDonationReceiptPdfBuffer } from "@/lib/receipt/donation-receipt-pdf";
import { SITE_URL } from "@/config/site";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import { writeAuditLog } from "@/server/services/audit.service";
import { sendDonationReceiptEmail } from "@/server/services/donation-email.service";

export type CompleteDonationInput = {
  donationKind: "donation" | "sponsorship";
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  organization?: string;
  address?: string;
  amount: number;
  tierId?: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
};

export type CompleteDonationResult = {
  donationId: string;
  receiptToken: string;
  duplicate: boolean;
  emailSent: boolean;
};

async function generateDonationIdTx(tx: Prisma.TransactionClient): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `DON${year}`;
  const last = await tx.donationRecord.findFirst({
    where: { donationId: { startsWith: prefix } },
    orderBy: { donationId: "desc" },
    select: { donationId: true },
  });
  const lastNum = last ? Number.parseInt(last.donationId.split("-")[1] ?? "0", 10) : 0;
  return `${prefix}-${String(lastNum + 1).padStart(6, "0")}`;
}

async function findDonationByPaymentId(paymentId: string) {
  return prisma.donationRecord.findFirst({
    where: { razorpayPaymentId: paymentId, deletedAt: null },
    select: { donationId: true, receiptToken: true, receiptSentAt: true },
  });
}

async function assertVerifiedPaymentForDonation(paymentId: string, expectedAmountRupees: number) {
  const expectedPaise = Math.round(expectedAmountRupees * 100);

  const existingDonation = await findDonationByPaymentId(paymentId);
  if (existingDonation) {
    return {
      duplicate: true as const,
      donationId: existingDonation.donationId,
      receiptToken: existingDonation.receiptToken,
      emailSent: Boolean(existingDonation.receiptSentAt),
    };
  }

  const verified = await prisma.razorpayVerifiedPayment.findUnique({
    where: { razorpayPaymentId: paymentId },
  });

  if (!verified) {
    throw new ServiceError(
      "Payment not verified. Complete Razorpay checkout before submitting.",
      400,
      "PAYMENT_NOT_VERIFIED"
    );
  }

  if (verified.consumedAt && verified.registrationPublicId?.startsWith("DON")) {
    const linked = await prisma.donationRecord.findFirst({
      where: { donationId: verified.registrationPublicId, deletedAt: null },
      select: { donationId: true, receiptToken: true, receiptSentAt: true },
    });
    if (linked) {
      return {
        duplicate: true as const,
        donationId: linked.donationId,
        receiptToken: linked.receiptToken,
        emailSent: Boolean(linked.receiptSentAt),
      };
    }
  }

  if (verified.consumedAt) {
    throw new ServiceError(
      "This payment has already been used.",
      409,
      "PAYMENT_ALREADY_USED"
    );
  }

  if (Math.abs(verified.amountPaise - expectedPaise) > 1) {
    throw new ServiceError(
      "Payment amount does not match donation amount.",
      400,
      "AMOUNT_MISMATCH"
    );
  }

  return { duplicate: false as const };
}

async function deliverDonationReceipt(record: {
  id: string;
  donationId: string;
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  organization: string | null;
  address: string | null;
  donationKind: DonationKind;
  amount: { toNumber?: () => number } | number | Prisma.Decimal;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  createdAt: Date;
  receiptToken: string;
}): Promise<boolean> {
  const amount =
    typeof record.amount === "number"
      ? record.amount
      : typeof record.amount === "object" &&
          record.amount !== null &&
          "toNumber" in record.amount &&
          typeof record.amount.toNumber === "function"
        ? record.amount.toNumber()
        : Number(record.amount);

  const receiptData = buildDonationReceiptData({
    donationId: record.donationId,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    panNumber: record.panNumber,
    organization: record.organization,
    address: record.address,
    donationKind: record.donationKind,
    amount,
    paymentId: record.razorpayPaymentId,
    orderId: record.razorpayOrderId,
    transactionDate: record.createdAt,
  });

  const receiptPdf = await generateDonationReceiptPdfBuffer(receiptData);
  const receiptUrl = `${SITE_URL}/api/donation/receipt?token=${record.receiptToken}`;

  await sendDonationReceiptEmail({
    donationId: record.donationId,
    fullName: record.fullName,
    email: record.email,
    amount,
    donationKind: record.donationKind,
    receiptUrl,
    receiptPdf,
  });

  await prisma.donationRecord.update({
    where: { id: record.id },
    data: { receiptSentAt: new Date() },
  });

  return true;
}

export async function completeDonation(input: CompleteDonationInput): Promise<CompleteDonationResult> {
  const pan = input.panNumber.trim().toUpperCase();
  const prismaKind: DonationKind =
    input.donationKind === "sponsorship" ? "Sponsorship" : "Donation";

  const amountCheck = expectedDonationAmountRupees({
    donationKind: input.donationKind,
    amount: input.amount,
    tierId: input.tierId,
  });
  if (!amountCheck.ok) {
    throw new ServiceError(amountCheck.message, 400, "INVALID_TIER_AMOUNT");
  }
  const amount = amountCheck.amount;

  const paymentCheck = await assertVerifiedPaymentForDonation(
    input.razorpayPaymentId,
    amount
  );

  if (paymentCheck.duplicate) {
    return {
      donationId: paymentCheck.donationId,
      receiptToken: paymentCheck.receiptToken,
      duplicate: true,
      emailSent: paymentCheck.emailSent,
    };
  }

  let record: Awaited<ReturnType<typeof prisma.donationRecord.create>>;
  let created = false;

  try {
    const txResult = await prisma.$transaction(async (tx) => {
      const existing = await tx.donationRecord.findFirst({
        where: { razorpayPaymentId: input.razorpayPaymentId, deletedAt: null },
      });
      if (existing) {
        return { record: existing, created: false };
      }

      const verified = await tx.razorpayVerifiedPayment.findUnique({
        where: { razorpayPaymentId: input.razorpayPaymentId },
      });
      if (!verified || verified.consumedAt) {
        throw new ServiceError(
          "Payment not available for this donation.",
          409,
          "PAYMENT_NOT_AVAILABLE"
        );
      }

      const donationId = await generateDonationIdTx(tx);
      const receiptToken = randomUUID();

      const created = await tx.donationRecord.create({
        data: {
          donationId,
          donationKind: prismaKind,
          fullName: input.fullName.trim(),
          email: input.email.trim().toLowerCase(),
          phone: input.phone.trim(),
          panNumber: pan,
          organization: input.organization?.trim() || null,
          address: input.address?.trim() || null,
          amount,
          razorpayOrderId: input.razorpayOrderId,
          razorpayPaymentId: input.razorpayPaymentId,
          paymentStatus: "Paid",
          receiptToken,
          metadata: {
            tierId: input.tierId ?? null,
          } as Prisma.InputJsonValue,
        },
      });

      await tx.razorpayVerifiedPayment.update({
        where: { razorpayPaymentId: input.razorpayPaymentId },
        data: {
          consumedAt: new Date(),
          registrationUuid: created.id,
          registrationPublicId: donationId,
        },
      });

      return { record: created, created: true };
    });
    record = txResult.record;
    created = txResult.created;
  } catch (error) {
    if (isPrismaUniqueViolation(error)) {
      const existing = await findDonationByPaymentId(input.razorpayPaymentId);
      if (existing) {
        return {
          donationId: existing.donationId,
          receiptToken: existing.receiptToken,
          duplicate: true,
          emailSent: Boolean(existing.receiptSentAt),
        };
      }
    }
    throw error;
  }

  if (!created) {
    return {
      donationId: record.donationId,
      receiptToken: record.receiptToken,
      duplicate: true,
      emailSent: Boolean(record.receiptSentAt),
    };
  }

  let emailSent = false;
  try {
    emailSent = await deliverDonationReceipt(record);
  } catch (error) {
    console.error("DONATION_RECEIPT_EMAIL_FAILED", {
      donationId: record.donationId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  void writeAuditLog({
    action: "payment_completed",
    entityType: "donation",
    entityId: record.id,
    payload: {
      donation_id: record.donationId,
      amount,
      email: record.email,
      kind: prismaKind,
      email_sent: emailSent,
    },
  });

  return {
    donationId: record.donationId,
    receiptToken: record.receiptToken,
    duplicate: false,
    emailSent,
  };
}

export async function resendDonationReceiptEmail(donationId: string): Promise<{ emailSent: true }> {
  const record = await prisma.donationRecord.findFirst({
    where: { donationId, deletedAt: null },
  });
  if (!record) {
    throw new ServiceError("Donation not found", 404, "DONATION_NOT_FOUND");
  }

  await deliverDonationReceipt(record);
  return { emailSent: true };
}

export async function listDonationRecords(options: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const limit = Math.min(options.limit ?? 50, 100);
  const offset = options.offset ?? 0;
  const search = options.search?.trim();

  const where: Prisma.DonationRecordWhereInput = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { donationId: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { fullName: { contains: search, mode: "insensitive" } },
            { panNumber: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.donationRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        donationId: true,
        donationKind: true,
        fullName: true,
        email: true,
        phone: true,
        amount: true,
        receiptSentAt: true,
        receiptToken: true,
        createdAt: true,
      },
    }),
    prisma.donationRecord.count({ where }),
  ]);

  return {
    items: items.map((row) => ({
      donationId: row.donationId,
      donationKind: row.donationKind,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      amount: Number(row.amount),
      receiptSentAt: row.receiptSentAt,
      createdAt: row.createdAt,
      receiptDownloadUrl: `${SITE_URL}/api/donation/receipt?token=${row.receiptToken}`,
    })),
    total,
    limit,
    offset,
  };
}

export async function getDonationByReceiptToken(token: string) {
  return prisma.donationRecord.findFirst({
    where: { receiptToken: token, deletedAt: null },
  });
}

export async function donationReceiptPdfForRecord(record: {
  donationId: string;
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  organization: string | null;
  address: string | null;
  donationKind: DonationKind;
  amount: { toNumber?: () => number } | number;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  createdAt: Date;
}) {
  const amount =
    typeof record.amount === "number"
      ? record.amount
      : typeof record.amount.toNumber === "function"
        ? record.amount.toNumber()
        : Number(record.amount);

  const data = buildDonationReceiptData({
    donationId: record.donationId,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    panNumber: record.panNumber,
    organization: record.organization,
    address: record.address,
    donationKind: record.donationKind,
    amount,
    paymentId: record.razorpayPaymentId,
    orderId: record.razorpayOrderId,
    transactionDate: record.createdAt,
  });

  return await generateDonationReceiptPdfBuffer(data);
}

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
