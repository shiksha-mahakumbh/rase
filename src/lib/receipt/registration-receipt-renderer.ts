import { jsPDF } from "jspdf";
import { type ReceiptData } from "@/lib/receipt/receipt-data";
import { DONATION_RECEIPT_ORG } from "@/lib/receipt/donation-receipt-layout";
import {
  getRegistrationReceiptRows,
  REGISTRATION_RECEIPT_THANKS,
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

/** jsPDF fallback — aligned with HTML print layout */
export function renderRegistrationReceiptPdf(
  doc: jsPDF,
  data: ReceiptData,
  assets: RegistrationReceiptPdfAssets = {}
) {
  const left = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - 40;
  const org = DONATION_RECEIPT_ORG;
  const logoSize = 72;
  let y = 24;

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

  const textLeft = left + logoSize + 8;
  const textRight = right - logoSize - 8;
  const textWidth = textRight - textLeft;
  let ty = y + 6;

  const headerLine = (
    text: string,
    bold = false,
    size = 9,
    color: [number, number, number] = C.textMuted
  ) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, textWidth);
    doc.text(lines, textLeft + textWidth / 2, ty, { align: "center" });
    ty += lines.length * (size + 1.5) + 1;
  };

  headerLine(`Regd. No. ${org.regdNo}  |  Date: ${org.regdDate}  |  PAN: ${org.pan}`, false, 8);
  headerLine(org.campaignHi, true, 11, C.saffronDark);
  headerLine(org.department, true, 10, C.navy);
  headerLine(org.unitLine, false, 7);
  headerLine(org.trustName, true, 8, C.navyLight);
  headerLine(org.addressLine1, false, 7);
  headerLine(org.addressLine2, false, 7);
  headerLine(`Web. ${org.web}, E-mail: ${org.email}`, false, 7);

  y = Math.max(y + logoSize + 4, ty) + 12;
  doc.setFillColor(...C.navy);
  doc.roundedRect(left, y, right - left, 28, 4, 4, "F");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(registrationReceiptTitle(data.amount).toUpperCase(), pageWidth / 2, y + 18, {
    align: "center",
  });
  y += 38;

  let rowIndex = 0;
  for (const row of getRegistrationReceiptRows(data)) {
    if (rowIndex % 2 === 1) {
      doc.setFillColor(...C.surfaceWarm);
      doc.rect(left, y - 10, right - left, 14, "F");
    }
    rowIndex++;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.navyLight);
    doc.text(`${row.label}:`, left, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.text);
    const valueLines = doc.splitTextToSize(pdfSafeText(row.value), right - left - 118);
    doc.text(valueLines, left + 118, y);
    y += Math.max(14, valueLines.length * 11);

    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.3);
    doc.line(left, y - 5, right, y - 5);
  }

  if (assets.qrImage) {
    y += 8;
    try {
      const qrSize = 100;
      const blockW = right - left;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(...C.border);
      doc.roundedRect(left, y, blockW, qrSize + 28, 4, 4, "FD");
      addImage(doc, assets.qrImage, left + (blockW - qrSize) / 2, y + 8, qrSize, qrSize);
      doc.setFontSize(8);
      doc.setTextColor(...C.textMuted);
      doc.text(
        `Scan at venue check-in · ${data.registrationId}`,
        pageWidth / 2,
        y + qrSize + 20,
        { align: "center" }
      );
      y += qrSize + 36;
    } catch {
      /* optional */
    }
  }

  y += 8;
  const thanks = REGISTRATION_RECEIPT_THANKS;
  const blockW = right - left;
  let blockH = 28;
  for (const line of thanks.lines) {
    blockH += doc.splitTextToSize(line, blockW - 24).length * 11 + 4;
  }

  doc.setFillColor(...C.surfaceWarm);
  doc.setDrawColor(...C.saffron);
  doc.setLineWidth(1);
  doc.roundedRect(left, y, blockW, blockH, 4, 4, "FD");
  doc.setDrawColor(...C.saffronDark);
  doc.setLineWidth(3);
  doc.line(left, y, left, y + blockH);

  let thy = y + 16;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.navy);
  doc.text(thanks.heading, pageWidth / 2, thy, { align: "center" });
  thy += 14;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.text);
  for (const line of thanks.lines) {
    const lines = doc.splitTextToSize(line, blockW - 24);
    doc.text(lines, pageWidth / 2, thy, { align: "center" });
    thy += lines.length * 11 + 2;
  }

  y += blockH + 16;
  doc.setFontSize(8);
  doc.setTextColor(...C.textMuted);
  doc.text(
    "This is a computer-generated receipt. No physical signature is required.",
    pageWidth / 2,
    y,
    { align: "center" }
  );
}
