import { NextRequest, NextResponse } from "next/server";
import { completeDonation } from "@/server/services/donation.service";
import { donationFormSchema } from "@/lib/schemas/donationSchema";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { ServiceError } from "@/server/lib/errors";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `donation-complete:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  try {
    const body = await request.json();
    const parsed = donationFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid donation data" },
        { status: 400 }
      );
    }

    const result = await completeDonation(parsed.data);

    return NextResponse.json({
      ok: true,
      donationId: result.donationId,
      receiptToken: result.receiptToken,
      duplicate: result.duplicate ?? false,
      emailSent: result.emailSent,
    });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[donation/complete]", error);
    return NextResponse.json({ error: "Failed to process donation" }, { status: 500 });
  }
}
