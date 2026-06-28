import fs from "node:fs";
import path from "node:path";
import { jsPDF } from "jspdf";
import type { DonationReceiptData } from "@/lib/receipt/donation-receipt";
import { loadDonationReceiptLogoAssets } from "@/lib/receipt/donation-receipt-logos-server";
import { renderDonationReceiptPdf } from "@/lib/receipt/donation-receipt-renderer";

const HINDI_ASSETS = {
  campaign: "receipt/hindi-campaign.png",
  thanks: "receipt/hindi-thanks-block.png",
} as const;

function loadPublicFile(relativePath: string): Buffer | null {
  try {
    const file = path.join(process.cwd(), "public", relativePath);
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file);
  } catch {
    return null;
  }
}

/** jsPDF fallback when HTML/Chromium PDF is unavailable (e.g. some serverless runtimes) */
export function generateDonationReceiptPdfBufferJsPdf(data: DonationReceiptData): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const logos = loadDonationReceiptLogoAssets();
  const hindiCampaign = loadPublicFile(HINDI_ASSETS.campaign);
  const hindiThanks = loadPublicFile(HINDI_ASSETS.thanks);

  renderDonationReceiptPdf(doc, data, {
    dheLogoImage: logos.dheBase64,
    dheLogoMime: logos.dheMime ?? undefined,
    eventLogoImage: logos.eventBase64,
    eventLogoMime: logos.eventMime ?? undefined,
    hindiCampaignImage: hindiCampaign ? hindiCampaign.toString("base64") : null,
    hindiThanksImage: hindiThanks ? hindiThanks.toString("base64") : null,
  });

  return Buffer.from(doc.output("arraybuffer"));
}
