import fs from "node:fs";
import path from "node:path";
import { jsPDF } from "jspdf";
import {
  buildReceiptData,
  type ReceiptData,
  type ReceiptPayload,
} from "@/lib/receipt/receipt-data";
import { renderReceiptPdf } from "@/lib/receipt/receipt-renderer-core";
import {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
  RECEIPT_LOGO_PATH,
} from "@/lib/receipt/receipt-logos";

export { RECEIPT_DHE_LOGO_PATH, RECEIPT_EVENT_LOGO_PATH, RECEIPT_LOGO_PATH };

function publicImagePath(filename: "dhe-logo.png" | "shiksha-mahakumbh-logo.png"): string {
  return path.join(process.cwd(), "public", "images", filename);
}

function loadPublicImage(filename: "dhe-logo.png" | "shiksha-mahakumbh-logo.png"): Buffer | null {
  try {
    const file = publicImagePath(filename);
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file);
  } catch {
    return null;
  }
}

export function loadReceiptLogoBuffer(): Buffer | null {
  return loadPublicImage("dhe-logo.png");
}

export function loadEventLogoBuffer(): Buffer | null {
  return loadPublicImage("shiksha-mahakumbh-logo.png");
}

function bufferToBase64(buf: Buffer): string {
  return buf.toString("base64");
}

export function generateReceiptPdfBufferFromData(
  data: ReceiptData,
  qrPng?: Buffer | null
): Buffer {
  const dheLogo = loadReceiptLogoBuffer();
  const eventLogo = loadEventLogoBuffer();
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  renderReceiptPdf(doc, data, {
    dheLogoImage: dheLogo ? bufferToBase64(dheLogo) : null,
    eventLogoImage: eventLogo ? bufferToBase64(eventLogo) : null,
    qrImage: qrPng ? bufferToBase64(qrPng) : null,
  });
  return Buffer.from(doc.output("arraybuffer"));
}

export function generateReceiptPdfBuffer(
  payload: ReceiptPayload,
  qrPng?: Buffer | null
): Buffer {
  return generateReceiptPdfBufferFromData(buildReceiptData(payload), qrPng);
}

export type { ReceiptData, ReceiptPayload } from "@/lib/receipt/receipt-data";
