import { renderRegistrationReceiptPdf } from "@/lib/receipt/registration-receipt-renderer";

/** @deprecated Use renderRegistrationReceiptPdf from registration-receipt-renderer */
export { renderRegistrationReceiptPdf as renderReceiptPdf };

export type { RegistrationReceiptPdfAssets as ReceiptRenderAssets } from "@/lib/receipt/registration-receipt-renderer";
