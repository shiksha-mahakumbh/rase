import { jsPDF } from "jspdf";
import type { DonationReceiptData } from "@/lib/receipt/donation-receipt";
import {
  HINDI_CAMPAIGN_PNG_BASE64,
  HINDI_THANKS_PNG_BASE64,
} from "@/lib/receipt/donation-receipt-hindi-assets";
import { loadDonationReceiptLogoAssets } from "@/lib/receipt/donation-receipt-logos-server";
import { renderDonationReceiptPdf } from "@/lib/receipt/donation-receipt-renderer";

/** jsPDF fallback when HTML/Chromium PDF is unavailable */
export function generateDonationReceiptPdfBufferJsPdf(data: DonationReceiptData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const logos = loadDonationReceiptLogoAssets();

  renderDonationReceiptPdf(doc, data, {
    dheLogoImage: logos.dheBase64,
    dheLogoMime: logos.dheMime ?? undefined,
    eventLogoImage: logos.eventBase64,
    eventLogoMime: logos.eventMime ?? undefined,
    hindiCampaignImage: HINDI_CAMPAIGN_PNG_BASE64,
    hindiThanksImage: HINDI_THANKS_PNG_BASE64,
  });

  return Buffer.from(doc.output("arraybuffer"));
}
