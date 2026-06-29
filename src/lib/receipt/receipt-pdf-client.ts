"use client";

import { jsPDF } from "jspdf";
import { type ReceiptData } from "@/lib/receipt/receipt-data";
import { renderRegistrationReceiptPdf } from "@/lib/receipt/registration-receipt-renderer";
import {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
} from "@/lib/receipt/receipt-logos";

async function fetchAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
    return btoa(binary);
  } catch {
    return null;
  }
}

/** Offline fallback when server PDF route is unavailable */
export async function downloadReceiptPdfClient(
  data: ReceiptData,
  qrDataUrl?: string | null
): Promise<void> {
  const [dheLogoImage, eventLogoImage] = await Promise.all([
    fetchAsBase64(RECEIPT_DHE_LOGO_PATH),
    fetchAsBase64(RECEIPT_EVENT_LOGO_PATH),
  ]);

  const qrImage = qrDataUrl?.startsWith("data:")
    ? qrDataUrl.split(",")[1] ?? null
    : null;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  renderRegistrationReceiptPdf(doc, data, { dheLogoImage, eventLogoImage, qrImage });
  doc.save(`receipt-${data.registrationId}.pdf`);
}
