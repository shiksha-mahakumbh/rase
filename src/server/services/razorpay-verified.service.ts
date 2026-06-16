import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import { getRazorpayClient } from "@/lib/razorpay/client.server";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay/verify";
import { getRazorpayKeySecret } from "@/lib/razorpay/config";

export type RecordVerifiedPaymentInput = {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  amountPaise?: number;
  metadata?: Record<string, unknown>;
};

function paymentLog(event: string, payload: Record<string, unknown>) {
  console.info("PAYMENT_FLOW", { event, ...payload });
}

export async function fetchRazorpayPaymentStatus(paymentId: string) {
  const razorpay = getRazorpayClient();
  const payment = await razorpay.payments.fetch(paymentId);
  return {
    status: String(payment.status ?? ""),
    amount: Number(payment.amount ?? 0),
    orderId: String(payment.order_id ?? ""),
    captured: payment.status === "captured",
  };
}

export async function recordVerifiedPayment(input: RecordVerifiedPaymentInput) {
  const keySecret = getRazorpayKeySecret();
  if (!keySecret) {
    throw new ServiceError("Razorpay not configured", 503, "RAZORPAY_NOT_CONFIGURED");
  }

  const valid = verifyRazorpayPaymentSignature(
    input.razorpayOrderId,
    input.razorpayPaymentId,
    input.razorpaySignature,
    keySecret
  );

  paymentLog("signature_check", {
    order_id: input.razorpayOrderId,
    payment_id: input.razorpayPaymentId,
    signature_valid: valid,
  });

  if (!valid) {
    throw new ServiceError("Invalid payment signature", 400, "INVALID_SIGNATURE");
  }

  let amountPaise = input.amountPaise ?? 0;
  let remoteStatus = "unknown";

  try {
    const remote = await fetchRazorpayPaymentStatus(input.razorpayPaymentId);
    remoteStatus = remote.status;
    if (remote.amount > 0) amountPaise = remote.amount;
    if (remote.orderId && remote.orderId !== input.razorpayOrderId) {
      paymentLog("order_id_mismatch", {
        payment_id: input.razorpayPaymentId,
        client_order_id: input.razorpayOrderId,
        remote_order_id: remote.orderId,
      });
    }
    if (!remote.captured) {
      throw new ServiceError(
        `Payment not captured (status: ${remote.status})`,
        400,
        "PAYMENT_NOT_CAPTURED"
      );
    }
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    paymentLog("remote_fetch_failed", {
      payment_id: input.razorpayPaymentId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  if (amountPaise < 100) {
    throw new ServiceError("Invalid payment amount", 400, "INVALID_AMOUNT");
  }

  const existingRegistration = await prisma.registration.findFirst({
    where: { razorpayPaymentId: input.razorpayPaymentId, deletedAt: null },
    select: { id: true, registrationId: true },
  });

  if (existingRegistration) {
    paymentLog("payment_already_linked", {
      payment_id: input.razorpayPaymentId,
      registration_id: existingRegistration.registrationId,
    });
    return {
      duplicate: true as const,
      registrationUuid: existingRegistration.id,
      registrationPublicId: existingRegistration.registrationId,
      amountPaise,
    };
  }

  const row = await prisma.razorpayVerifiedPayment.upsert({
    where: { razorpayPaymentId: input.razorpayPaymentId },
    create: {
      razorpayPaymentId: input.razorpayPaymentId,
      razorpayOrderId: input.razorpayOrderId,
      razorpaySignature: input.razorpaySignature,
      amountPaise,
      amount: amountPaise / 100,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
    update: {
      razorpaySignature: input.razorpaySignature,
      amountPaise,
      amount: amountPaise / 100,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });

  paymentLog("verified_payment_saved", {
    event: "PAYMENT_VERIFIED",
    order_id: input.razorpayOrderId,
    payment_id: input.razorpayPaymentId,
    amount_paise: amountPaise,
    remote_status: remoteStatus,
    verified_payment_id: row.id,
    user_email: (input.metadata as Record<string, unknown>)?.email ?? null,
    category: (input.metadata as Record<string, unknown>)?.registrationType ?? null,
  });

  return {
    duplicate: false as const,
    verifiedPaymentId: row.id,
    amountPaise,
  };
}

export async function assertVerifiedPaymentForSubmit(
  paymentId: string,
  expectedAmountRupees: number
) {
  const expectedPaise = Math.round(expectedAmountRupees * 100);

  const linked = await prisma.registration.findFirst({
    where: { razorpayPaymentId: paymentId, deletedAt: null },
    select: { id: true, registrationId: true },
  });

  if (linked) {
    return {
      alreadyRegistered: true as const,
      registrationUuid: linked.id,
      registrationPublicId: linked.registrationId,
    };
  }

  const verified = await prisma.razorpayVerifiedPayment.findUnique({
    where: { razorpayPaymentId: paymentId },
  });

  if (!verified) {
    paymentLog("verified_payment_missing", { payment_id: paymentId });
    throw new ServiceError(
      "Payment not verified. Complete Razorpay checkout before submitting.",
      400,
      "PAYMENT_NOT_VERIFIED"
    );
  }

  if (verified.consumedAt) {
    if (verified.registrationPublicId) {
      return {
        alreadyRegistered: true as const,
        registrationUuid: verified.registrationUuid ?? undefined,
        registrationPublicId: verified.registrationPublicId,
      };
    }
    throw new ServiceError(
      "This payment has already been used for another registration.",
      409,
      "PAYMENT_ALREADY_USED"
    );
  }

  if (Math.abs(verified.amountPaise - expectedPaise) > 1) {
    paymentLog("amount_mismatch", {
      payment_id: paymentId,
      expected_paise: expectedPaise,
      verified_paise: verified.amountPaise,
    });
    throw new ServiceError(
      "Payment amount does not match registration fee.",
      400,
      "AMOUNT_MISMATCH"
    );
  }

  return {
    alreadyRegistered: false as const,
    verifiedPaymentId: verified.id,
    orderId: verified.razorpayOrderId,
  };
}

export async function markVerifiedPaymentConsumed(
  paymentId: string,
  registrationUuid: string,
  registrationPublicId: string
) {
  await prisma.razorpayVerifiedPayment.update({
    where: { razorpayPaymentId: paymentId },
    data: {
      consumedAt: new Date(),
      registrationUuid,
      registrationPublicId,
    },
  });

  paymentLog("verified_payment_consumed", {
    payment_id: paymentId,
    registration_id: registrationPublicId,
    registration_uuid: registrationUuid,
  });
}
