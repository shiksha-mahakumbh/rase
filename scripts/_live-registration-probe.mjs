#!/usr/bin/env node
import { chromium, devices } from "playwright";

const BASE = (process.argv[2] || "https://www.rase.co.in").replace(/\/$/, "");

async function dismissOverlays(page) {
  const accept = page.getByRole("button", { name: /Accept all/i });
  if (await accept.isVisible().catch(() => false)) await accept.click().catch(() => {});
  const close = page.locator('[aria-label="Close"]').first();
  if (await close.isVisible().catch(() => false)) await close.click().catch(() => {});
}

async function runViewport(name, contextOptions) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext(contextOptions);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.goto(`${BASE}/registration`, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await dismissOverlays(page);

  const body = await page.locator("body").innerText();
  const checks = {
    noLodging: !body.includes("Lodging requests for event dates"),
    projectGroup: body.includes("Project displays"),
    septemberHub: /September/i.test(body),
  };

  const projects = page.getByRole("button", { name: /Projects/i }).first();
  await projects.scrollIntoViewIfNeeded();
  await projects.click({ timeout: 20_000 });
  await page.getByRole("button", { name: /Continue to details/i }).click();
  await page.waitForTimeout(2000);

  const form = await page.locator("body").innerText();
  checks.school200 = /School Level Project[\s\S]{0,80}200/i.test(form);
  checks.college500 = /College Level Project[\s\S]{0,80}500/i.test(form);
  checks.university500 = /University Level Project[\s\S]{0,80}500/i.test(form);
  checks.septNotice = /beginning of September/i.test(form);
  checks.consoleErrors = errors.slice(0, 5);

  console.log(JSON.stringify({ viewport: name, checks }, null, 2));
  await browser.close();
  return checks;
}

const desktop = await runViewport("desktop", { viewport: { width: 1440, height: 900 } });
const mobile = await runViewport("mobile", devices["iPhone 13"]);
const tablet = await runViewport("tablet", devices["iPad (gen 7)"]);

const allPass = [desktop, mobile, tablet].every(
  (c) =>
    c.noLodging &&
    c.projectGroup &&
    c.school200 &&
    c.college500 &&
    c.university500 &&
    c.septNotice
);
process.exit(allPass ? 0 : 1);
