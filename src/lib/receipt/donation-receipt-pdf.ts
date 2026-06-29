import type { DonationReceiptData } from "@/lib/receipt/donation-receipt";

/** PDF download — HTML render first (matches print); jsPDF fallback if Chromium unavailable */
export async function generateDonationReceiptPdfBuffer(
  data: DonationReceiptData
): Promise<Buffer> {
  try {
    const { generateDonationReceiptPdfFromHtml } = await import(
      "@/lib/receipt/donation-receipt-pdf-html"
    );
    return await generateDonationReceiptPdfFromHtml(data);
  } catch (error) {
    console.warn("DONATION_RECEIPT_PDF_HTML_FALLBACK", {
      donationId: data.donationId,
      error: error instanceof Error ? error.message : String(error),
    });
    const { generateDonationReceiptPdfBufferJsPdf } = await import(
      "@/lib/receipt/donation-receipt-pdf-jspdf"
    );
    return generateDonationReceiptPdfBufferJsPdf(data);
  }
}
