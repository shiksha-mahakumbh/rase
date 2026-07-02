import type { ReceiptData } from "@/lib/receipt/receipt-data";

/** Open print dialog for the on-page receipt — no pop-up window required. */
export function printReceiptDocument(_data: ReceiptData, _qrDataUrl?: string | null) {
  if (typeof window === "undefined") return;
  window.print();
}
