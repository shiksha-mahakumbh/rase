#!/usr/bin/env node
/**
 * Playwright production Conclave form probe (no captcha bypass).
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "https://www.rase.co.in";
const out = {
  checkedAt: new Date().toISOString(),
  base: BASE,
  consoleErrors: [],
  networkErrors: [],
  steps: {},
};

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") out.consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => out.consoleErrors.push(String(err)));
  page.on("response", (res) => {
    if (res.status() >= 400 && res.url().includes("/api/")) {
      out.networkErrors.push({ url: res.url(), status: res.status() });
    }
  });

  await page.goto(`${BASE}/registration`, { waitUntil: "networkidle" });
  out.steps.pageLoad = {
    ok: true,
    title: await page.title(),
    url: page.url(),
  };

  await page.locator("button").filter({ hasText: /^Conclave$/ }).first().click();
  out.steps.selectConclave = { ok: true };

  await page.getByRole("button", { name: /Continue to details/i }).click();
  await page.waitForTimeout(1000);
  out.steps.step2 = { ok: true, url: page.url() };

  await page.getByLabel(/Full name/i).fill("Launch Audit Browser");
  await page.getByLabel(/^Email/i).fill("launch-audit-browser@rase.co.in");
  await page.getByLabel(/Contact/i).fill("9876543210");
  await page.getByLabel(/Designation/i).fill("Auditor");
  await page.getByLabel(/Institution/i).fill("RASE QA");
  await page.getByLabel(/Address/i).fill("123 Test Street, Hamirpur");
  await page.getByLabel(/Country/i).fill("India");

  const gender = page.locator('select, [role="combobox"]').filter({ hasText: /Male|Female/ }).first();
  if (await gender.count()) {
    await gender.selectOption?.("Male").catch(() => {});
  }

  out.steps.fillPartial = { ok: true };

  const continueBtn = page.getByRole("button", { name: /Continue|Submit|Confirm/i });
  if (await continueBtn.count()) {
    const label = await continueBtn.first().textContent();
    out.steps.nextButton = { label: label?.trim() };
  }

  await browser.close();
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(JSON.stringify({ error: String(e), partial: out }, null, 2));
  process.exit(1);
});
