#!/usr/bin/env node
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "docs", "go-live", "prod-verification-screenshots");
const BASE = "https://www.shikshamahakumbh.com";

fs.mkdirSync(OUT, { recursive: true });

const shots = [
  { name: "01-registration-hub", url: `${BASE}/registration`, wait: 3000 },
  { name: "02-registration-delegate", url: `${BASE}/registration`, action: "delegate" },
  { name: "03-success-page", url: `${BASE}/registration/success?id=SMK2026-000001`, wait: 2000 },
  { name: "04-homepage-hero", url: `${BASE}/`, wait: 2000 },
  { name: "05-research-nav", url: `${BASE}/`, action: "research-menu" },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const shot of shots) {
  await page.goto(shot.url, { waitUntil: "networkidle", timeout: 60000 });
  if (shot.wait) await page.waitForTimeout(shot.wait);

  if (shot.action === "delegate") {
    const btn = page.getByRole("button", { name: /Delegate Registration/i }).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(500);
      const cont = page.getByRole("button", { name: /Continue to details/i });
      if (await cont.isVisible().catch(() => false)) await cont.click();
      await page.waitForTimeout(1500);
    }
  }

  if (shot.action === "research-menu") {
    const research = page.getByRole("button", { name: /^Research$/i }).or(page.getByText(/^Research$/).first());
    if (await research.isVisible().catch(() => false)) {
      await research.hover();
      await page.waitForTimeout(800);
    }
  }

  await page.screenshot({ path: path.join(OUT, `${shot.name}.png`), fullPage: false });
  console.log("saved", shot.name);
}

await browser.close();
console.log("OUT", OUT);
