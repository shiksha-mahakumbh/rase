import fs from "node:fs";
import path from "node:path";
import { jsPDF } from "jspdf";
import { DONATION_80G } from "@/data/donation-hub";
import type { DonationReceiptData } from "@/lib/receipt/donation-receipt";

/** Literal paths only — avoids Next/Vercel tracing the entire `public/` folder (~600MB). */
const RECEIPT_LOGO_FILES = {
  dhe: "images/dhe-logo.png",
  event: "images/shiksha-mahakumbh-logo.png",
} as const;

function loadReceiptLogoFile(relativePath: (typeof RECEIPT_LOGO_FILES)[keyof typeof RECEIPT_LOGO_FILES]) {
  try {
    const file = path.join(process.cwd(), "public", relativePath);
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file);
  } catch {
    return null;
  }
}

function bufferToBase64(buf: Buffer): string {
  return buf.toString("base64");
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
  doc.text(data.orgLegalName ?? "Department of Holistic Education", left, y);
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
  doc.text(`80G Tax Exemption — Section ${data.section80G} of ${data.act80G}`, left, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  const certText = `This is to certify that a sum of ₹${data.amount.toLocaleString("en-IN")} has been received from ${data.fullName} (PAN: ${data.panNumber}) as ${data.donationKind.toLowerCase()} towards ${data.orgLegalName} in support of ${data.programmeName}. Unique Registration No. under Section 80G: ${data.registration80G}. Valid for ${DONATION_80G.approvalPeriod}. This receipt is valid for income tax deduction purposes subject to applicable laws.`;
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

export function generateDonationReceiptPdfBuffer(data: DonationReceiptData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

  const dheLogo = loadReceiptLogoFile(RECEIPT_LOGO_FILES.dhe);
  const eventLogo = loadReceiptLogoFile(RECEIPT_LOGO_FILES.event);

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

  renderDonationReceiptPdf(doc, data);
  return Buffer.from(doc.output("arraybuffer"));
}
