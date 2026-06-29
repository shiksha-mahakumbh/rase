import type { ReceiptData } from "@/lib/receipt/receipt-data";
import { buildRegistrationReceiptHtml } from "@/lib/receipt/registration-receipt";

/** Open a print window with receipt HTML — same layout as PDF download */
export function printReceiptDocument(data: ReceiptData, qrDataUrl?: string | null) {
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;
  const html = buildRegistrationReceiptHtml(data, origin, {
    autoPrint: true,
    embedLogos: true,
    qrDataUrl,
  });

  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=1100");
  if (!win) {
    window.alert("Please allow pop-ups to print your receipt.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
