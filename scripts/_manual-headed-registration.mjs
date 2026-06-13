#!/usr/bin/env node
/**
 * Headed browser registration — uses installed Chrome, slow interaction for reCAPTCHA v3.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

if (process.env.DIRECT_URL) process.env.DATABASE_URL = process.env.DIRECT_URL;
const p = new PrismaClient();
const BASE = "https://www.shikshamahakumbh.com";
const TEST_EMAIL = `manual-proof-${Date.now()}@audit.shikshamahakumbh.test`;
const OUT = path.resolve("docs/go-live/_manual-proof-artifacts");
fs.mkdirSync(OUT, { recursive: true });

async function snap(page, name) {
  const fp = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: fp, fullPage: true });
  return fp;
}

const before = {
  count: await p.registration.count(),
  counter: await p.registrationCounter.findFirst(),
};

const log = {
  checkedAt: new Date().toISOString(),
  testEmail: TEST_EMAIL,
  before,
  screenshots: {},
  network: [],
  submitResponse: null,
  sendEmailResponse: null,
  error: null,
  steps: {},
};

let browser;
try {
  browser = await chromium.launch({
    headless: false,
    channel: "chrome",
    slowMo: 100,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: "en-IN",
  });
  const page = await context.newPage();

  page.on("response", async (res) => {
    const url = res.url();
    if (!url.includes("/api/registration/")) return;
    const entry = {
      at: new Date().toISOString(),
      url,
      method: res.request().method(),
      status: res.status(),
      body: null,
    };
    try {
      entry.body = await res.json();
    } catch {
      entry.body = (await res.text()).slice(0, 500);
    }
    log.network.push(entry);
    if (url.includes("/submit") && res.request().method() === "POST") log.submitResponse = entry;
    if (url.includes("/send-email")) log.sendEmailResponse = entry;
  });

  await page.goto(`${BASE}/registration`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(3000);
  log.screenshots.before = await snap(page, "01-hub");
  log.steps.pageLoad = true;

  await page.locator("button").filter({ hasText: /^Bal Shodh Patrika$/ }).first().click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: /Continue to details/i }).click();
  await page.waitForTimeout(2000);
  log.screenshots.formStep = await snap(page, "02-form-step");

  await page.locator('input[name="fullName"]').fill("Manual Production Proof");
  await page.locator('input[name="email"]').fill(TEST_EMAIL);
  await page.locator('input[name="contactNumber"]').fill("9876501234");
  await page.locator('input[name="designation"]').fill("Verification Auditor");
  await page.locator('input[name="institution"]').fill("DHE QA Team");
  await page.locator('textarea[name="address"]').fill("Department of Holistic Education, NIT Hamirpur, HP");
  await page.locator('input[name="country"]').fill("India");
  await page.locator('input[name="gender"][value="Male"]').check({ force: true });
  await page.locator('input[name="vidyaBharti"][value="Non Vidya Bharti"]').check({ force: true });
  await page.locator('input[name="title"]').fill("Manual Bal Shodh Patrika Proof Entry");
  await page.locator('textarea[name="description"]').fill(
    "Manual production verification submission for Bal Shodh Patrika registration persistence and email delivery proof."
  );

  log.screenshots.beforeSubmit = await snap(page, "03-before-submit");
  log.steps.formFilled = true;

  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: /Submit Registration/i }).click();
  await page.waitForTimeout(20000);

  log.screenshots.afterSubmit = await snap(page, "04-after-submit");
  log.steps.finalUrl = page.url();
  log.steps.pageText = (await page.textContent("body"))?.slice(0, 1500);

  const idMatch = log.steps.pageText?.match(/SMK2026-\d{6}/);
  log.steps.registrationIdFromPage = idMatch?.[0] ?? null;
} catch (e) {
  log.error = String(e);
} finally {
  if (browser) await browser.close();
}

const after = {
  count: await p.registration.count(),
  counter: await p.registrationCounter.findFirst(),
  row: await p.registration.findFirst({
    where: { email: TEST_EMAIL },
    select: {
      id: true,
      registrationId: true,
      registrationType: true,
      email: true,
      fullName: true,
      createdAt: true,
      emailDeliveryStatus: true,
    },
  }),
  emails: await p.emailLog.findMany({
    where: { toEmail: TEST_EMAIL },
    orderBy: { createdAt: "desc" },
    take: 5,
  }),
  recentEmails: await p.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
};

fs.writeFileSync(path.join(OUT, "manual-run.json"), JSON.stringify({ log, after }, (_, v) => (typeof v === "bigint" ? Number(v) : v), 2));
console.log(JSON.stringify({ log, after }, (_, v) => (typeof v === "bigint" ? Number(v) : v), 2));
await p.$disconnect();
