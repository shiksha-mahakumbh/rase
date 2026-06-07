import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";

/**
 * Razorpay webhook — verify signature and process payment events.
 * Set RAZORPAY_WEBHOOK_SECRET in production.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit({
    key: `razorpay:${ip}`,
    limit: 100,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }
    return NextResponse.json({ ok: true, mode: "dev-skip" });
  }

  const signature = request.headers.get("x-razorpay-signature");
  const body = await request.text();

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (!signature || signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(body) as {
      event?: string;
      payload?: { payment?: { entity?: { id?: string; status?: string } } };
    };

    // TODO Phase 4: Firebase Admin SDK — update registrations paymentStatus by order id
    console.info("Razorpay webhook:", event.event);

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
