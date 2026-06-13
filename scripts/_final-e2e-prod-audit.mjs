#!/usr/bin/env node
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";

if (process.env.DIRECT_URL) process.env.DATABASE_URL = process.env.DIRECT_URL;
const p = new PrismaClient();
const BASE = "https://www.shikshamahakumbh.com";
const TEST_EMAIL = `e2e-audit-${Date.now()}@audit.shikshamahakumbh.test`;

async function dbSnapshot(label) {
  const registrations = await p.registration.count();
  const counters = await p.registrationCounter.findMany();
  const emailLogs = await p.emailLog.count();
  const payments = await p.paymentRecord.count();
  const latest = await p.registration.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      registrationId: true,
      registrationType: true,
      email: true,
      paymentStatus: true,
      createdAt: true,
    },
  });
  const recentEmails = await p.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      toEmail: true,
      subject: true,
      template: true,
      status: true,
      providerMsgId: true,
      sentAt: true,
      createdAt: true,
      errorMessage: true,
    },
  });
  return { label, registrations, counters, emailLogs, payments, latest, recentEmails };
}

async function liveSecuritySeo() {
  const results = {};
  const reg = await fetch(`${BASE}/api/registration/SMK2026-000001`);
  results.lookup = { status: reg.status, body: await reg.json().catch(() => null) };

  const gw = await fetch(`${BASE}/api/admin/gateway/registrations`);
  const gwText = await gw.text();
  results.gateway = {
    status: gw.status,
    body: (() => {
      try {
        return JSON.parse(gwText);
      } catch {
        return gwText.slice(0, 80);
      }
    })(),
  };

  const wh = await fetch(`${BASE}/api/payments/razorpay-webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  results.webhook = { status: wh.status, body: await wh.json().catch(() => null) };

  const burst = [];
  for (let i = 0; i < 20; i++) {
    const r = await fetch(`${BASE}/api/registration/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    burst.push(r.status);
  }
  results.rateLimit = { triggered: burst.includes(429), unique: [...new Set(burst)] };

  const home = await fetch(`${BASE}/`).then((r) => r.text());
  results.seo = {
    canonical: home.match(/rel="canonical"\s+href="([^"]+)"/i)?.[1],
    og: home.match(/property="og:url"\s+content="([^"]+)"/i)?.[1],
    raseRefs: (home.match(/rase\.co\.in/g) || []).length,
    orgRefs: (home.match(/shikshamahakumbh\.org/g) || []).length,
  };
  const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
  const robots = await fetch(`${BASE}/robots.txt`).then((r) => r.text());
  results.seo.sitemapCount = (sitemap.match(/<loc>/g) || []).length;
  results.seo.sitemapRase = (sitemap.match(/rase\.co\.in/g) || []).length;
  results.seo.sitemapCom = (sitemap.match(/shikshamahakumbh\.com/g) || []).length;
  results.seo.robotsSitemap = robots.match(/Sitemap:\s*(.+)/)?.[1]?.trim();

  return results;
}

async function tryRegistrationSubmit() {
  const out = { method: "playwright", email: TEST_EMAIL, steps: {}, submitResponse: null, error: null };
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    page.on("response", async (res) => {
      if (res.url().includes("/api/registration/submit") && res.request().method() === "POST") {
        out.submitResponse = {
          status: res.status(),
          body: await res.json().catch(() => null),
        };
      }
    });

    await page.goto(`${BASE}/registration`, { waitUntil: "networkidle", timeout: 90000 });
    out.steps.pageLoad = true;

    await page.getByRole("button", { name: /Bal Shodh Patrika/i }).click({ timeout: 20000 });
    await page.getByRole("button", { name: /Continue to details/i }).click({ timeout: 15000 });
    await page.waitForTimeout(2000);

    await page.getByLabel(/Full name/i).fill("E2E Production Audit");
    await page.getByLabel(/^Email/i).fill(TEST_EMAIL);
    const contact = page.getByLabel(/Contact|Phone/i).first();
    if (await contact.count()) await contact.fill("9999900001");
    for (const label of [/Designation/i, /Institution/i, /Address/i]) {
      const el = page.getByLabel(label).first();
      if (await el.count()) await el.fill("E2E Audit Test");
    }
    const country = page.getByLabel(/Country/i).first();
    if (await country.count()) await country.fill("India");
    out.steps.formFilled = true;

    const submit = page.getByRole("button", { name: /Submit|Register|Confirm/i }).last();
    if (await submit.count()) {
      await submit.click({ timeout: 15000 });
      await page.waitForTimeout(10000);
      out.steps.clickedSubmit = true;
      out.steps.finalUrl = page.url();
    }
  } catch (e) {
    out.error = String(e);
  } finally {
    if (browser) await browser.close();
  }
  return out;
}

async function tryCreateOrder() {
  const r = await fetch(`${BASE}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 10000, currency: "INR", receipt: `e2e_${Date.now()}` }),
  });
  return { status: r.status, body: await r.json().catch(() => null) };
}

async function adminRegistrations() {
  const secret = process.env.ADMIN_OPS_SECRET ?? process.env.REGISTRATION_EMAIL_SECRET;
  if (!secret) return { skipped: true, reason: "ADMIN_OPS_SECRET not in local env" };
  const r = await fetch(`${BASE}/api/v2/admin/registrations?limit=10`, {
    headers: { "x-ops-secret": secret },
  });
  return { status: r.status, body: await r.json().catch(() => null) };
}

const report = {
  checkedAt: new Date().toISOString(),
  base: BASE,
  testEmail: TEST_EMAIL,
};

report.before = await dbSnapshot("before");
report.securitySeo = await liveSecuritySeo();
report.registrationAttempt = await tryRegistrationSubmit();
report.after = await dbSnapshot("after");
report.createOrder = await tryCreateOrder();
report.adminList = await adminRegistrations();

const newReg =
  report.after.latest.find((r) => r.email === TEST_EMAIL) ??
  (report.registrationAttempt.submitResponse?.body?.registrationId
    ? report.after.latest.find(
        (r) => r.registrationId === report.registrationAttempt.submitResponse.body.registrationId
      )
    : null);

report.registrationProof = {
  apiSuccess: Boolean(report.registrationAttempt.submitResponse?.body?.success),
  submitStatus: report.registrationAttempt.submitResponse?.status ?? null,
  submitBody: report.registrationAttempt.submitResponse?.body ?? null,
  registrationId: report.registrationAttempt.submitResponse?.body?.registrationId ?? newReg?.registrationId ?? null,
  counterBefore: report.before.counters,
  counterAfter: report.after.counters,
  countDelta: report.after.registrations - report.before.registrations,
  newRow: newReg ?? null,
};

console.log(JSON.stringify(report, (_, v) => (typeof v === "bigint" ? Number(v) : v), 2));
await p.$disconnect();
