import { jsPDF } from "jspdf";
import { RECEIPT_ORG, type ReceiptData } from "@/lib/receipt/receipt-data";
import { getReceiptPdfSections } from "@/lib/receipt/receipt-html";
import {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
  RECEIPT_LOGO_PATH,
} from "@/lib/receipt/receipt-logos";

export { RECEIPT_DHE_LOGO_PATH, RECEIPT_EVENT_LOGO_PATH, RECEIPT_LOGO_PATH };

export type ReceiptRenderAssets = {
  /** DHE logo — raw base64 or data URL */
  dheLogoImage?: string | null;
  /** Shiksha Mahakumbh logo — raw base64 or data URL */
  eventLogoImage?: string | null;
  qrImage?: string | null;
};

function toDataUrl(value: string, mime = "image/png"): string {
  if (value.startsWith("data:")) return value;
  return `data:${mime};base64,${value}`;
}

function addImage(
  doc: jsPDF,
  image: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const fmt = image.includes("jpeg") || image.includes("jpg") ? "JPEG" : "PNG";
  doc.addImage(toDataUrl(image), fmt, x, y, w, h);
}

/** Single PDF layout — both logos + QR + all receipt fields */
export function renderReceiptPdf(
  doc: jsPDF,
  data: ReceiptData,
  assets: ReceiptRenderAssets = {}
) {
  const left = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - 40;
  let y = 36;

  const dheLogo = assets.dheLogoImage;
  const eventLogo = assets.eventLogoImage;

  if (dheLogo) {
    try {
      addImage(doc, dheLogo, left, y, 56, 56);
    } catch {
      /* optional */
    }
  }

  if (eventLogo) {
    try {
      addImage(doc, eventLogo, right - 72, y, 72, 72);
    } catch {
      /* optional */
    }
  }

  const textLeft = left + (dheLogo ? 64 : 0);
  const textRight = right - (eventLogo ? 80 : 0);
  const textWidth = textRight - textLeft;
  let ty = y + 8;

  const headerLine = (text: string, bold = false, size = 10) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, textWidth);
    doc.text(lines, textLeft + textWidth / 2, ty, { align: "center" });
    ty += lines.length * (size + 2) + 2;
  };

  headerLine("DEPARTMENT OF HOLISTIC EDUCATION", true, 11);
  headerLine("A Unit of Vidya Bharti Institute of Training and Research Trust", false, 7);
  headerLine(RECEIPT_ORG.address, false, 7);
  headerLine(`Web: ${RECEIPT_ORG.web} · E-mail: ${RECEIPT_ORG.email}`, false, 7);
  headerLine(`${RECEIPT_ORG.eventName}`, true, 8);

  y = Math.max(y + 76, ty) + 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Registration Fee Receipt", pageWidth / 2, y, { align: "center" });
  y += 16;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Regd. No. ${RECEIPT_ORG.regdNo}    PAN: ${RECEIPT_ORG.pan}`, left, y);
  y += 14;

  const line = (text: string, bold = false, size = 10) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(text, left, y);
    y += size + 6;
  };

  for (const section of getReceiptPdfSections(data)) {
    if (section.title) {
      y += 4;
      line(section.title, true);
    }
    for (const text of section.lines) {
      line(text);
    }
  }

  y += 12;
  line(`Amount Due/Paid: ₹${data.amount.toLocaleString("en-IN")}`, true);
  y += 8;
  line("Department of Holistic Education", true);
}
