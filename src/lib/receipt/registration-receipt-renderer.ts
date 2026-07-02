import { jsPDF } from "jspdf";
import { type ReceiptData } from "@/lib/receipt/receipt-data";
import {
  getRegistrationReceiptRows,
  REGISTRATION_RECEIPT_ORG_PDF,
  REGISTRATION_RECEIPT_THANKS_PDF,
  registrationReceiptTitle,
} from "@/lib/receipt/registration-receipt-layout";
import { DONATION_RECEIPT_THEME, rgb } from "@/lib/receipt/donation-receipt-theme";

export type RegistrationReceiptPdfAssets = {
  dheLogoImage?: string | null;
  dheLogoMime?: "image/jpeg" | "image/png";
  eventLogoImage?: string | null;
  eventLogoMime?: "image/jpeg" | "image/png";
  qrImage?: string | null;
};

const C = {
  navy: rgb(DONATION_RECEIPT_THEME.navy),
  navyLight: rgb(DONATION_RECEIPT_THEME.navyLight),
  saffron: rgb(DONATION_RECEIPT_THEME.saffron),
  saffronDark: rgb(DONATION_RECEIPT_THEME.saffronDark),
  text: rgb(DONATION_RECEIPT_THEME.text),
  textMuted: rgb(DONATION_RECEIPT_THEME.textMuted),
  surfaceWarm: rgb(DONATION_RECEIPT_THEME.surfaceWarm),
  border: rgb(DONATION_RECEIPT_THEME.border),
};

function addImage(
  doc: jsPDF,
  image: string,
  x: number,
  y: number,
  w: number,
  h: number,
  mime: "image/jpeg" | "image/png" = "image/png"
) {
  const fmt = mime === "image/jpeg" ? "JPEG" : "PNG";
  doc.addImage(toDataUrl(image, mime), fmt, x, y, w, h);
}

function toDataUrl(value: string, mime = "image/png"): string {
  if (value.startsWith("data:")) return value;
  return `data:${mime};base64,${value}`;
}

function pdfSafeText(value: string): string {
  return value.replace(/\u20B9/g, "Rs. ").replace(/₹/g, "Rs. ").replace(/—/g, "-");
}

/** Single-page jsPDF layout — mirrors HTML receipt (QR right, below header). */
export function renderRegistrationReceiptPdf(
  doc: jsPDF,
  data: ReceiptData,
  assets: RegistrationReceiptPdfAssets = {}
) {
  const left = 36;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const right = pageWidth - 36;
  const org = REGISTRATION_RECEIPT_ORG_PDF;
  const logoSize = 60;
  let y = 20;

  if (assets.dheLogoImage) {
    try {
      addImage(doc, assets.dheLogoImage, left, y, logoSize, logoSize, assets.dheLogoMime ?? "image/png");
    } catch {
      /* optional */
    }
  }

  if (assets.eventLogoImage) {
    try {
      addImage(
        doc,
        assets.eventLogoImage,
        right - logoSize,
        y,
        logoSize,
        logoSize,
        assets.eventLogoMime ?? "image/png"
      );
    } catch {
      /* optional */
    }
  }

  const textLeft = left + logoSize + 6;
  const textRight = right - logoSize - 6;
  const textWidth = textRight - textLeft;
  let ty = y + 4;

  const headerLine = (
    text: string,
    bold = false,
    size = 8,
    color: [number, number, number] = C.textMuted
  ) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, textWidth);
    doc.text(lines, textLeft + textWidth / 2, ty, { align: "center" });
    ty += lines.length * (size + 1) + 0.5;
  };

  headerLine(`Regd. No. ${org.regdNo}  |  Date: ${org.regdDate}  |  PAN: ${org.pan}`, false, 7);
  headerLine(org.campaignHi, true, 10, C.saffronDark);
  headerLine(org.department, true, 9, C.navy);
  headerLine(org.unitLine, false, 7);
  headerLine(org.trustName, true, 7.5, C.navyLight);
  headerLine(org.addressLine1, false, 6.5);
  headerLine(org.addressLine2, false, 6.5);
  headerLine(`Web. ${org.web}, E-mail: ${org.email}`, false, 6.5);

  y = Math.max(y + logoSize + 2, ty) + 8;
  doc.setDrawColor(...C.navyLight);
  doc.setLineWidth(0.6);
  doc.line(left, y, right, y);
  y += 10;

  const qrSize = 88;
  const titleText = registrationReceiptTitle(data.amount).toUpperCase();
  const titleBlockRight = assets.qrImage ? right - qrSize - 10 : right;

  if (assets.qrImage) {
    try {
      addImage(doc, assets.qrImage, right - qrSize, y, qrSize, qrSize);
      doc.setFontSize(7);
      doc.setTextColor(...C.textMuted);
      doc.text("Venue check-in", right - qrSize / 2, y + qrSize + 8, { align: "center" });
      doc.text(data.registrationId, right - qrSize / 2, y + qrSize + 15, { align: "center" });
    } catch {
      /* optional */
    }
  }

  doc.setFillColor(...C.navy);
  doc.roundedRect(left, y, titleBlockRight - left, 24, 3, 3, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(titleText, titleBlockRight - left - 12);
  doc.text(titleLines, left + 6, y + 15);
  y += Math.max(24, qrSize + 20);

  let rowIndex = 0;
  for (const row of getRegistrationReceiptRows(data)) {
    if (rowIndex % 2 === 1) {
      doc.setFillColor(...C.surfaceWarm);
      doc.rect(left, y - 8, right - left, 11, "F");
    }
    rowIndex++;

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.navyLight);
    doc.text(`${row.label}:`, left, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.text);
    const valueLines = doc.splitTextToSize(pdfSafeText(row.value), right - left - 108);
    doc.text(valueLines, left + 108, y);
    y += Math.max(11, valueLines.length * 9);

    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.2);
    doc.line(left, y - 4, right, y - 4);
  }

  y += 6;
  const thanks = REGISTRATION_RECEIPT_THANKS_PDF;
  const blockW = right - left;
  let blockH = 22;
  for (const line of thanks.lines) {
    blockH += doc.splitTextToSize(line, blockW - 20).length * 9 + 2;
  }

  doc.setFillColor(...C.surfaceWarm);
  doc.setDrawColor(...C.saffron);
  doc.setLineWidth(0.8);
  doc.roundedRect(left, y, blockW, blockH, 3, 3, "FD");
  doc.setDrawColor(...C.saffronDark);
  doc.setLineWidth(2.5);
  doc.line(left, y, left, y + blockH);

  let thy = y + 12;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.navy);
  doc.text(thanks.heading, pageWidth / 2, thy, { align: "center" });
  thy += 10;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.text);
  for (const line of thanks.lines) {
    const lines = doc.splitTextToSize(line, blockW - 20);
    doc.text(lines, pageWidth / 2, thy, { align: "center" });
    thy += lines.length * 9 + 1;
  }

  y += blockH + 8;
  doc.setFontSize(7.5);
  doc.setTextColor(...C.textMuted);
  doc.text(
    "This is a computer-generated receipt. No physical signature is required.",
    pageWidth / 2,
    Math.min(y, pageHeight - 16),
    { align: "center" }
  );
}
