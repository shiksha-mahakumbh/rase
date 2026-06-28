import { jsPDF } from "jspdf";
import type { DonationReceiptData } from "@/lib/receipt/donation-receipt";
import {
  buildDonationReceiptCertText,
  DONATION_RECEIPT_ORG,
  DONATION_RECEIPT_THANKS_EN,
  getDonationReceiptRows,
  pdfSafeText,
} from "@/lib/receipt/donation-receipt-layout";
import { DONATION_RECEIPT_THEME, rgb } from "@/lib/receipt/donation-receipt-theme";

export type DonationReceiptPdfAssets = {
  dheLogoImage?: string | null;
  dheLogoMime?: "image/jpeg" | "image/png";
  eventLogoImage?: string | null;
  eventLogoMime?: "image/jpeg" | "image/png";
  hindiCampaignImage?: string | null;
  hindiThanksImage?: string | null;
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

function ensurePageSpace(doc: jsPDF, y: number, needed: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed <= pageHeight - 40) return y;
  doc.addPage();
  return 36;
}

function drawEnglishThanks(
  doc: jsPDF,
  left: number,
  right: number,
  pageWidth: number,
  y: number
): number {
  const thanks = DONATION_RECEIPT_THANKS_EN;
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

  let ty = y + 16;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.navy);
  doc.text(thanks.heading, pageWidth / 2, ty, { align: "center" });
  ty += 14;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.text);
  for (const line of thanks.lines) {
    const lines = doc.splitTextToSize(line, blockW - 24);
    doc.text(lines, pageWidth / 2, ty, { align: "center" });
    ty += lines.length * 11 + 2;
  }

  return y + blockH + 12;
}

/** jsPDF fallback — uses pre-rendered Hindi PNGs when available */
export function renderDonationReceiptPdf(
  doc: jsPDF,
  data: DonationReceiptData,
  assets: DonationReceiptPdfAssets = {}
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

  if (assets.hindiCampaignImage) {
    try {
      const imgW = Math.min(textWidth, 240);
      const imgH = 26;
      addImage(doc, assets.hindiCampaignImage, textLeft + (textWidth - imgW) / 2, ty, imgW, imgH);
      ty += imgH + 6;
    } catch {
      headerLine("Shiksha Mahakumbh Abhiyan", true, 11, C.saffronDark);
    }
  } else {
    headerLine("Shiksha Mahakumbh Abhiyan", true, 11, C.saffronDark);
  }

  headerLine(org.department, true, 10, C.navy);
  headerLine(org.unitLine, false, 7);
  headerLine(org.trustName, true, 8, C.navyLight);
  headerLine(org.addressLine1, false, 7);
  headerLine(org.addressLine2, false, 7);
  headerLine(`Web. ${org.web}, E-mail: ${org.email}`, false, 7);

  y = Math.max(y + logoSize + 4, ty) + 12;
  doc.setDrawColor(...C.saffron);
  doc.setLineWidth(3);
  doc.line(left, y, right, y);
  y += 3;
  doc.setDrawColor(...C.navyLight);
  doc.setLineWidth(1);
  doc.line(left, y, right, y);
  y += 16;

  doc.setFillColor(...C.navy);
  doc.roundedRect(left, y, right - left, 28, 4, 4, "F");
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("DONATION RECEIPT (80G)", pageWidth / 2, y + 18, { align: "center" });
  y += 38;

  let rowIndex = 0;
  for (const row of getDonationReceiptRows(data)) {
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

  y += 10;
  y = ensurePageSpace(doc, y, 100);

  if (assets.hindiThanksImage) {
    try {
      const blockW = right - left;
      const blockH = 96;
      doc.setFillColor(...C.surfaceWarm);
      doc.setDrawColor(...C.saffron);
      doc.setLineWidth(1);
      doc.roundedRect(left, y, blockW, blockH, 4, 4, "FD");
      doc.setDrawColor(...C.saffronDark);
      doc.setLineWidth(3);
      doc.line(left, y, left, y + blockH);
      addImage(doc, assets.hindiThanksImage, left + 8, y + 6, blockW - 16, blockH - 12);
      y += blockH + 12;
    } catch {
      y = drawEnglishThanks(doc, left, right, pageWidth, y);
    }
  } else {
    y = drawEnglishThanks(doc, left, right, pageWidth, y);
  }

  y = ensurePageSpace(doc, y, 80);
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.5);
  doc.line(left, y, right, y);
  y += 14;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(left, y - 4, right - left, 72, 4, 4, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.navy);
  doc.text(`80G Tax Exemption — Section ${data.section80G} of ${data.act80G}`, left + 8, y + 8);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...C.textMuted);
  const certLines = doc.splitTextToSize(pdfSafeText(buildDonationReceiptCertText(data)), right - left - 16);
  doc.text(certLines, left + 8, y);
  y += certLines.length * 10 + 16;

  doc.setFontSize(8);
  doc.setTextColor(...C.textMuted);
  doc.text(
    "This is a computer-generated receipt. No physical signature is required.",
    pageWidth / 2,
    y,
    { align: "center" }
  );
}
