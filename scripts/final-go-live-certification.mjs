#!/usr/bin/env node
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "https://www.shikshamahakumbh.com";
const OUT_DIR = path.join(__dirname, "..", "docs", "go-live", "final-certification-screenshots");
const REPORT_PATH = path.join(__dirname, "..", "docs", "go-live", "final-certification-results.json");

fs.mkdirSync(OUT_DIR, { recursive: true });

const report = {
  checkedAt: new Date().toISOString(),
  baseUrl: BASE,
  security: [],
  redirects: [],
  bundleStrings: {},
  ui: {},
  performance: {},
  blockers: [],
};

function save() {
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
}

async function probeApi(name, method, apiPath, body) {
  const res = await fetch(`${BASE}${apiPath}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text.slice(0, 200);
  }
  report.security.push({ name, path: apiPath, status: res.status, body: parsed });
}

try {
  for (const [pathSuffix] of [["/abstract"], ["/paper"], ["/fulllengthpaper"]]) {
    const res = await fetch(`${BASE}${pathSuffix}`, { redirect: "manual" });
    report.redirects.push({
      path: pathSuffix,
      status: res.status,
      location: res.headers.get("location"),
    });
  }

  await probeApi("lookup_no_auth", "GET", "/api/registration/SMK2026-000001");
  await probeApi("admin_gateway", "GET", "/api/admin/gateway/registrations");
  await probeApi("webhook_unsigned", "POST", "/api/payments/razorpay-webhook", {});

  const createOrder = await fetch(`${BASE}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: 20000, currency: "INR", receipt: "cert-audit" }),
  });
  report.razorpayCreateOrder = {
    status: createOrder.status,
    body: await createOrder.json().catch(() => ({})),
  };

  const regHtml = await (await fetch(`${BASE}/registration`)).text();
  const scriptUrls = [...regHtml.matchAll(/\/_next\/static\/[^"' ]+\.js/g)].map((m) => m[0]);
  const patterns = [
    "School Student",
    "College Student",
    "Single Bed",
    "Double Bed",
    "setCurrentFee",
    "Student (Free)",
    "inputMode",
    "ABCDE1234F",
    "Eligibility",
    "Documents Required",
    "Submit Paper",
    "Abstract Submission",
    "Paper Submission",
    "Call for Papers",
    "ShikshaMahakumbh2025",
    "SMK2026",
  ];
  for (const p of patterns) report.bundleStrings[p] = false;
  for (const url of [...new Set(scriptUrls)]) {
    try {
      const js = await (await fetch(`${BASE}${url}`)).text();
      for (const p of patterns) {
        if (!report.bundleStrings[p] && js.includes(p)) report.bundleStrings[p] = true;
      }
    } catch {
      /* skip */
    }
  }
  save();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  async function dismissOverlays() {
    const accept = page.getByRole("button", { name: /Accept all/i });
    if (await accept.isVisible().catch(() => false)) await accept.click();
    const close = page.locator('[aria-label="Close"]').first();
    if (await close.isVisible().catch(() => false)) await close.click();
  }

  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await dismissOverlays();
  await page.waitForTimeout(1500);
  const homeText = await page.locator("body").innerText();
  report.ui.homepage = {
    hasSubmitPaper: /Submit Paper/i.test(homeText),
    hasMultiTrack: /Multi Track Conference/i.test(homeText),
    hasAbstractSubmission: /Abstract Submission/i.test(homeText),
  };
  await page.screenshot({ path: path.join(OUT_DIR, "01-homepage.png") });
  save();

  await page.goto(`${BASE}/registration`, { waitUntil: "domcontentloaded" });
  await dismissOverlays();
  await page.getByRole("button", { name: /Delegate Registration/i }).click();
  await page.getByRole("button", { name: /Continue to details/i }).click();
  await page.waitForTimeout(1000);

  const delegateCat = page.locator('select[name="delegateCategory"]');
  if (await delegateCat.isVisible().catch(() => false)) {
    await delegateCat.selectOption({ label: "Student (Free)" });
  }
  await page.waitForTimeout(800);

  const bodyAfterStudent = await page.locator("body").innerText();
  report.ui.freeDelegate = {
    paymentStepVisible: /Continue for Payment|Razorpay checkout/i.test(bodyAfterStudent),
    showsFreeFee: /Student.*Free|₹0|Free/i.test(bodyAfterStudent),
    stepCount: (bodyAfterStudent.match(/Step \d of \d/g) ?? []).join(", "),
  };
  await page.screenshot({ path: path.join(OUT_DIR, "02-delegate-student-free.png"), fullPage: true });
  save();

  await page.goto(`${BASE}/registration`, { waitUntil: "domcontentloaded" });
  await dismissOverlays();
  const projectsBtn = page.getByRole("button", { name: "Projects", exact: true });
  await projectsBtn.scrollIntoViewIfNeeded();
  await projectsBtn.click();
  await page.getByRole("button", { name: /Continue to details/i }).click();
  await page.waitForTimeout(1000);

  const projectsBody = await page.locator("body").innerText();
  report.ui.projects = {
    schoolStudentFee: /School Student.*₹?\s*200|₹200/i.test(projectsBody),
    collegeStudentFee: /College Student.*₹?\s*400|₹400/i.test(projectsBody),
  };

  await page.fill('input[name="fullName"]', "Cert Audit User");
  await page.fill('input[name="email"]', "cert-audit@example.com");
  await page.fill('input[name="contactNumber"]', "9876543210");
  await page.fill('input[name="designation"]', "Student");
  await page.fill('input[name="institution"]', "Test School");
  await page.fill('input[name="address"]', "123 Test Street Hamirpur");
  await page.fill('input[name="country"]', "India");
  await page.locator('input[type="radio"][value="Male"]').first().check().catch(() => {});
  await page.locator('input[type="radio"][value="Non Vidya Bharti"]').first().check().catch(() => {});
  await page.fill('input[name="title"]', "Test Project");
  await page.fill('textarea[name="description"]', "Production certification test project description.");
  const pst = page.locator('select[name="projectStudentType"]');
  if (await pst.isVisible().catch(() => false)) await pst.selectOption("School Student");

  const t0 = Date.now();
  const continuePay = page.getByRole("button", { name: /Continue for Payment/i });
  if (await continuePay.isVisible().catch(() => false)) {
    await continuePay.click();
    await page.waitForTimeout(800);
  }
  report.performance.continueToPaymentMs = Date.now() - t0;
  report.ui.projects.paymentSectionVisible = await page
    .locator(".registration-payment, .registration-razorpay, [class*='razorpay']")
    .first()
    .isVisible()
    .catch(() => false);
  await page.screenshot({ path: path.join(OUT_DIR, "03-projects-payment-step.png"), fullPage: true });
  save();

  await page.goto(`${BASE}/registration/success?id=SMK2026-000001`, { waitUntil: "domcontentloaded" });
  await dismissOverlays();
  const tReceipt = Date.now();
  await page.getByRole("button", { name: /Download receipt/i }).waitFor({ timeout: 8000 }).catch(() => {});
  report.performance.receiptReadyMs = Date.now() - tReceipt;
  const successText = await page.locator("body").innerText();
  report.ui.success = {
    downloadReceipt: /Download receipt/i.test(successText),
    printReceipt: /Print receipt/i.test(successText),
    addToCalendar: /Add to calendar/i.test(successText),
    tellColleagues: /Tell colleagues/i.test(successText),
  };
  await page.screenshot({ path: path.join(OUT_DIR, "04-success-receipt-buttons.png") });
  save();

  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await dismissOverlays();
  await page.getByRole("button", { name: /^Research$/i }).first().hover();
  await page.waitForTimeout(800);
  const navText = await page.locator("body").innerText();
  report.ui.researchNav = {
    multiTrack: /Multi Track Conference/i.test(navText),
    abstractSubmission: /Abstract Submission/i.test(navText),
    callForPapers: /Call for Papers/i.test(navText),
  };
  await page.screenshot({ path: path.join(OUT_DIR, "05-research-nav.png") });

  await browser.close();
} catch (err) {
  report.error = err instanceof Error ? err.message : String(err);
  report.blockers.push(report.error);
}

save();
console.log(JSON.stringify(report, null, 2));
