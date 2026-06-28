import type { DonationReceiptData } from "@/lib/receipt/donation-receipt";
import { buildDonationReceiptHtml } from "@/lib/receipt/donation-receipt";
import { loadDonationReceiptLogoAssets } from "@/lib/receipt/donation-receipt-logos-server";
import { SITE_URL } from "@/config/site";

/** Render the same HTML receipt to PDF — matches print view including Hindi & logos */
export async function generateDonationReceiptPdfFromHtml(
  data: DonationReceiptData,
  origin = SITE_URL
): Promise<Buffer> {
  const logos = loadDonationReceiptLogoAssets();
  const html = buildDonationReceiptHtml(data, origin, {
    autoPrint: false,
    embedLogos: true,
    dheDataUrl: logos.dheDataUrl,
    eventDataUrl: logos.eventDataUrl,
  });

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
