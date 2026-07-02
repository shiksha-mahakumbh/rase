import type { ReceiptData } from "@/lib/receipt/receipt-data";
import { buildRegistrationReceiptHtml } from "@/lib/receipt/registration-receipt";
import { loadDonationReceiptLogoAssets } from "@/lib/receipt/donation-receipt-logos-server";
import { SITE_URL } from "@/config/site";

async function htmlToPdfBuffer(html: string): Promise<Buffer> {
  if (process.env.VERCEL) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    const browser = await puppeteer.default.launch({
      args: chromium.args,
      defaultViewport: { width: 794, height: 1123 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load", timeout: 45_000 });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
      });
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
        preferCSSPageSize: true,
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  try {
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
        margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
        preferCSSPageSize: true,
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  } catch {
    const puppeteer = await import("puppeteer-core");
    const browser = await puppeteer.default.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load", timeout: 45_000 });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
      });
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
        preferCSSPageSize: true,
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}

export async function generateRegistrationReceiptPdfFromHtml(
  data: ReceiptData,
  qrDataUrl?: string | null
): Promise<Buffer> {
  const logos = loadDonationReceiptLogoAssets();
  const html = buildRegistrationReceiptHtml(data, SITE_URL, {
    autoPrint: false,
    embedLogos: true,
    qrDataUrl,
    dheDataUrl: logos.dheDataUrl,
    eventDataUrl: logos.eventDataUrl,
  });
  return htmlToPdfBuffer(html);
}
