import type { ReceiptData } from "@/lib/receipt/receipt-data";
import { buildReceiptHtmlDocument } from "@/lib/receipt/receipt-html";

/** Open a print window with receipt HTML — avoids sr-only / visibility print bugs */
export function printReceiptDocument(data: ReceiptData) {
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;
  const html = buildReceiptHtmlDocument(data, { origin });

  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=1100");
  if (!win) {
    window.alert("Please allow pop-ups to print your receipt.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}
