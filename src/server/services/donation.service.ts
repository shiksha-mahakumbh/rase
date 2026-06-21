import type { DonationKind, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import {
  buildDonationReceiptData,
} from "@/lib/receipt/donation-receipt";
import { generateDonationReceiptPdfBuffer } from "@/lib/receipt/donation-receipt-pdf";
import { sendDonationReceiptEmail } from "@/server/services/donation-email.service";
import { markVerifiedPaymentConsumed } from "@/server/services/razorpay-verified.service";
import { SITE_URL } from "@/config/site";
import { writeAuditLog } from "@/server/services/audit.service";

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

async function generateDonationId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `DON${year}`;
  const last = await prisma.donationRecord.findFirst({
    where: { donationId: { startsWith: prefix } },
    orderBy: { donationId: "desc" },
    select: { donationId: true },
  });
  const lastNum = last ? Number.parseInt(last.donationId.split("-")[1] ?? "0", 10) : 0;
  return `${prefix}-${String(lastNum + 1).padStart(6, "0")}`;
}

async function assertVerifiedPaymentForDonation(paymentId: string, expectedAmountRupees: number) {
  const expectedPaise = Math.round(expectedAmountRupees * 100);

  const existingDonation = await prisma.donationRecord.findFirst({
    where: { razorpayPaymentId: paymentId, deletedAt: null },
    select: { donationId: true, receiptToken: true },
  });

  if (existingDonation) {
    return {
      duplicate: true as const,
      donationId: existingDonation.donationId,
      receiptToken: existingDonation.receiptToken,
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
    return {
      duplicate: true as const,
      donationId: verified.registrationPublicId,
      receiptToken: "",
    };
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

  return {
    duplicate: false as const,
    verifiedPaymentId: verified.id,
    orderId: verified.razorpayOrderId,
  };
}

export async function completeDonation(input: CompleteDonationInput) {
  const pan = input.panNumber.trim().toUpperCase();
  const amount = Math.round(input.amount);
  const prismaKind: DonationKind =
    input.donationKind === "sponsorship" ? "Sponsorship" : "Donation";

  const paymentCheck = await assertVerifiedPaymentForDonation(
    input.razorpayPaymentId,
    amount
  );

  if (paymentCheck.duplicate) {
    const existing = await prisma.donationRecord.findFirst({
      where: { donationId: paymentCheck.donationId, deletedAt: null },
    });
    if (existing) {
      return {
        donationId: existing.donationId,
        receiptToken: existing.receiptToken,
        duplicate: true,
      };
    }
  }

  const donationId = await generateDonationId();
  const receiptToken = randomUUID();

  const record = await prisma.donationRecord.create({
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

  await markVerifiedPaymentConsumed(
    input.razorpayPaymentId,
    record.id,
    donationId
  );

  const receiptData = buildDonationReceiptData({
    donationId,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    panNumber: record.panNumber,
    organization: record.organization,
    address: record.address,
    donationKind: prismaKind,
    amount,
    paymentId: input.razorpayPaymentId,
    orderId: input.razorpayOrderId,
    transactionDate: record.createdAt,
  });

  const receiptPdf = generateDonationReceiptPdfBuffer(receiptData);
  const receiptUrl = `${SITE_URL}/api/donation/receipt?token=${receiptToken}`;

  try {
    await sendDonationReceiptEmail({
      donationId,
      fullName: record.fullName,
      email: record.email,
      amount,
      donationKind: prismaKind,
      receiptUrl,
      receiptPdf,
    });

    await prisma.donationRecord.update({
      where: { id: record.id },
      data: { receiptSentAt: new Date() },
    });
  } catch (error) {
    console.error("DONATION_RECEIPT_EMAIL_FAILED", {
      donationId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  void writeAuditLog({
    action: "payment_completed",
    entityType: "donation",
    entityId: record.id,
    payload: {
      donation_id: donationId,
      amount,
      email: record.email,
      kind: prismaKind,
    },
  });

  return {
    donationId,
    receiptToken,
    duplicate: false,
  };
}

export async function getDonationByReceiptToken(token: string) {
  return prisma.donationRecord.findFirst({
    where: { receiptToken: token, deletedAt: null },
  });
}

export function donationReceiptPdfForRecord(record: {
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

  return generateDonationReceiptPdfBuffer(data);
}
