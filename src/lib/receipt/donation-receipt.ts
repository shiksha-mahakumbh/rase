import fs from "node:fs";
import path from "node:path";
import { jsPDF } from "jspdf";
import { DONATION_80G } from "@/data/donation-hub";
import { RECEIPT_ORG } from "@/lib/receipt/receipt-data";
import {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
} from "@/lib/receipt/receipt-logos";

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
};

function loadPublicImageFromWebPath(webPath: string): Buffer | null {
  try {
    const file = path.join(process.cwd(), "public", webPath.replace(/^\//, ""));
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file);
  } catch {
    return null;
  }
}

function bufferToBase64(buf: Buffer): string {
  return buf.toString("base64");
}

function formatDate(value?: string | Date): string {
  const d = value ? new Date(value) : new Date();
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function amountInWords(amount: number): string {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)} Crore Rupees Only`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(2)} Lakh Rupees Only`;
  return `${amount.toLocaleString("en-IN")} Rupees Only`;
}

function renderDonationReceiptPdf(doc: jsPDF, data: DonationReceiptData) {
  const left = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - 40;
  let y = 36;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 95);
  doc.text("DONATION RECEIPT (80G)", pageWidth / 2, y, { align: "center" });
  y += 18;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(DONATION_80G.orgLegalName, left, y);
  y += 14;
  doc.text(`PAN: ${DONATION_80G.orgPan}  |  Regd. No. ${RECEIPT_ORG.regdNo}`, left, y);
  y += 12;
  doc.text(RECEIPT_ORG.address, left, y, { maxWidth: right - left });
  y += 22;

  doc.setDrawColor(30, 58, 95);
  doc.line(left, y, right, y);
  y += 14;

  const rows: [string, string][] = [
    ["Receipt No.", data.receiptNumber],
    ["Donation ID", data.donationId],
    ["Date", data.date],
    ["Donor Name", data.fullName],
    ["PAN", data.panNumber],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Type", data.donationKind],
  ];

  if (data.organization) rows.push(["Organization", data.organization]);
  if (data.address) rows.push(["Address", data.address]);

  rows.push(
    ["Amount", `₹${data.amount.toLocaleString("en-IN")}`],
    ["Amount (words)", amountInWords(data.amount)],
    ["Payment Mode", data.paymentMode],
    ["Transaction Date", data.transactionDate]
  );

  if (data.paymentId) rows.push(["Payment ID", data.paymentId]);
  if (data.orderId) rows.push(["Order ID", data.orderId]);

  doc.setFontSize(10);
  for (const [label, value] of rows) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 95);
    doc.text(`${label}:`, left, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(value, right - left - 110);
    doc.text(lines, left + 110, y);
    y += Math.max(14, lines.length * 12);
  }

  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(left, y, right, y);
  y += 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 95);
  doc.text(`80G Tax Exemption — Section ${DONATION_80G.section} of ${DONATION_80G.act}`, left, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  const certText = `This is to certify that a sum of ₹${data.amount.toLocaleString("en-IN")} has been received from ${data.fullName} (PAN: ${data.panNumber}) as ${data.donationKind.toLowerCase()} towards ${DONATION_80G.orgLegalName}. Registration No. under Section 80G: ${DONATION_80G.registrationNumber}. This receipt is valid for income tax deduction purposes subject to applicable laws.`;
  const certLines = doc.splitTextToSize(certText, right - left);
  doc.text(certLines, left, y);
  y += certLines.length * 11 + 16;

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "This is a computer-generated receipt. No physical signature is required.",
    left,
    y
  );
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
  };
}

export function generateDonationReceiptPdfBuffer(data: DonationReceiptData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

  const dheLogo = loadPublicImageFromWebPath(RECEIPT_DHE_LOGO_PATH);
  const eventLogo = loadPublicImageFromWebPath(RECEIPT_EVENT_LOGO_PATH);

  if (dheLogo || eventLogo) {
    if (dheLogo) {
      doc.addImage(
        `data:image/png;base64,${bufferToBase64(dheLogo)}`,
        "PNG",
        40,
        20,
        48,
        48
      );
    }
    if (eventLogo) {
      doc.addImage(
        `data:image/png;base64,${bufferToBase64(eventLogo)}`,
        "PNG",
        doc.internal.pageSize.getWidth() - 88,
        20,
        48,
        48
      );
    }
  }

  renderDonationReceiptPdf(doc, data);
  return Buffer.from(doc.output("arraybuffer"));
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
<strong>80G Tax Exemption</strong> — Section ${DONATION_80G.section} of ${DONATION_80G.act}<br/>
Registration No.: ${DONATION_80G.registrationNumber}<br/><br/>
This certifies receipt of ₹${data.amount.toLocaleString("en-IN")} from ${data.fullName} (PAN: ${data.panNumber}) as ${data.donationKind.toLowerCase()} towards ${DONATION_80G.orgLegalName}.
</div>
<p style="font-size:11px;color:#888;margin-top:16px">Computer-generated receipt — no signature required.</p>
</div></body></html>`;
}