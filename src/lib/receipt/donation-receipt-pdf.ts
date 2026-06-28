import type { DonationReceiptData } from "@/lib/receipt/donation-receipt";
import { generateDonationReceiptPdfFromHtml } from "@/lib/receipt/donation-receipt-pdf-html";
import { generateDonationReceiptPdfBufferJsPdf } from "@/lib/receipt/donation-receipt-pdf-jspdf";

/** PDF download — HTML render first (matches print); jsPDF fallback if Chromium unavailable */
export async function generateDonationReceiptPdfBuffer(
  data: DonationReceiptData
): Promise<Buffer> {
  try {
    return await generateDonationReceiptPdfFromHtml(data);
  } catch (error) {
    console.warn("DONATION_RECEIPT_PDF_HTML_FALLBACK", {
      donationId: data.donationId,
      error: error instanceof Error ? error.message : String(error),
    });
    return generateDonationReceiptPdfBufferJsPdf(data);
  }
}
