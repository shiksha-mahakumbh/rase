import { DONATION_80G } from "@/data/donation-hub";
import {
  buildDonationReceiptBodyHtml,
  DONATION_RECEIPT_CSS,
  formatReceiptDateTime,
  type DonationReceiptLogoAssets,
} from "@/lib/receipt/donation-receipt-layout";
import { loadDonationReceiptLogoAssets } from "@/lib/receipt/donation-receipt-logos-server";

export type DonationReceiptData = {
  receiptNumber: string;
  donationId: string;
  date: string;
  transactionTime: string;
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  organization?: string;
  address?: string;
  donationKind: "Donation" | "Sponsorship";
  amount: number;
  paymentId?: string;
  orderId?: string;
  paymentMode: string;
  transactionDate: string;
  orgLegalName: string;
  programmeName: string;
  section80G: string;
  act80G: string;
  registration80G: string;
};

export function buildDonationReceiptData(input: {
  donationId: string;
  fullName: string;
  email: string;
  phone: string;
  panNumber: string;
  organization?: string | null;
  address?: string | null;
  donationKind: "Donation" | "Sponsorship";
  amount: number;
  paymentId?: string | null;
  orderId?: string | null;
  transactionDate?: Date;
}): DonationReceiptData {
  const hasRazorpay = Boolean(input.paymentId);
  const { date, time } = formatReceiptDateTime(input.transactionDate);

  return {
    receiptNumber: input.donationId.replace(/^DON/, "DNR"),
    donationId: input.donationId,
    date,
    transactionTime: time,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    panNumber: input.panNumber,
    organization: input.organization ?? undefined,
    address: input.address ?? undefined,
    donationKind: input.donationKind,
    amount: input.amount,
    paymentId: input.paymentId ?? undefined,
    orderId: input.orderId ?? undefined,
    paymentMode: hasRazorpay ? "Online — Razorpay" : "Online",
    transactionDate: date,
    orgLegalName: DONATION_80G.orgLegalName,
    section80G: DONATION_80G.section,
    act80G: DONATION_80G.act,
    registration80G: DONATION_80G.registrationNumber,
    programmeName: DONATION_80G.programmeName,
  };
}

/** HTML receipt for browser print — same layout as PDF download */
export function buildDonationReceiptHtml(
  data: DonationReceiptData,
  origin?: string,
  options: {
    autoPrint?: boolean;
    embedLogos?: boolean;
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

  const body = buildDonationReceiptBodyHtml(data, { origin, logos });

  return `<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Donation Receipt ${data.donationId}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet"/>
<style>${DONATION_RECEIPT_CSS}</style>
</head>
<body${autoPrint ? ' onload="window.print()"' : ""}>
<div class="receipt">${body}</div>
</body></html>`;
}

/** Sample data for design preview */
export function sampleDonationReceiptData(): DonationReceiptData {
  return buildDonationReceiptData({
    donationId: "DON2026-000001",
    fullName: "Ramendra Singh",
    email: "ramendra@example.com",
    phone: "+91 98765 43210",
    panNumber: "AAETV1652K",
    address: "Chandigarh, India",
    donationKind: "Donation",
    amount: 100,
    paymentId: "pay_sample123456",
    orderId: "order_sample789",
    transactionDate: new Date("2026-06-28T14:35:22"),
  });
}
