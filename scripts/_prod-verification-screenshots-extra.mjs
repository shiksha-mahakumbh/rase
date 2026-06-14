#!/usr/bin/env node
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "docs", "go-live", "prod-verification-screenshots");
const BASE = "https://www.shikshamahakumbh.com";

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function dismissOverlays() {
  const accept = page.getByRole("button", { name: /Accept all/i });
  if (await accept.isVisible().catch(() => false)) await accept.click();
  const close = page.getByRole("button", { name: /^close$/i }).or(page.locator('button[aria-label="Close"]'));
  if (await close.first().isVisible().catch(() => false)) await close.first().click();
}

await page.goto(`${BASE}/registration`, { waitUntil: "networkidle", timeout: 60000 });
await dismissOverlays();
await page.waitForTimeout(1500);
await page.screenshot({ path: path.join(OUT, "06-category-grid.png"), fullPage: true });
console.log("saved 06-category-grid");

// Projects category
await page.goto(`${BASE}/registration`, { waitUntil: "networkidle" });
await dismissOverlays();
const projectsBtn = page.getByRole("button", { name: /^Projects$/i });
if (await projectsBtn.isVisible().catch(() => false)) {
  await projectsBtn.click();
  await page.getByRole("button", { name: /Continue to details/i }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, "07-projects-form.png"), fullPage: true });
  console.log("saved 07-projects-form");
}

// Accommodation
await page.goto(`${BASE}/registration`, { waitUntil: "networkidle" });
await dismissOverlays();
const accBtn = page.getByRole("button", { name: /^Accommodation$/i });
if (await accBtn.isVisible().catch(() => false)) {
  await accBtn.click();
  await page.getByRole("button", { name: /Continue to details/i }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, "08-accommodation-form.png"), fullPage: true });
  console.log("saved 08-accommodation-form");
}

// Research menu
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await dismissOverlays();
await page.getByRole("button", { name: /^Research$/i }).first().hover();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(OUT, "09-research-dropdown.png"), fullPage: false });
console.log("saved 09-research-dropdown");

await browser.close();
