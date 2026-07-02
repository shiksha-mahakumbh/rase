import type { ReceiptData } from "@/lib/receipt/receipt-data";
import { buildRegistrationReceiptHtml } from "@/lib/receipt/registration-receipt";

/** Print the same HTML layout as the official receipt (single page, no pop-up). */
export function printReceiptDocument(data: ReceiptData, qrDataUrl?: string | null) {
  if (typeof window === "undefined") return;

  const html = buildRegistrationReceiptHtml(data, window.location.origin, {
    autoPrint: true,
    embedLogos: true,
    qrDataUrl,
  });

  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Print registration receipt");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    window.alert("Unable to open print view. Please download the PDF receipt instead.");
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  window.setTimeout(() => {
    document.body.removeChild(iframe);
  }, 60_000);
}
