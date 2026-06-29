import { NextRequest, NextResponse } from "next/server";
import {
  buildDonationReceiptHtml,
  sampleDonationReceiptData,
} from "@/lib/receipt/donation-receipt";
import { getClientIp, rateLimitAsync } from "@/lib/security/rateLimit";
import { SITE_URL } from "@/config/site";
export { runtime, maxDuration } from "@/lib/server/pdf-api-route";

/** Design preview — sample receipt without payment token (no auto-print) */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = await rateLimitAsync({
    key: `donation-receipt-preview:${ip}`,
    limit: 30,
    windowMs: 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } }
    );
  }

  const html = buildDonationReceiptHtml(sampleDonationReceiptData(), SITE_URL, {
    autoPrint: false,
    embedLogos: true,
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
