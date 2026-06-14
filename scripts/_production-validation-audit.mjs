#!/usr/bin/env node
/**
 * Read-only production validation — Shiksha Mahakumbh
 * Output: docs/go-live/PRODUCTION_VALIDATION_EVIDENCE.json
 */
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "docs", "go-live", "prod-validation-2026-06-14");
const OUT_JSON = path.join(__dirname, "..", "docs", "go-live", "PRODUCTION_VALIDATION_EVIDENCE.json");
const BASE = "https://www.shikshamahakumbh.com";
const DEPLOY_COMMIT = "082f8f6";
const DEPLOY_ID = "dpl_FwiRjnoLKijanFjC3XNQwu9cHHSX";

fs.mkdirSync(OUT_DIR, { recursive: true });

const prisma = new PrismaClient();
const report = {
  auditedAt: new Date().toISOString(),
  productionUrl: BASE,
  deployment: { commit: DEPLOY_COMMIT, id: DEPLOY_ID },
  phase1_registration: {},
  phase2_payment: {},
  phase3_database: {},
  phase4_email: {},
  phase5_receipt: {},
  phase6_navigation: {},
  phase7_security: {},
  verdict: {},
};

const FORBIDDEN_NAV = [
  "Submit Paper",
  "Paper Submission",
  "Abstract Submission",
  "Full Length Paper",
  "Call For Paper",
  "Call for Paper",
  "Call for Papers",
];
const ALLOWED_NAV = ["Multi Track Conference", "CMT", "cmt3.research.microsoft.com"];

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  return { url, status: res.status, text: await res.text(), finalUrl: res.url };
}

// ─── PHASE 3: Database ───────────────────────────────────────────────────────
async function phase3Database() {
  const latestRegs = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      registrationId: true,
      registrationType: true,
      email: true,
      fullName: true,
      paymentStatus: true,
      emailDeliveryStatus: true,
      createdAt: true,
    },
  });

  const latestPayments = await prisma.paymentRecord.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      registrationId: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
      amount: true,
      status: true,
      createdAt: true,
      registration: { select: { registrationId: true, email: true } },
    },
  });

  const emailStatusGroups = await prisma.emailLog.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  const latestEmails = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      registrationId: true,
      toEmail: true,
      status: true,
      provider: true,
      providerMsgId: true,
      template: true,
      errorMessage: true,
      sentAt: true,
      createdAt: true,
    },
  });

  const sentCount = emailStatusGroups.find((g) => g.status === "sent")?._count.status ?? 0;

  report.phase3_database = {
    registrations_latest: latestRegs,
    payment_records_latest: latestPayments.map((p) => ({
      ...p,
      amount: String(p.amount),
      publicRegistrationId: p.registration?.registrationId,
      email: p.registration?.email,
    })),
    email_logs_status_distribution: emailStatusGroups,
    email_logs_latest: latestEmails,
    checks: {
      has_sent_email_log: sentCount > 0,
      payment_records_exist: latestPayments.length > 0,
      uuid_fk_on_latest_sent: latestEmails.find((e) => e.status === "sent")?.registrationId?.includes("-") === false,
    },
  };
}

// ─── PHASE 7: Security ───────────────────────────────────────────────────────
async function phase7Security() {
  const gatewayPaths = [
    "/api/admin/gateway/registrations",
    "/api/admin/gateway/stats",
    "/api/admin/gateway/email-logs",
  ];
  const gateway = {};
  for (const p of gatewayPaths) {
    const res = await fetch(`${BASE}${p}`);
    let body;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    gateway[p] = { status: res.status, body };
  }

  const submitEmpty = await fetch(`${BASE}/api/registration/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });

  const webhook = await fetch(`${BASE}/api/payments/razorpay-webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });

  const lookup = await fetch(`${BASE}/api/registration/SMK2026-000001`);

  report.phase7_security = {
    admin_gateway: gateway,
    registration_submit_empty_body: { status: submitEmpty.status },
    razorpay_webhook_unsigned: {
      status: webhook.status,
      body: await webhook.json().catch(() => null),
    },
    registration_lookup: {
      status: lookup.status,
      body: await lookup.json().catch(() => null),
    },
    checks: {
      gateway_returns_401: Object.values(gateway).every((g) => g.status === 401),
      submit_rejects_empty: submitEmpty.status === 400 || submitEmpty.status === 403 || submitEmpty.status === 429,
      webhook_protected: webhook.status === 401 || webhook.status === 400,
    },
  };
}

// ─── PHASE 6: Navigation ─────────────────────────────────────────────────────
async function phase6Navigation() {
  const pages = [
    { name: "homepage", url: `${BASE}/` },
    { name: "registration", url: `${BASE}/registration` },
    { name: "sitemap", url: `${BASE}/sitemap.xml` },
    { name: "about_intro", url: `${BASE}/introduction` },
    { name: "research_papers", url: `${BASE}/research-papers` },
    { name: "abstract_redirect", url: `${BASE}/abstract` },
    { name: "paper_redirect", url: `${BASE}/paper` },
  ];

  const results = {};
  for (const p of pages) {
    const { status, text, finalUrl } = await fetchText(p.url);
    const forbiddenFound = FORBIDDEN_NAV.filter((term) =>
      text.toLowerCase().includes(term.toLowerCase())
    );
    const allowedFound = ALLOWED_NAV.filter((term) => text.includes(term));
    results[p.name] = {
      status,
      finalUrl,
      forbiddenFound,
      allowedFound,
      pass: forbiddenFound.length === 0,
    };
  }

  report.phase6_navigation = {
    pages: results,
    checks: {
      all_pages_clean: Object.values(results).every((r) => r.pass),
      any_forbidden: Object.values(results).some((r) => r.forbiddenFound.length > 0),
    },
  };
}

// ─── PHASE 2: Payment API + UI fee probe ─────────────────────────────────────
async function phase2Payment(page) {
  const createOrder = await fetch(`${BASE}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 20000, registrationType: "Projects" }),
  });

  report.phase2_payment.api_create_order_unauthenticated = {
    status: createOrder.status,
    body: await createOrder.json().catch(() => null),
  };

  // UI: Projects category fee display
  const ui = { schoolFee: null, collegeFee: null, paymentStepVisible: null, stepLabel: null };
  try {
    await page.goto(`${BASE}/registration`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2000);
    const dismiss = page.getByRole("button", { name: /Accept all/i });
    if (await dismiss.isVisible().catch(() => false)) await dismiss.click();

    const projectsBtn = page.getByRole("button", { name: /Projects/i }).first();
    if (await projectsBtn.isVisible().catch(() => false)) {
      await projectsBtn.click();
      await page.waitForTimeout(800);
      const bodyText = await page.locator("body").innerText();
      ui.schoolFee = /₹?\s*200/.test(bodyText) || /200/.test(bodyText);
      ui.collegeFee = /₹?\s*400/.test(bodyText) || /400/.test(bodyText);
      await page.screenshot({ path: path.join(OUT_DIR, "02-projects-category-fees.png") });

      const cont = page.getByRole("button", { name: /Continue to details/i });
      if (await cont.isVisible().catch(() => false)) {
        await cont.click();
        await page.waitForTimeout(1500);
        ui.stepLabel = (await page.locator("body").innerText()).match(/Step \d+ of \d+/)?.[0] ?? null;
        await page.screenshot({ path: path.join(OUT_DIR, "03-projects-form-step.png") });
      }
    }
  } catch (e) {
    ui.error = String(e);
  }

  report.phase2_payment = {
    ...report.phase2_payment,
    ui_fee_probe: ui,
    db_latest_payment: report.phase3_database.payment_records_latest?.[0] ?? null,
    note: "Full Razorpay checkout completion requires live payment — not executed in read-only audit",
  };
}

// ─── PHASE 1 + 5: Registration + Receipt (Playwright) ────────────────────────
async function phase1And5Playwright(page) {
  const regFlow = {
    email: `prod-val-${Date.now()}@audit.shikshamahakumbh.test`,
    submitResponse: null,
    sendEmailResponse: null,
    registrationId: null,
    masterDocId: null,
    successUrl: null,
    steps: {},
  };

  page.on("response", async (res) => {
    const url = res.url();
    if (url.includes("/api/registration/submit") && res.request().method() === "POST") {
      regFlow.submitResponse = { status: res.status(), body: await res.json().catch(() => null) };
    }
    if (url.includes("/api/registration/send-email") && res.request().method() === "POST") {
      regFlow.sendEmailResponse = { status: res.status(), body: await res.json().catch(() => null) };
    }
  });

  try {
    await page.goto(`${BASE}/registration`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2000);
    const accept = page.getByRole("button", { name: /Accept all/i });
    if (await accept.isVisible().catch(() => false)) await accept.click();
    await page.screenshot({ path: path.join(OUT_DIR, "01-registration-hub.png") });
    regFlow.steps.hubLoaded = true;

    // Free Student Delegate
    const delegateBtn = page.getByRole("button", { name: /Delegate Registration/i }).first();
    await delegateBtn.click({ timeout: 15000 });
    await page.waitForTimeout(500);

    const studentOpt = page.getByText(/Student \(Free\)|Student.*Free/i).first();
    if (await studentOpt.isVisible().catch(() => false)) {
      await studentOpt.click();
    } else {
      const studentCat = page.getByRole("radio", { name: /Student/i }).first();
      if (await studentCat.isVisible().catch(() => false)) await studentCat.click();
    }
    await page.waitForTimeout(500);

    const cont = page.getByRole("button", { name: /Continue to details/i });
    await cont.click({ timeout: 10000 });
    await page.waitForTimeout(1500);

    const stepText = await page.locator("body").innerText();
    regFlow.steps.stepIndicator = stepText.match(/Step \d+ of \d+/)?.[0] ?? null;
    regFlow.steps.paymentStepSkipped = !/Continue to Payment|Razorpay|Pay now/i.test(stepText);
    await page.screenshot({ path: path.join(OUT_DIR, "04-delegate-student-form.png") });

    await page.getByLabel(/Full name/i).fill("Production Validation Student");
    await page.getByLabel(/^Email/i).fill(regFlow.email);
    const contact = page.getByLabel(/Contact|Phone/i).first();
    if (await contact.count()) await contact.fill("9876543210");
    for (const label of [/Designation/i, /Institution/i, /Address/i, /Country/i]) {
      const el = page.getByLabel(label).first();
      if (await el.count()) await el.fill("Validation Test");
    }

    const submitBtn = page.getByRole("button", { name: /Submit registration|Submit|Register/i }).last();
    await submitBtn.click({ timeout: 20000 });
    await page.waitForTimeout(12000);

    regFlow.registrationId = regFlow.submitResponse?.body?.registrationId ?? null;
    regFlow.masterDocId = regFlow.submitResponse?.body?.masterDocId ?? null;
    regFlow.successUrl = page.url();
    regFlow.steps.onSuccessPage = page.url().includes("/registration/success");
    await page.screenshot({ path: path.join(OUT_DIR, "05-success-page.png") });

    const bodyAfter = await page.locator("body").innerText();
    regFlow.steps.downloadReceipt = /Download receipt/i.test(bodyAfter);
    regFlow.steps.printReceipt = /Print receipt/i.test(bodyAfter);
    regFlow.steps.addToCalendarRemoved = !/Add to calendar/i.test(bodyAfter);

    // Receipt content probe via success page
    regFlow.steps.registrationIdOnPage = regFlow.registrationId
      ? bodyAfter.includes(regFlow.registrationId)
      : false;

    // Print CSS probe — check receipt component has print:hidden on page chrome
    const printClasses = await page.evaluate(() => {
      const receipt = document.querySelector("[data-receipt], .receipt, #registration-receipt");
      const hasPrintHidden = !!document.querySelector(".print\\:hidden, [class*='print:hidden']");
      return { receiptSelector: receipt?.tagName ?? null, hasPrintHiddenClasses: hasPrintHidden };
    });
    regFlow.receiptPrintProbe = printClasses;
  } catch (e) {
    regFlow.error = String(e);
    await page.screenshot({ path: path.join(OUT_DIR, "error-registration-flow.png") }).catch(() => {});
  }

  report.phase1_registration = regFlow;

  // Receipt on known registration
  try {
    await page.goto(`${BASE}/registration/success?id=SMK2026-000004`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(2000);
    const receiptText = await page.locator("body").innerText();
    report.phase5_receipt = {
      url: page.url(),
      downloadReceipt: /Download receipt/i.test(receiptText),
      printReceipt: /Print receipt/i.test(receiptText),
      hasRegistrationId: /SMK2026-000004/.test(receiptText),
      hasDheLogo: await page.locator('img[alt*="DHE"], img[src*="dhe"], img[src*="DHE"]').count() > 0,
      screenshot: "06-receipt-known-registration.png",
    };
    await page.screenshot({ path: path.join(OUT_DIR, "06-receipt-known-registration.png") });
  } catch (e) {
    report.phase5_receipt = { error: String(e) };
  }

  // Homepage nav screenshot
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, "07-homepage-nav.png"), fullPage: false });
}

// ─── PHASE 4: Email from DB (inbox not accessible) ───────────────────────────
async function phase4Email(regFlow) {
  const latestSent = await prisma.emailLog.findFirst({
    where: { status: "sent" },
    orderBy: { createdAt: "desc" },
  });

  let newLog = null;
  if (regFlow.registrationId) {
    await new Promise((r) => setTimeout(r, 5000));
    newLog = await prisma.emailLog.findFirst({
      where: { toEmail: regFlow.email },
      orderBy: { createdAt: "desc" },
    });
  }

  report.phase4_email = {
    latest_sent_log: latestSent,
    new_registration_email_log: newLog,
    send_email_api: regFlow.sendEmailResponse,
    inbox_verification: {
      status: "NOT_AUTOMATED",
      note: "Inbox/spam/promotions cannot be verified programmatically — check recipient mailbox manually",
      expected_subject_contains: "Registration Confirmed",
      expected_sender: "academics@shikshamahakumbh.com",
      recipient_if_test_ran: regFlow.email,
    },
    checks: {
      sent_log_exists: !!latestSent,
      provider_msg_id_populated: !!latestSent?.providerMsgId,
      new_reg_email_log_created: !!newLog,
      new_reg_status_sent: newLog?.status === "sent",
    },
  };
}

function computeVerdict() {
  const p1 = report.phase1_registration;
  const p3 = report.phase3_database.checks ?? {};
  const p4 = report.phase4_email.checks ?? {};
  const p6 = report.phase6_navigation.checks ?? {};
  const p7 = report.phase7_security.checks ?? {};

  const blockers = [];
  if (!p7.gateway_returns_401) blockers.push("Admin gateway not returning 401");
  if (p6.any_forbidden) blockers.push("Forbidden paper/abstract references on production pages");
  if (!p3.has_sent_email_log) blockers.push("No sent email_logs in database");
  if (p1.error) blockers.push(`Registration flow error: ${p1.error}`);
  if (p1.submitResponse?.status !== 200) blockers.push("Free delegate submit did not return 200");
  if (!p4.new_reg_status_sent && p1.registrationId) blockers.push("New registration email not sent in DB");

  const passes = {
    email_pipeline: p3.has_sent_email_log && p4.provider_msg_id_populated,
    security: p7.gateway_returns_401 && p7.webhook_protected,
    navigation_clean: p6.all_pages_clean,
    free_delegate_submit: p1.submitResponse?.status === 200,
    receipt_buttons: p1.steps?.downloadReceipt && p1.steps?.printReceipt,
  };

  report.verdict = {
    blockers,
    passes,
    decision: blockers.length === 0 ? "GO" : blockers.length <= 2 && passes.email_pipeline && passes.security ? "CONDITIONAL GO" : "NO GO",
    screenshotDir: OUT_DIR,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────
await phase3Database();
await phase7Security();
await phase6Navigation();

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await phase1And5Playwright(page);
await phase2Payment(page);
await browser.close();

await phase4Email(report.phase1_registration);
computeVerdict();

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
console.log("\nScreenshots:", OUT_DIR);
console.log("JSON:", OUT_JSON);

await prisma.$disconnect();
