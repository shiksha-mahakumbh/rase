#!/usr/bin/env node
/**
 * Production Bal Shodh Patrika E2E — real Chromium, full form + reCAPTCHA v3.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

if (process.env.DIRECT_URL) process.env.DATABASE_URL = process.env.DIRECT_URL;
const p = new PrismaClient();
const BASE = "https://www.shikshamahakumbh.com";
const TEST_EMAIL = `proof-e2e-${Date.now()}@audit.shikshamahakumbh.test`;
const OUT_DIR = path.resolve("docs/go-live/_proof-artifacts");

fs.mkdirSync(OUT_DIR, { recursive: true });

async function dbState() {
  return {
    count: await p.registration.count(),
    counter: await p.registrationCounter.findFirst(),
    latest: await p.registration.findFirst({
      where: { email: TEST_EMAIL },
      select: {
        id: true,
        registrationId: true,
        registrationType: true,
        email: true,
        fullName: true,
        createdAt: true,
        paymentStatus: true,
      },
    }),
    emails: await p.emailLog.findMany({
      where: { toEmail: TEST_EMAIL },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    allEmailCount: await p.emailLog.count(),
    payments: await p.paymentRecord.count(),
  };
}

const before = await dbState();
const evidence = {
  checkedAt: new Date().toISOString(),
  testEmail: TEST_EMAIL,
  before,
  network: [],
  submitResponse: null,
  sendEmailResponse: null,
  steps: {},
  error: null,
};

let browser;
try {
  browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  page.on("response", async (res) => {
    const url = res.url();
    if (!url.includes("/api/")) return;
    const entry = {
      url,
      method: res.request().method(),
      status: res.status(),
      body: null,
    };
    try {
      entry.body = await res.json();
    } catch {
      entry.body = (await res.text()).slice(0, 300);
    }
    evidence.network.push(entry);
    if (url.includes("/api/registration/submit") && res.request().method() === "POST") {
      evidence.submitResponse = entry;
    }
    if (url.includes("/api/registration/send-email")) {
      evidence.sendEmailResponse = entry;
    }
  });

  await page.goto(`${BASE}/registration`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(4000);
  evidence.steps.pageLoad = { url: page.url(), title: await page.title() };

  await page.locator("button").filter({ hasText: /^Bal Shodh Patrika$/ }).first().click({ timeout: 30000 });
  await page.getByRole("button", { name: /Continue to details/i }).click({ timeout: 20000 });
  await page.waitForTimeout(2500);
  evidence.steps.categorySelected = true;

  await page.locator('input[name="fullName"]').fill("Production Proof Audit");
  await page.locator('input[name="email"]').fill(TEST_EMAIL);
  await page.locator('input[name="contactNumber"]').fill("9876543210");
  await page.locator('input[name="designation"]').fill("QA Auditor");
  await page.locator('input[name="institution"]').fill("Shiksha Mahakumbh QA");
  await page.locator('textarea[name="address"]').fill("NIT Hamirpur, Himachal Pradesh, India");
  await page.locator('input[name="country"]').fill("India");

  await page.locator('input[name="gender"][value="Male"]').check({ force: true });
  await page.locator('input[name="vidyaBharti"][value="Non Vidya Bharti"]').check({ force: true });

  await page.locator('input[name="title"]').fill("Bal Shodh Patrika E2E Proof Entry");
  await page.locator('textarea[name="description"]').fill(
    "Automated production proof submission for Bal Shodh Patrika category verification after redeploy."
  );

  evidence.steps.formFilled = true;
  await page.screenshot({ path: path.join(OUT_DIR, "registration-form-filled.png"), fullPage: true });

  await page.waitForFunction(
    () => typeof window.grecaptcha !== "undefined" && typeof window.grecaptcha.execute === "function",
    { timeout: 30000 }
  ).catch(() => {
    evidence.steps.recaptchaLoaded = false;
  });
  evidence.steps.recaptchaLoaded = evidence.steps.recaptchaLoaded !== false;

  await page.getByRole("button", { name: /Submit Registration/i }).click({ timeout: 15000 });
  await page.waitForTimeout(15000);

  evidence.steps.afterSubmit = {
    url: page.url(),
    hasSuccess: page.url().includes("success") || (await page.content()).includes("SMK2026"),
  };
  await page.screenshot({ path: path.join(OUT_DIR, "registration-after-submit.png"), fullPage: true });
} catch (e) {
  evidence.error = String(e);
} finally {
  if (browser) await browser.close();
}

const after = await dbState();
const secret = process.env.ADMIN_OPS_SECRET ?? process.env.REGISTRATION_EMAIL_SECRET;
let adminList = null;
if (secret) {
  const r = await fetch(`${BASE}/api/v2/admin/registrations?limit=5&search=${encodeURIComponent(TEST_EMAIL)}`, {
    headers: { "x-ops-secret": secret },
  });
  adminList = { status: r.status, body: await r.json().catch(() => null) };
}

const securitySeo = {
  lookup: await fetch(`${BASE}/api/registration/SMK2026-000001`).then(async (r) => ({
    status: r.status,
    body: await r.json().catch(() => null),
  })),
  gateway: await fetch(`${BASE}/api/admin/gateway/registrations`).then(async (r) => ({
    status: r.status,
    body: await r.json().catch(() => null),
  })),
  webhook: await fetch(`${BASE}/api/payments/razorpay-webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  }).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) })),
  sitemap: await fetch(`${BASE}/sitemap.xml`).then((r) => r.text()),
  robots: await fetch(`${BASE}/robots.txt`).then((r) => r.text()),
  home: await fetch(`${BASE}/`).then((r) => r.text()),
};

const createOrder = await fetch(`${BASE}/api/payments/create-order`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 10000, currency: "INR", receipt: `proof_${Date.now()}` }),
}).then(async (r) => ({ status: r.status, body: await r.json().catch(() => null) }));

const result = {
  evidence,
  after,
  adminList,
  securitySeo: {
    lookup: securitySeo.lookup,
    gateway: securitySeo.gateway,
    webhook: securitySeo.webhook,
    canonical: securitySeo.home.match(/rel="canonical"\s+href="([^"]+)"/i)?.[1],
    sitemapCom: (securitySeo.sitemap.match(/shikshamahakumbh\.com/g) || []).length,
    sitemapRase: (securitySeo.sitemap.match(/rase\.co\.in/g) || []).length,
    robotsSitemap: securitySeo.robots.match(/Sitemap:\s*(.+)/)?.[1]?.trim(),
  },
  createOrder,
  proof: {
    registrationId:
      evidence.submitResponse?.body?.registrationId ?? after.latest?.registrationId ?? null,
    countDelta: after.count - before.count,
    counterDelta: (after.counter?.lastNumber ?? 0) - (before.counter?.lastNumber ?? 0),
    emailRows: after.emails,
  },
};

fs.writeFileSync(path.join(OUT_DIR, "proof-run.json"), JSON.stringify(result, (_, v) => (typeof v === "bigint" ? Number(v) : v), 2));
console.log(JSON.stringify(result, (_, v) => (typeof v === "bigint" ? Number(v) : v), 2));
await p.$disconnect();
