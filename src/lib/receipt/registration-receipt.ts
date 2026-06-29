import { type ReceiptData } from "@/lib/receipt/receipt-data";
import type { DonationReceiptLogoAssets } from "@/lib/receipt/donation-receipt-layout";
import {
  buildRegistrationReceiptBodyHtml,
  REGISTRATION_RECEIPT_CSS,
} from "@/lib/receipt/registration-receipt-layout";
import { loadDonationReceiptLogoAssets } from "@/lib/receipt/donation-receipt-logos-server";

/** HTML receipt for browser print — same layout as PDF download */
export function buildRegistrationReceiptHtml(
  data: ReceiptData,
  origin?: string,
  options: {
    autoPrint?: boolean;
    embedLogos?: boolean;
    qrDataUrl?: string | null;
    dheDataUrl?: string | null;
    eventDataUrl?: string | null;
  } = {}
): string {
  const autoPrint = options.autoPrint !== false;
  let logos: DonationReceiptLogoAssets = {};

  if (options.embedLogos) {
    const loaded =
      options.dheDataUrl !== undefined || options.eventDataUrl !== undefined
        ? { dheDataUrl: options.dheDataUrl, eventDataUrl: options.eventDataUrl }
        : loadDonationReceiptLogoAssets();
    logos = {
      dheDataUrl: loaded.dheDataUrl,
      eventDataUrl: loaded.eventDataUrl,
    };
  }

  const body = buildRegistrationReceiptBodyHtml(data, {
    origin,
    logos,
    qrDataUrl: options.qrDataUrl,
  });

  return `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Receipt ${data.registrationId}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet"/>
<style>${REGISTRATION_RECEIPT_CSS}</style>
</head>
<body${autoPrint ? ' onload="window.print()"' : ""}>
<div class="receipt">${body}</div>
</body></html>`;
}
