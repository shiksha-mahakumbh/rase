import { DONATION_80G } from "@/data/donation-hub";

export type DonationReceiptData = {
  receiptNumber: string;
  donationId: string;
  date: string;
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

function formatDate(value?: string | Date): string {
  const d = value ? new Date(value) : new Date();
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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
  return {
    receiptNumber: input.donationId.replace(/^DON/, "DNR"),
    donationId: input.donationId,
    date: formatDate(input.transactionDate),
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
    paymentMode: hasRazorpay ? "Online (Razorpay)" : "Online",
    transactionDate: formatDate(input.transactionDate),
    orgLegalName: DONATION_80G.orgLegalName,
    section80G: DONATION_80G.section,
    act80G: DONATION_80G.act,
    registration80G: DONATION_80G.registrationNumber,
    programmeName: DONATION_80G.programmeName,
  };
}

/** HTML receipt for browser print */
export function buildDonationReceiptHtml(data: DonationReceiptData, origin?: string): string {
  const dheLogo = origin ? `${origin}/images/dhe-logo.png` : "/images/dhe-logo.png";
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 8px;font-weight:600;color:#1e3a5f;white-space:nowrap">${label}</td><td style="padding:6px 8px">${value}</td></tr>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Donation Receipt ${data.donationId}</title>
<style>
@page{size:A4 portrait;margin:12mm}body{font-family:Arial,sans-serif;font-size:13px;color:#111;margin:0;padding:16px}
.receipt{max-width:720px;margin:0 auto;border:2px solid #1e3a5f;padding:24px}
h1{font-size:18px;color:#1e3a5f;text-align:center;margin:0 0 16px}
.cert{margin-top:20px;padding-top:16px;border-top:1px dashed #999;font-size:12px;line-height:1.6;color:#444}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px}
</style></head><body onload="window.print()">
<div class="receipt">
<div class="header">
<img src="${dheLogo}" alt="DHE" width="64" height="64" onerror="this.style.display='none'"/>
<div style="text-align:center;flex:1"><strong style="color:#b91c1c;font-size:16px">SHIKSHA MAHAKUMBH ABIYAN</strong><br/>Department of Holistic Education</div>
</div>
<h1>Donation Receipt (80G)</h1>
<table style="width:100%;border-collapse:collapse">
${[
  ["Receipt No.", data.receiptNumber],
  ["Donation ID", data.donationId],
  ["Date", data.date],
  ["Donor", data.fullName],
  ["PAN", data.panNumber],
  ["Email", data.email],
  ["Phone", data.phone],
  ["Type", data.donationKind],
  ...(data.organization ? [["Organization", data.organization]] : []),
  ["Amount", `₹${data.amount.toLocaleString("en-IN")}`],
  ["Payment Mode", data.paymentMode],
  ...(data.paymentId ? [["Payment ID", data.paymentId]] : []),
].map(([l, v]) => row(l, v)).join("")}
</table>
<div class="cert">
<strong>80G Tax Exemption</strong> — Section ${data.section80G} of ${data.act80G}<br/>
Registration No.: ${data.registration80G}<br/><br/>
This certifies receipt of ₹${data.amount.toLocaleString("en-IN")} from ${data.fullName} (PAN: ${data.panNumber}) as ${data.donationKind.toLowerCase()} towards ${data.orgLegalName} in support of ${data.programmeName}. Unique Registration No. under Section 80G: ${data.registration80G}.
</div>
<p style="font-size:11px;color:#888;margin-top:16px">Computer-generated receipt — no signature required.</p>
</div></body></html>`;
}
