import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "docs", "go-live", "final-certification-screenshots");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function dismiss() {
  const accept = page.getByRole("button", { name: /Accept all/i });
  if (await accept.isVisible().catch(() => false)) await accept.click();
  const close = page.locator('[aria-label="Close"]').first();
  if (await close.isVisible().catch(() => false)) await close.click();
}

await page.goto("https://www.shikshamahakumbh.com/registration/success?id=SMK2026-000001", {
  waitUntil: "domcontentloaded",
});
await dismiss();
const t0 = Date.now();
await page.getByRole("button", { name: /Download receipt/i }).waitFor({ timeout: 8000 }).catch(() => {});
const text = await page.locator("body").innerText();
console.log(
  JSON.stringify(
    {
      receiptReadyMs: Date.now() - t0,
      downloadReceipt: /Download receipt/i.test(text),
      printReceipt: /Print receipt/i.test(text),
      addToCalendar: /Add to calendar/i.test(text),
    },
    null,
    2
  )
);
await page.screenshot({ path: path.join(OUT, "04-success-receipt-buttons.png") });
await browser.close();
