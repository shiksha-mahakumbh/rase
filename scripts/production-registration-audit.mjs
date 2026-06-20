#!/usr/bin/env node
/**
 * Production Registration Verification Audit (Supabase backend).
 *
 * Usage: node scripts/production-registration-audit.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = (process.argv[2] || "https://www.shikshamahakumbh.com").replace(/\/$/, "");
const OUT = path.join(ROOT, "docs", "production-registration-audit.json");

const HUB_CATEGORIES = [
  "Delegate Registration",
  "Accommodation",
  "Projects",
  "Conclave",
  "Awards",
  "Olympiad",
  "Best Practices",
  "Exhibition",
  "Bal Shodh Patrika",
  "Cultural Program",
];

const LEGACY_ROUTES = [
  { name: "Volunteer", path: "/registration/volunteer" },
  { name: "NGO", path: "/registration/ngo" },
  { name: "Talent", path: "/registration/talent" },
  { name: "AllData", path: "/AllData" },
  { name: "DelegateData", path: "/participantregistrationdatadekh" },
  { name: "VolunteerData", path: "/volunteerdatadekh" },
  { name: "NGOData", path: "/ngoregistrationdatadekh" },
  { name: "ConclaveData", path: "/Conclavedata" },
];

const report = {
  baseUrl: BASE,
  backend: "supabase",
  checkedAt: new Date().toISOString(),
  phases: {},
};

function errMsg(e) {
  if (!e) return "unknown";
  return e.code || e.message || String(e);
}

async function fetchJson(urlPath, opts = {}) {
  const url = urlPath.startsWith("http") ? urlPath : `${BASE}${urlPath}`;
  const res = await fetch(url, { redirect: "follow", ...opts });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _raw: text.slice(0, 300) };
  }
  return { res, json, text, url };
}

async function fetchText(urlPath, opts = {}) {
  const { res, text, url } = await fetchJson(urlPath, opts);
  return { res, text, url };
}

async function phase1Health() {
  const basic = await fetchJson("/api/health");
  const v2 = await fetchJson("/api/v2/health");

  const database =
    v2.json?.supabase?.database ?? v2.json?.database ?? "unknown";

  return {
    basic: {
      status: basic.res.ok ? "PASS" : "FAIL",
      http: basic.res.status,
      body: basic.json,
    },
    v2: {
      status: v2.res.ok && v2.json?.backend === "supabase" ? "PASS" : "FAIL",
      http: v2.res.status,
      backend: v2.json?.backend ?? null,
      database,
      body: v2.json,
    },
    overall:
      basic.res.ok && v2.res.ok && database === "connected" ? "PASS" : "PARTIAL",
  };
}

async function phase2Storage() {
  const noFile = await fetchJson("/api/registration/upload", {
    method: "POST",
    body: new FormData(),
  });

  const form = new FormData();
  const pdf = new Blob(["%PDF-1.4 prod-audit\n"], { type: "application/pdf" });
  form.append("file", pdf, "prod-audit.pdf");
  form.append("registrationType", "Best Practices");
  form.append("field", "supportingPdf");
  const pdfUpload = await fetchJson("/api/registration/upload", {
    method: "POST",
    body: form,
  });

  const pngForm = new FormData();
  const png = new Blob([Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="), (c) => c.charCodeAt(0))], {
    type: "image/png",
  });
  pngForm.append("file", png, "receipt.png");
  pngForm.append("registrationType", "Delegate Registration");
  pngForm.append("field", "receipt");
  const pngUpload = await fetchJson("/api/registration/upload", {
    method: "POST",
    body: pngForm,
  });

  const uploads = [
    {
      label: "reject-empty",
      status: !noFile.res.ok ? "PASS" : "FAIL",
      http: noFile.res.status,
      body: noFile.json,
    },
    {
      label: "pdf-upload",
      status: pdfUpload.res.ok && pdfUpload.json?.url ? "PASS" : "FAIL",
      http: pdfUpload.res.status,
      url: pdfUpload.json?.url ?? null,
    },
    {
      label: "png-upload",
      status: pngUpload.res.ok && pngUpload.json?.url ? "PASS" : "FAIL",
      http: pngUpload.res.status,
      url: pngUpload.json?.url ?? null,
    },
  ];

  return {
    uploads,
    overall: uploads.every((u) => u.status === "PASS")
      ? "PASS"
      : uploads.some((u) => u.status === "PASS")
        ? "PARTIAL"
        : "FAIL",
  };
}

async function phase3And4Pages() {
  const matrix = [];
  const legacy = [];

  const { text: regHtml } = await fetchText("/registration");
  const hasRecaptcha = /recaptcha|grecaptcha|NEXT_PUBLIC_RECAPTCHA/i.test(regHtml);

  for (const cat of HUB_CATEGORIES) {
    const renders =
      regHtml.includes(cat) ||
      new RegExp(cat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(regHtml);
    matrix.push({
      category: cat,
      frontend: renders ? "PASS" : "UNKNOWN",
      note: renders
        ? "Category label found on /registration HTML"
        : "Client-rendered; label may load via JS",
    });
  }

  const api = {};

  try {
    const cap = await fetchJson("/api/registration/verify-captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "probe", action: "registration" }),
    });
    api.captcha = {
      status:
        cap.res.ok ||
        cap.json?.error === "Missing captcha token" ||
        String(cap.json?.error ?? "").includes("token")
          ? "PASS"
          : "FAIL",
      http: cap.res.status,
      body: cap.json,
    };
  } catch (e) {
    api.captcha = { status: "FAIL", error: errMsg(e) };
  }

  try {
    const order = await fetchJson("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 10000, currency: "INR", receipt: "prod_audit" }),
    });
    api.createOrder = {
      status: order.res.ok && order.json?.order_id ? "PASS" : "FAIL",
      http: order.res.status,
      hasOrderId: Boolean(order.json?.order_id),
    };
  } catch (e) {
    api.createOrder = { status: "FAIL", error: errMsg(e) };
  }

  try {
    const email = await fetchJson("/api/registration/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId: "SMK2026-000001",
        fullName: "Prod Audit",
        email: "prod-audit-probe@rase.co.in.invalid",
      }),
    });
    api.sendEmail = {
      status: email.res.ok ? "PASS" : "FAIL",
      http: email.res.status,
      emailStatus: email.json?.emailStatus ?? email.json?.error,
    };
  } catch (e) {
    api.sendEmail = { status: "FAIL", error: errMsg(e) };
  }

  for (const route of LEGACY_ROUTES) {
    const { res, text, url } = await fetchText(route.path);
    const finalUrl = res.url || url;
    const redirected = finalUrl !== url && !finalUrl.endsWith(route.path);
    legacy.push({
      name: route.name,
      path: route.path,
      http: res.status,
      finalUrl,
      classification: classifyLegacy(route, res, text, redirected, finalUrl),
      redirected,
      hasLegacyForm: /Registration Form|Accommodation|Volunteer|NGO|Talent/i.test(text),
    });
  }

  return {
    matrix,
    legacy,
    hasRecaptcha,
    api,
    registrationPageStatus: regHtml.length > 1000 ? "PASS" : "FAIL",
  };
}

function classifyLegacy(route, res, text, redirected, finalUrl) {
  if (!res.ok && !redirected) return "BROKEN";
  if (redirected && /\/admin\/?$/.test(finalUrl)) return "REDIRECTED";
  if (redirected && /\/registration\/?$/.test(finalUrl)) return "REDIRECTED";
  if (redirected) return "LEGACY";
  return "ACTIVE";
}

async function phase5Security() {
  const submit = await fetchJson("/api/registration/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      registrationType: "Conclave",
      data: {
        fullName: "Security Probe",
        email: "security-probe@rase.co.in",
        gender: "Male",
        designation: "Tester",
        institution: "QA",
        address: "Test",
        country: "India",
        contactNumber: "9999999999",
        vidyaBharti: "Non Vidya Bharti",
        accommodationRequired: "No",
        conclaveSelection: "Research Conclave",
        participationType: "Observer",
      },
    }),
  });

  const badSig = await fetchJson("/api/payments/razorpay-webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": "invalid",
    },
    body: JSON.stringify({ event: "payment.captured" }),
  });

  const noSig = await fetchJson("/api/payments/razorpay-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "payment.captured" }),
  });

  const lookup = await fetchJson("/api/registration/SMK2026-000001");

  return {
    submitWithoutCaptcha: {
      status: !submit.res.ok ? "PASS" : "FAIL",
      http: submit.res.status,
      body: submit.json,
    },
    webhookInvalidSignature: {
      status: badSig.res.status === 401 || badSig.res.status === 400 ? "PASS" : "FAIL",
      http: badSig.res.status,
    },
    webhookMissingSignature: {
      status: noSig.res.status === 401 || noSig.res.status === 400 ? "PASS" : "FAIL",
      http: noSig.res.status,
    },
    publicLookupWithoutAuth: {
      status: lookup.res.status === 401 || lookup.res.status === 400 ? "PASS" : "FAIL",
      http: lookup.res.status,
    },
    overall:
      !submit.res.ok &&
      (badSig.res.status === 401 || badSig.res.status === 400) &&
      (lookup.res.status === 401 || lookup.res.status === 400)
        ? "PASS"
        : "PARTIAL",
  };
}

async function phasePlaywright() {
  let chromium;
  try {
    const pw = await import("playwright");
    chromium = pw.chromium;
  } catch (e) {
    return { status: "SKIPPED", error: "playwright not available: " + errMsg(e) };
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const ui = { categories: [], captchaScript: null };

  try {
    await page.goto(`${BASE}/registration`, { waitUntil: "networkidle", timeout: 60000 });

    ui.captchaScript = await page.evaluate(() => {
      const scripts = [...document.querySelectorAll("script[src]")].map((s) => s.src);
      return scripts.some((s) => s.includes("recaptcha") || s.includes("google.com/recaptcha"));
    });

    for (const cat of HUB_CATEGORIES) {
      const entry = {
        category: cat,
        renders: false,
        canSelect: false,
        validationBlocked: null,
        hasSubmit: false,
      };
      try {
        const btn = page
          .getByRole("button", { name: new RegExp(cat.replace(/[()]/g, "\\$&"), "i") })
          .first();
        if (await btn.count()) {
          entry.renders = true;
          await btn.click();
          await page.waitForTimeout(500);
          const continueBtn = page.getByRole("button", { name: /Continue to details/i });
          if (await continueBtn.count()) {
            entry.canSelect = true;
            await continueBtn.click();
            await page.waitForTimeout(1500);
            const submit = page.getByRole("button", { name: /Submit Registration/i });
            entry.hasSubmit = (await submit.count()) > 0;
            if (cat === "Conclave" && entry.hasSubmit) {
              await submit.click();
              await page.waitForTimeout(1000);
              const errors = await page.locator('[role="alert"], .text-red-600').allTextContents();
              entry.validationBlocked = errors.length > 0 ? "PASS" : "FAIL";
              entry.validationErrors = errors.slice(0, 5);
            }
          }
        }
        await page.goto(`${BASE}/registration`, { waitUntil: "networkidle", timeout: 60000 });
      } catch (e) {
        entry.error = errMsg(e);
      }
      ui.categories.push(entry);
    }
  } finally {
    await browser.close();
  }

  ui.status = ui.categories.filter((c) => c.renders).length >= 8 ? "PASS" : "PARTIAL";
  return ui;
}

function computeScore(phases) {
  let score = 0;
  if (phases.health?.overall === "PASS") score += 20;
  else if (phases.health?.overall === "PARTIAL") score += 10;
  if (phases.storage?.overall === "PASS") score += 15;
  else if (phases.storage?.overall === "PARTIAL") score += 8;
  if (phases.pages?.registrationPageStatus === "PASS") score += 5;
  if (phases.playwright?.status === "PASS") score += 15;
  else if (phases.playwright?.status === "PARTIAL") score += 8;
  if (phases.pages?.api?.captcha?.status === "PASS") score += 5;
  if (phases.pages?.api?.createOrder?.status === "PASS") score += 10;
  if (phases.security?.overall === "PASS") score += 15;
  else if (phases.security?.overall === "PARTIAL") score += 8;
  if (phases.pages?.api?.sendEmail?.status === "PASS") score += 5;
  if (phases.email?.smtpWorking) score += 5;
  if (phases.admin?.pageReachable === "PASS") score += 5;
  return Math.min(100, score);
}

async function main() {
  console.log(`Production Registration Audit (Supabase): ${BASE}\n`);

  console.log("Phase 1: Health...");
  report.phases.health = await phase1Health();

  console.log("Phase 2: Storage...");
  report.phases.storage = await phase2Storage();

  console.log("Phase 3/4: Pages & legacy...");
  report.phases.pages = await phase3And4Pages();

  console.log("Phase 5: Security...");
  report.phases.security = await phase5Security();

  console.log("Phase 6: Playwright...");
  report.phases.playwright = await phasePlaywright();

  report.phases.email = {
    apiReachable: report.phases.pages.api?.sendEmail?.status === "PASS",
    smtpWorking: report.phases.pages.api?.sendEmail?.emailStatus === "sent",
    emailStatus: report.phases.pages.api?.sendEmail?.emailStatus,
  };

  report.phases.admin = {
    pageReachable: "FAIL",
    note: "Admin UI requires Supabase email/password session",
  };

  try {
    const { res } = await fetchText("/admin");
    report.phases.admin.pageReachable = res.ok ? "PASS" : "FAIL";
  } catch {
    report.phases.admin.pageReachable = "FAIL";
  }

  report.score = computeScore(report.phases);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(`\nWrote ${OUT}`);
  console.log(`Production Registration Score: ${report.score}/100`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
