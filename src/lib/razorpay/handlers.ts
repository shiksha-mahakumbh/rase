import { NextRequest, NextResponse } from "next/server";
import { getRazorpayClient } from "@/lib/razorpay/client.server";
import { getRazorpayKeyId, getRazorpayKeySecret, isRazorpayConfigured } from "@/lib/razorpay/config";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay/verify";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";

const MIN_AMOUNT_PAISE = 100;

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

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
      notes,
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
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    const keySecret = getRazorpayKeySecret()!;
    const valid = verifyRazorpayPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      keySecret
    );

    if (!valid) {
      return NextResponse.json({ ok: false, error: "Invalid payment signature" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      razorpay_payment_id,
      razorpay_order_id,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
