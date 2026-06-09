#!/usr/bin/env node
import { chromium } from "playwright";

const BASE = process.argv[2] || "https://www.rase.co.in";
const id = process.argv[3] || "SMK2026-000001";
const out = { checkedAt: new Date().toISOString(), consoleErrors: [], steps: {} };

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") out.consoleErrors.push(msg.text());
  });

  const regUrl = `${BASE}/registration`;
  await page.goto(regUrl, { waitUntil: "domcontentloaded" });
  out.steps.registrationHub = {
    title: await page.title(),
    hasConclave: (await page.locator("button", { hasText: "Conclave" }).count()) > 0,
    hasContinue: (await page.getByRole("button", { name: /Continue to details/i }).count()) > 0,
  };

  await page.goto(`${BASE}/registration/success?id=${id}`, {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(3000);
  const body = await page.locator("body").innerText();
  out.steps.successPage = {
    url: page.url(),
    containsId: body.includes(id),
    containsReleaseVerify: body.includes("Release Verify"),
    snippet: body.replace(/\s+/g, " ").slice(0, 400),
  };

  await browser.close();
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(JSON.stringify({ error: String(e), partial: out }, null, 2));
  process.exit(1);
});
