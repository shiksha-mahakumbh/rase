import fs from "node:fs";
import path from "node:path";
import { jsPDF } from "jspdf";
import {
  buildReceiptData,
  type ReceiptData,
  type ReceiptPayload,
} from "@/lib/receipt/receipt-data";
import { renderRegistrationReceiptPdf } from "@/lib/receipt/registration-receipt-renderer";
import { generateRegistrationReceiptPdfFromHtml } from "@/lib/receipt/registration-receipt-pdf-html";
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

function detectMime(buf: Buffer): "image/jpeg" | "image/png" {
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) return "image/jpeg";
  return "image/png";
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

function qrDataUrlFromBuffer(qrPng?: Buffer | null): string | null {
  if (!qrPng || qrPng.length === 0) return null;
  return `data:image/png;base64,${qrPng.toString("base64")}`;
}

export function generateReceiptPdfBufferFromDataJsPdf(
  data: ReceiptData,
  qrPng?: Buffer | null
): Buffer {
  const dheLogo = loadReceiptLogoBuffer();
  const eventLogo = loadEventLogoBuffer();
  const dheMime = dheLogo ? detectMime(dheLogo) : "image/png";
  const eventMime = eventLogo ? detectMime(eventLogo) : "image/png";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  renderRegistrationReceiptPdf(doc, data, {
    dheLogoImage: dheLogo ? bufferToBase64(dheLogo) : null,
    dheLogoMime: dheMime,
    eventLogoImage: eventLogo ? bufferToBase64(eventLogo) : null,
    eventLogoMime: eventMime,
    qrImage: qrPng ? bufferToBase64(qrPng) : null,
  });
  return Buffer.from(doc.output("arraybuffer"));
}

export async function generateReceiptPdfBufferFromData(
  data: ReceiptData,
  qrPng?: Buffer | null
): Promise<Buffer> {
  const qrDataUrl = qrDataUrlFromBuffer(qrPng);
  try {
    return await generateRegistrationReceiptPdfFromHtml(data, qrDataUrl);
  } catch (error) {
    console.warn("REGISTRATION_RECEIPT_PDF_HTML_FALLBACK", {
      registrationId: data.registrationId,
      error: error instanceof Error ? error.message : String(error),
    });
    return generateReceiptPdfBufferFromDataJsPdf(data, qrPng);
  }
}

export async function generateReceiptPdfBuffer(
  payload: ReceiptPayload,
  qrPng?: Buffer | null
): Promise<Buffer> {
  return generateReceiptPdfBufferFromData(buildReceiptData(payload), qrPng);
}

export type { ReceiptData, ReceiptPayload } from "@/lib/receipt/receipt-data";
