import { NextResponse } from "next/server";
import {
  buildDonationReceiptHtml,
  sampleDonationReceiptData,
} from "@/lib/receipt/donation-receipt";
import { SITE_URL } from "@/config/site";

/** Design preview — sample receipt without payment token (no auto-print) */
export async function GET() {
  const html = buildDonationReceiptHtml(sampleDonationReceiptData(), SITE_URL, {
    autoPrint: false,
    embedLogos: true,
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
