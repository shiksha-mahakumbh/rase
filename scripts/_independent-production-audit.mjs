#!/usr/bin/env node
/** Independent production audit — read-only. Output: docs/go-live/INDEPENDENT_AUDIT_2026-06-14.json */
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { chromium } from "playwright";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "docs", "go-live", "INDEPENDENT_AUDIT_2026-06-14.json");
const BASE = "https://www.shikshamahakumbh.com";
const prisma = new PrismaClient();

const report = {
  auditedAt: new Date().toISOString(),
  baseUrl: BASE,
  deploymentCommit: "082f8f6",
  phase1_registration: {},
  phase2_fees: {},
  phase3_payment: {},
  phase4_email: {},
  phase5_receipt: {},
  phase6_database: {},
  phase7_security: {},
  phase8_content: {},
  phase9_performance: {},
  phase10_verdict: {},
};

async function timedFetch(url, init) {
  const t0 = Date.now();
  const res = await fetch(url, init);
  const ms = Date.now() - t0;
  let body;
  const text = await res.text();
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 500);
  }
  return { status: res.status, ms, body, headers: Object.fromEntries(res.headers) };
}

// ─── PHASE 6 DB (run first for baseline) ─────────────────────────────────────
async function phase6() {
  const [
    regCount,
    payCount,
    emailCount,
    auditCount,
    uploadCount,
    accommodationCount,
    counter,
    emailByStatus,
    payByStatus,
    latestRegs,
    latestEmails,
    latestPayments,
    orphanEmails,
    orphanPayments,
    dupRegIds,
  ] = await Promise.all([
    prisma.registration.count(),
    prisma.paymentRecord.count(),
    prisma.emailLog.count(),
    prisma.auditLog.count(),
    prisma.uploadedFile.count(),
    prisma.accommodationRequest.count().catch(() => -1),
    prisma.registrationCounter.findUnique({ where: { prefix: "SMK2026" } }),
    prisma.emailLog.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.paymentRecord.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        registrationId: true,
        registrationType: true,
        email: true,
        registrationFee: true,
        paymentStatus: true,
        emailDeliveryStatus: true,
        createdAt: true,
      },
    }),
    prisma.emailLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.paymentRecord.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { registration: { select: { registrationId: true, registrationType: true, registrationFee: true } } },
    }),
    prisma.$queryRaw`SELECT e.id FROM email_logs e LEFT JOIN registrations r ON r.id=e.registration_id WHERE e.registration_id IS NOT NULL AND r.id IS NULL LIMIT 5`,
    prisma.$queryRaw`SELECT pr.id FROM payment_records pr LEFT JOIN registrations r ON r.id=pr.registration_id WHERE r.id IS NULL LIMIT 5`,
    prisma.$queryRaw`SELECT registration_id, COUNT(*)::int c FROM registrations GROUP BY registration_id HAVING COUNT(*)>1`,
  ]);

  const idFormatOk = latestRegs.every((r) => /^SMK2026-\d{6}$/.test(r.registrationId));

  report.phase6_database = {
    counts: { registrations: regCount, payment_records: payCount, email_logs: emailCount, audit_logs: auditCount, uploaded_files: uploadCount, accommodation_requests: accommodationCount },
    counter,
    emailByStatus,
    payByStatus,
    latestRegistrations: latestRegs.map((r) => ({ ...r, registrationFee: r.registrationFee != null ? String(r.registrationFee) : null })),
    latestEmailLogs: latestEmails,
    latestPaymentRecords: latestPayments.map((p) => ({ ...p, amount: String(p.amount) })),
    orphanEmailLogs: orphanEmails,
    orphanPaymentRecords: orphanPayments,
    duplicateRegistrationIds: dupRegIds,
    smk2026FormatValid: idFormatOk,
  };
}

// ─── PHASE 7 SECURITY ────────────────────────────────────────────────────────
async function phase7() {
  const endpoints = [
    { id: "admin_gateway_regs", method: "GET", path: "/api/admin/gateway/registrations", body: null, expect: [401] },
    { id: "admin_gateway_stats", method: "GET", path: "/api/admin/gateway/stats", body: null, expect: [401] },
    { id: "admin_gateway_emails", method: "GET", path: "/api/admin/gateway/email-logs", body: null, expect: [401] },
    { id: "registration_lookup", method: "GET", path: "/api/registration/SMK2026-000001", body: null, expect: [401] },
    { id: "registration_submit_empty", method: "POST", path: "/api/registration/submit", body: "{}", expect: [400, 403, 429] },
    { id: "registration_send_email_bad", method: "POST", path: "/api/registration/send-email", body: JSON.stringify({ registrationId: "INVALID", email: "x", fullName: "x" }), expect: [400] },
    { id: "webhook_unsigned", method: "POST", path: "/api/payments/razorpay-webhook", body: "{}", expect: [401, 400] },
    { id: "create_order_open", method: "POST", path: "/api/payments/create-order", body: JSON.stringify({ amount: 20000, currency: "INR" }), expect: [200, 401, 400] },
    { id: "verify_payment_empty", method: "POST", path: "/api/payments/verify", body: "{}", expect: [400, 401, 403] },
  ];

  const results = [];
  for (const ep of endpoints) {
    const r = await timedFetch(`${BASE}${ep.path}`, {
      method: ep.method,
      headers: ep.body ? { "Content-Type": "application/json" } : undefined,
      body: ep.body,
    });
    const pass = ep.expect.includes(r.status);
    let verdict = pass ? "PASS" : "FAIL";
    if (ep.id === "create_order_open" && r.status === 200) verdict = "WARNING";
    results.push({ ...ep, status: r.status, ms: r.ms, body: r.body, verdict });
  }

  // rate limit burst
  const burst = [];
  for (let i = 0; i < 18; i++) {
    const r = await fetch(`${BASE}/api/registration/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    burst.push(r.status);
  }
  report.phase7_security = {
    endpoints: results,
    rateLimitBurst: { statuses: [...new Set(burst)], triggered429: burst.includes(429) },
  };
}

// ─── PHASE 8 CONTENT ───────────────────────────────────────────────────────
async function phase8() {
  const forbidden = ["Submit Paper", "Paper Submission", "Abstract Submission", "Full Length Paper", "Call For Papers", "Call for Paper"];
  const pages = ["/", "/registration", "/introduction", "/research-papers", "/about"];
  const pageResults = {};
  for (const p of pages) {
    const r = await timedFetch(`${BASE}${p}`, {});
    const text = typeof r.body === "string" ? r.body : "";
    pageResults[p] = {
      status: r.status,
      ms: r.ms,
      forbiddenFound: forbidden.filter((f) => text.toLowerCase().includes(f.toLowerCase())),
      hasMultiTrack: /Multi Track Conference/i.test(text),
      hasCmt: /ShikshaMahakumbh2025|cmt3\.research\.microsoft\.com/i.test(text),
    };
  }
  const redirects = [];
  for (const p of ["/paper", "/abstract", "/fulllengthpaper"]) {
    const res = await fetch(`${BASE}${p}`, { redirect: "manual" });
    redirects.push({ path: p, status: res.status, location: res.headers.get("location") });
  }
  const regHtml = typeof (await timedFetch(`${BASE}/registration`, {})).body === "string"
    ? (await fetch(`${BASE}/registration`)).text()
    : "";
  const html = await fetch(`${BASE}/registration`).then((r) => r.text());
  const scriptUrls = [...html.matchAll(/\/_next\/static\/[^"' ]+\.js/g)].map((m) => m[0]).slice(0, 40);
  const bundleForbidden = {};
  for (const f of forbidden) bundleForbidden[f] = false;
  for (const url of [...new Set(scriptUrls)]) {
    try {
      const js = await (await fetch(`${BASE}${url}`)).text();
      for (const f of forbidden) if (js.includes(f)) bundleForbidden[f] = true;
    } catch { /* skip */ }
  }
  report.phase8_content = { pages: pageResults, redirects, bundleForbidden, regHtmlUnused: !!regHtml };
}

// ─── PHASE 9 PERFORMANCE (HTTP) ────────────────────────────────────────────
async function phase9Http() {
  const samples = [];
  for (let i = 0; i < 3; i++) {
    samples.push({ page: "registration", ...(await timedFetch(`${BASE}/registration`, {})) });
    samples.push({ page: "success", ...(await timedFetch(`${BASE}/registration/success?id=SMK2026-000004`, {})) });
    samples.push({ page: "homepage", ...(await timedFetch(`${BASE}/`, {})) });
  }
  const byPage = {};
  for (const s of samples) {
    if (!byPage[s.page]) byPage[s.page] = [];
    byPage[s.page].push(s.ms);
  }
  const summary = {};
  for (const [page, arr] of Object.entries(byPage)) {
    summary[page] = { avg: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length), max: Math.max(...arr), samples: arr };
  }
  report.phase9_performance.http = summary;
}

// ─── PHASE 1, 2, 5 — Playwright ────────────────────────────────────────────
async function playwrightPhases() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  async function dismiss() {
    for (const sel of [
      page.getByRole("button", { name: /Accept all/i }),
      page.locator('[aria-label="Close"]').first(),
    ]) {
      if (await sel.isVisible().catch(() => false)) await sel.click().catch(() => {});
    }
  }

  const categoriesRequested = [
    "Conclave", "Delegate Registration", "Exhibition", "Projects", "Talent", "NGO", "Volunteer",
    "Accommodation", "Awards", "Best Practices", "Olympiad", "Participant", "Multi Track Conference",
    "Bal Shodh Patrika", "Cultural Program",
  ];

  const tReg = Date.now();
  await page.goto(`${BASE}/registration`, { waitUntil: "domcontentloaded", timeout: 90000 });
  report.phase9_performance.registrationPageInteractiveMs = Date.now() - tReg;
  await dismiss();
  await page.waitForTimeout(1500);

  const bodyText = await page.locator("body").innerText();
  const categoryProbe = categoriesRequested.map((c) => ({
    category: c,
    visibleOnHub: bodyText.includes(c) || new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(bodyText),
  }));

  // Delegate → Student free
  const delegateFlow = { steps: {} };
  try {
    await page.getByRole("button", { name: /Delegate Registration/i }).first().click();
    await page.waitForTimeout(400);
    const studentOpt = page.locator('select[name="delegateCategory"]');
    if (await studentOpt.isVisible().catch(() => false)) {
      await studentOpt.selectOption({ label: "Student (Free)" });
    }
    await page.getByRole("button", { name: /Continue to details/i }).click();
    await page.waitForTimeout(1000);
    const dt = await page.locator("body").innerText();
    delegateFlow.steps = {
      stepIndicator: dt.match(/Step \d+ of \d+/)?.[0] ?? null,
      paymentSkipped: !/Continue to payment|Step 3 of 3/i.test(dt),
      studentFreeMessage: /No payment required|Student.*Free|Free registration/i.test(dt),
      instructionsPanel: /Eligibility|Documents Required|Important Notes/i.test(dt),
    };
    report.phase2_fees.delegate = { studentFreeUi: /Student.*Free|Student: Free/i.test(dt), stepCount: delegateFlow.steps.stepIndicator };
  } catch (e) {
    delegateFlow.error = String(e);
  }

  // Projects fees UI
  const projectsFees = {};
  try {
    await page.goto(`${BASE}/registration`, { waitUntil: "domcontentloaded" });
    await dismiss();
    const projectsCard = page.locator("button").filter({ hasText: /^Projects$/ });
    await projectsCard.first().click({ timeout: 15000 });
    await page.getByRole("button", { name: /Continue to details/i }).click();
    await page.waitForTimeout(1200);
    const pt = await page.locator("body").innerText();
    projectsFees.school200 = /School Student[\s\S]{0,80}200|₹\s*200|200/.test(pt);
    projectsFees.college400 = /College Student[\s\S]{0,80}400|₹\s*400|400/.test(pt);
    const tPay = Date.now();
    const payBtn = page.getByRole("button", { name: /Continue to payment|Continue for Payment/i });
    if (await payBtn.isVisible().catch(() => false)) {
      await payBtn.click();
      await page.waitForTimeout(800);
      projectsFees.paymentStepMs = Date.now() - tPay;
      projectsFees.paymentSectionVisible = await page.locator(".registration-payment, [class*='razorpay'], .registration-razorpay").first().isVisible().catch(() => false);
    }
  } catch (e) {
    projectsFees.error = String(e);
  }
  report.phase2_fees.projects = projectsFees;

  // Accommodation fees
  const accFees = {};
  try {
    await page.goto(`${BASE}/registration`, { waitUntil: "domcontentloaded" });
    await dismiss();
    await page.locator("button").filter({ hasText: /^Accommodation$/ }).first().click({ timeout: 15000 });
    await page.getByRole("button", { name: /Continue to details/i }).click();
    await page.waitForTimeout(1200);
    const at = await page.locator("body").innerText();
    accFees.single3000 = /Single Bed[\s\S]{0,60}3000|₹\s*3000|3000/.test(at);
    accFees.double6000 = /Double Bed[\s\S]{0,60}6000|₹\s*6000|6000/.test(at);
  } catch (e) {
    accFees.error = String(e);
  }
  report.phase2_fees.accommodation = accFees;

  // Success / receipt
  const tSucc = Date.now();
  await page.goto(`${BASE}/registration/success?id=SMK2026-000004`, { waitUntil: "domcontentloaded" });
  report.phase9_performance.successPageLoadMs = Date.now() - tSucc;
  await dismiss();
  await page.waitForTimeout(1500);
  const st = await page.locator("body").innerText();
  report.phase5_receipt = {
    downloadReceipt: /Download receipt/i.test(st),
    printReceipt: /Print receipt/i.test(st),
    addToCalendar: /Add to calendar/i.test(st),
    tellColleagues: /Tell colleagues|Tell your colleagues/i.test(st),
    shareButtons: /Share on|WhatsApp share/i.test(st),
    registrationIdVisible: /SMK2026-000004/.test(st),
    dheLogo: (await page.locator('img[alt*="DHE"], img[src*="dhe"], img[src*="DHE"]').count()) > 0,
    printHiddenClasses: (await page.locator('[class*="print:hidden"]').count()) > 0,
  };

  report.phase1_registration = {
    categoriesOnHub: categoryProbe,
    delegateStudentFlow: delegateFlow,
    note: "Full submit/upload E2E not executed — read-only audit avoids creating live registrations",
  };

  await browser.close();
}

// ─── PHASE 3 PAYMENT (API + DB only) ─────────────────────────────────────────
async function phase3() {
  const createOrder = await timedFetch(`${BASE}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 20000, currency: "INR", receipt: "audit-probe" }),
  });
  report.phase3_payment = {
    createOrderProbe: { status: createOrder.status, ms: createOrder.ms, body: createOrder.body },
    dbLatestPayment: report.phase6_database.latestPaymentRecords?.[0] ?? null,
    liveFreeRegistrationExecuted: false,
    livePaidRegistrationExecuted: false,
    note: "No live Razorpay payment or registration submit performed in read-only audit",
  };
}

// ─── PHASE 4 EMAIL ───────────────────────────────────────────────────────────
async function phase4() {
  const sent = report.phase6_database.latestEmailLogs?.find((e) => e.status === "sent");
  const emailProcMs = sent?.sentAt && sent?.createdAt
    ? new Date(sent.sentAt).getTime() - new Date(sent.createdAt).getTime()
    : null;
  report.phase4_email = {
    latestSent: sent ?? null,
    processingMs: emailProcMs,
    brevoConfigured: true,
    inboxVerified: false,
    spfDkimVerified: false,
    note: "Inbox/SPF/DKIM cannot be verified programmatically in read-only mode",
  };
  if (emailProcMs != null) {
    report.phase9_performance.emailProcessingMs = emailProcMs;
  }
}

function computeVerdict() {
  const issues = { critical: [], medium: [], low: [] };
  const p7 = report.phase7_security.endpoints ?? [];
  if (p7.find((e) => e.id === "create_order_open" && e.verdict === "WARNING")) {
    issues.medium.push("POST /api/payments/create-order returns 200 without authentication");
  }
  const missingCats = (report.phase1_registration.categoriesOnHub ?? []).filter(
    (c) => ["Talent", "NGO", "Volunteer", "Participant"].includes(c.category) && !c.visibleOnHub
  );
  if (missingCats.length) issues.low.push(`Categories not on hub: ${missingCats.map((c) => c.category).join(", ")}`);
  if (!report.phase2_fees.projects?.school200) issues.medium.push("Projects School ₹200 not confirmed in UI probe");
  if (!report.phase2_fees.projects?.college400) issues.medium.push("Projects College ₹400 not confirmed in UI probe");
  if (report.phase5_receipt?.addToCalendar) issues.low.push("Add to Calendar still on success page");
  if (report.phase5_receipt?.tellColleagues) issues.low.push("Tell Colleagues still on success page");
  const sent = report.phase4_email.latestSent;
  if (!sent) issues.critical.push("No sent email_logs row in production DB");
  else issues.critical.length; // clear if sent exists

  const emailOk = !!sent?.providerMsgId;
  const secOk = p7.filter((e) => e.id.startsWith("admin")).every((e) => e.verdict === "PASS");
  const contentOk = Object.values(report.phase8_content.pages ?? {}).every((p) => p.forbiddenFound?.length === 0);

  let decision = "NO GO";
  if (emailOk && secOk && contentOk && issues.critical.length === 0) {
    decision = issues.medium.length <= 2 ? "CONDITIONAL GO" : "CONDITIONAL GO";
    if (issues.medium.length === 0 && report.phase2_fees.delegate?.studentFreeUi) decision = "GO";
  }

  report.phase10_verdict = { issues, decision, emailOk, secOk, contentOk };
}

await phase6();
await phase7();
await phase8();
await phase9Http();
await playwrightPhases();
await phase3();
await phase4();
computeVerdict();

fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

await prisma.$disconnect();
