import type { ReceiptData } from "@/lib/receipt/receipt-data";
import { buildRegistrationReceiptBodyHtml } from "@/lib/receipt/registration-receipt-layout";

export type ReceiptHtmlOptions = {
  origin?: string;
  qrDataUrl?: string | null;
};

/** HTML document for legacy callers — prefer buildRegistrationReceiptHtml */
export function buildReceiptHtmlDocument(
  data: ReceiptData,
  options: ReceiptHtmlOptions = {}
): string {
  const body = buildRegistrationReceiptBodyHtml(data, {
    origin: options.origin,
    qrDataUrl: options.qrDataUrl,
  });
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Receipt ${data.registrationId}</title></head><body>${body}</body></html>`;
}

/** @deprecated PDF sections are built via registration-receipt-layout */
export function getReceiptPdfSections(_data: ReceiptData) {
  return [];
}

export {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
  RECEIPT_LOGO_PATH,
} from "@/lib/receipt/receipt-logos";
