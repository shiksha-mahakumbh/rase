import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/razorpay/client.server";
import { getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay/config";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { recordVerifiedPayment } from "@/server/services/razorpay-verified.service";
import { SITE_URL } from "@/config/site";
import { writeAuditLog } from "@/server/services/audit.service";
import { resolveRegistrationFee } from "@/lib/registration/fees";
import { isSupportedType } from "@/server/lib/registration-types";
import type { RegistrationType } from "@/types/registration";
import type { AccommodationBedType, ProjectStudentType } from "@/lib/registration/fees";

const MIN_AMOUNT_PAISE = 100;

function paymentLog(event: string, payload: Record<string, unknown>) {
  console.info("PAYMENT_FLOW", { event, ...payload });
}

function expectedAmountPaiseFromOrderNotes(
  notes: Record<string, string>
): number | null {
  const registrationType = notes.registrationType;
  if (!registrationType || !isSupportedType(registrationType)) {
    return null;
  }

  const category = notes.category ?? "";

  const projectStudentType: ProjectStudentType | undefined =
    category === "College Student"
      ? "College Student"
      : category === "School Student"
        ? "School Student"
        : registrationType === "Projects"
          ? "School Student"
          : undefined;

  const accommodationBedType: AccommodationBedType | undefined =
    category === "Double Bed"
      ? "Double Bed"
      : category === "Single Bed"
        ? "Single Bed"
        : registrationType === "Accommodation"
          ? "Single Bed"
          : undefined;

  const feeRupees = resolveRegistrationFee(registrationType as RegistrationType, {
    delegateCategory: category,
    projectStudentType,
    accommodationBedType,
  });

  if (feeRupees <= 0) {
    return null;
  }

  return Math.round(feeRupees * 100);
}

export async function handleCreateOrder(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit({
    key: `razorpay-create-order:${ip}`,
    limit: 30,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const currency = (body.currency as string) || "INR";
    const receipt =
      typeof body.receipt === "string" && body.receipt.length > 0
        ? body.receipt.slice(0, 40)
        : `rcpt_${Date.now()}`;

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT_PAISE) {
      return NextResponse.json(
        { error: `Amount must be at least ${MIN_AMOUNT_PAISE} paise` },
        { status: 400 }
      );
    }

    if (currency !== "INR") {
      return NextResponse.json({ error: "Only INR currency is supported" }, { status: 400 });
    }

    const razorpay = getRazorpayClient();
    const notes =
      body.notes && typeof body.notes === "object"
        ? (body.notes as Record<string, string>)
        : undefined;

    if (notes?.registrationType) {
      const expectedPaise = expectedAmountPaiseFromOrderNotes(notes);
      if (expectedPaise != null && Math.abs(amount - expectedPaise) > 1) {
        paymentLog("order_amount_rejected", {
          registration_type: notes.registrationType,
          client_amount_paise: amount,
          expected_amount_paise: expectedPaise,
          user_email: notes.email ?? null,
        });
        return NextResponse.json(
          { error: "Amount does not match registration fee for selected category" },
          { status: 400 }
        );
      }
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
      notes,
    });

    paymentLog("order_created", {
      order_id: order.id,
      amount: order.amount,
      receipt,
      origin: request.headers.get("origin") ?? null,
      referer: request.headers.get("referer") ?? null,
      site_url: SITE_URL,
    });

    void writeAuditLog({
      action: "order_created",
      payload: {
        order_id: order.id,
        amount: order.amount,
        receipt,
        user_email: notes?.email ?? null,
      },
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: getRazorpayKeyId(),
    });
  } catch (error) {
    const err = error as { statusCode?: number; error?: { description?: string } };
    if (err.statusCode === 401) {
      return NextResponse.json({ error: "Razorpay authentication failed" }, { status: 401 });
    }
    console.error("[create-order]", error);
    return NextResponse.json(
      { error: err.error?.description ?? "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function handleVerifyPayment(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit({
    key: `razorpay-verify:${ip}`,
    limit: 60,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const razorpay_payment_id = body.razorpay_payment_id as string | undefined;
    const razorpay_order_id = body.razorpay_order_id as string | undefined;
    const razorpay_signature = body.razorpay_signature as string | undefined;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      paymentLog("verify_missing_fields", {
        payment_id: razorpay_payment_id ?? null,
        order_id: razorpay_order_id ?? null,
      });
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    paymentLog("verify_start", {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    });

    const amountPaise =
      body.amount_paise != null ? Number(body.amount_paise) : undefined;
    const metadata =
      body.metadata && typeof body.metadata === "object"
        ? (body.metadata as Record<string, unknown>)
        : undefined;

    try {
      const result = await recordVerifiedPayment({
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpaySignature: razorpay_signature,
        amountPaise,
        metadata,
      });

      if (result.duplicate) {
        return NextResponse.json({
          ok: true,
          duplicate: true,
          razorpay_payment_id,
          razorpay_order_id,
          registration_id: result.registrationPublicId,
        });
      }

      return NextResponse.json({
        ok: true,
        razorpay_payment_id,
        razorpay_order_id,
        verified_payment_id: result.verifiedPaymentId,
        amount_paise: result.amountPaise,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Payment verification failed";
      paymentLog("verify_failed", {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        error: message,
      });
      return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
