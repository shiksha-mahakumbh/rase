"use client";

import { jsPDF } from "jspdf";
import { type ReceiptData } from "@/lib/receipt/receipt-data";
import { renderReceiptPdf } from "@/lib/receipt/receipt-renderer-core";
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

function qrDataUrlToBase64(qrDataUrl: string): string | null {
  if (!qrDataUrl.startsWith("data:image")) return null;
  const base64 = qrDataUrl.split(",")[1];
  return base64 ?? null;
}

export async function downloadReceiptPdfClient(
  data: ReceiptData,
  qrDataUrl?: string | null
): Promise<void> {
  const [dheLogoImage, eventLogoImage, qrImage] = await Promise.all([
    fetchAsBase64(RECEIPT_DHE_LOGO_PATH),
    fetchAsBase64(RECEIPT_EVENT_LOGO_PATH),
    qrDataUrl ? Promise.resolve(qrDataUrlToBase64(qrDataUrl)) : Promise.resolve(null),
  ]);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  renderReceiptPdf(doc, data, { dheLogoImage, eventLogoImage, qrImage });
  doc.save(`receipt-${data.registrationId}.pdf`);
}
