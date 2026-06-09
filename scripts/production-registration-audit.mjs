#!/usr/bin/env node
/**
 * Production Registration Verification Audit
 * Usage: node scripts/production-registration-audit.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  runTransaction,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  limit,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = (process.argv[2] || "https://www.rase.co.in").replace(/\/$/, "");
const OUT = path.join(ROOT, "docs", "production-registration-audit.json");

const firebaseConfig = {
  apiKey: "AIzaSyDL6UJwLh8KaNHARuedHNTjWIcFixkfv5s",
  authDomain: "shiksha-mahakumbh-abhiyan.firebaseapp.com",
  projectId: "shiksha-mahakumbh-abhiyan",
  storageBucket: "shiksha-mahakumbh-abhiyan.firebasestorage.app",
  messagingSenderId: "316847987997",
  appId: "1:316847987997:web:90e1d6b1971bbe1091d5f4",
};

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
  { name: "Accommodation2025", path: "/registration/Accomodation" },
  { name: "TalentData", path: "/Talentdata" },
  { name: "NGOData", path: "/ngoregistrationdatadekh" },
  { name: "VolunteerData", path: "/volunteerdatadekh" },
];

const report = {
  baseUrl: BASE,
  checkedAt: new Date().toISOString(),
  phases: {},
};

function errMsg(e) {
  if (!e) return "unknown";
  return e.code || e.message || String(e);
}

async function fetchText(urlPath, opts = {}) {
  const res = await fetch(`${BASE}${urlPath}`, { redirect: "follow", ...opts });
  const text = await res.text();
  return { res, text, url: `${BASE}${urlPath}` };
}

// ─── PHASE 1: Firestore reality check ───────────────────────────────────────
async function phase1Firestore() {
  const app = initializeApp(firebaseConfig, "prod-audit-firestore");
  const db = getFirestore(app);
  const results = {
    counterRead: null,
    counterWrite: null,
    masterCreate: null,
    categoryCreate: null,
    auditLogCreate: null,
    masterRead: null,
    recentRegistrationsSample: null,
    rulesVsRepo: "unknown",
  };

  // Counter read
  try {
    const snap = await getDoc(doc(db, "registrationCounters", "smk2026"));
    results.counterRead = {
      status: snap.exists() ? "PASS" : "FAIL",
      exists: snap.exists(),
      lastNumber: snap.exists() ? snap.data()?.lastNumber : null,
      error: null,
    };
  } catch (e) {
    results.counterRead = { status: "FAIL", exists: false, error: errMsg(e) };
  }

  // Counter write (transaction increment) — rollback not possible; report only
  try {
    const counterRef = doc(db, "registrationCounters", "smk2026");
    const next = await runTransaction(db, async (tx) => {
      const s = await tx.get(counterRef);
      const cur = s.exists() ? (s.data().lastNumber ?? 0) : 0;
      const updated = cur + 1;
      tx.set(counterRef, { lastNumber: updated, updatedAt: serverTimestamp() }, { merge: true });
      return updated;
    });
    results.counterWrite = { status: "PASS", nextNumber: next, error: null };
  } catch (e) {
    results.counterWrite = { status: "FAIL", error: errMsg(e) };
  }

  const testPayload = {
    registrationId: "SMK2026-999998",
    registrationType: "Exhibition",
    fullName: "PROD_AUDIT_PROBE",
    email: "prod-audit-probe@rase.co.in.invalid",
    paymentStatus: "Submitted",
    registrationStatus: "Submitted",
    accommodationStatus: "Not Required",
    _prodAuditProbe: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Master create
  try {
    const ref = await addDoc(collection(db, "registrations"), testPayload);
    results.masterCreate = { status: "PASS", docId: ref.id, error: null };
  } catch (e) {
    results.masterCreate = { status: "FAIL", error: errMsg(e) };
  }

  // Category create
  try {
    const ref = await addDoc(collection(db, "delegate_registrations"), {
      ...testPayload,
      registrationType: "Delegate Registration",
    });
    results.categoryCreate = { status: "PASS", docId: ref.id, collection: "delegate_registrations", error: null };
  } catch (e) {
    results.categoryCreate = { status: "FAIL", collection: "delegate_registrations", error: errMsg(e) };
  }

  // Audit log create
  try {
    const ref = await addDoc(collection(db, "audit_logs"), {
      action: "prod_audit_probe",
      registrationId: "SMK2026-999998",
      createdAt: serverTimestamp(),
      _prodAuditProbe: true,
    });
    results.auditLogCreate = { status: "PASS", docId: ref.id, error: null };
  } catch (e) {
    results.auditLogCreate = { status: "FAIL", error: errMsg(e) };
  }

  // Unauthenticated read attempt
  try {
    const snap = await getDocs(query(collection(db, "registrations"), orderBy("createdAt", "desc"), limit(3)));
    results.masterRead = {
      status: "PASS",
      count: snap.size,
      samples: snap.docs.map((d) => ({
        id: d.id,
        registrationId: d.data().registrationId,
        type: d.data().registrationType,
        paymentStatus: d.data().paymentStatus,
        hasRazorpayOrderId: Boolean(d.data()?.payment?.razorpayOrderId ?? d.data().razorpayOrderId),
        hasUtr: Boolean(d.data()?.payment?.utrNumber ?? d.data().utrNumber),
      })),
      error: null,
    };
  } catch (e) {
    results.masterRead = { status: "FAIL", error: errMsg(e) };
  }

  const repoRulesPath = path.join(ROOT, "firebase", "firestore.rules");
  const repoRules = fs.existsSync(repoRulesPath) ? fs.readFileSync(repoRulesPath, "utf8") : "";

  const counterBlockedInRepo = /registrationCounters[\s\S]*allow write: if false/.test(repoRules);
  const categoryBlockedInRepo = /match \/\\{collection\\}\/\\{docId\\}/.test(repoRules);

  if (results.counterWrite.status === "PASS" && counterBlockedInRepo) {
    results.rulesVsRepo = "PRODUCTION_RULES_DIFFER_FROM_REPO";
  } else if (results.counterWrite.status === "FAIL" && counterBlockedInRepo) {
    results.rulesVsRepo = "MATCHES_REPO_BLOCKED";
  } else if (results.counterWrite.status === "PASS") {
    results.rulesVsRepo = "PRODUCTION_ALLOWS_WRITES";
  }

  results.overall =
    results.masterCreate.status === "PASS" &&
    results.categoryCreate.status === "PASS" &&
    results.counterWrite.status === "PASS"
      ? "PASS"
      : results.masterCreate.status === "PASS"
        ? "PARTIAL"
        : "FAIL";

  return results;
}

// ─── PHASE 2: Storage verification ──────────────────────────────────────────
async function phase2Storage() {
  const app = initializeApp(firebaseConfig, "prod-audit-storage");
  const storage = getStorage(app);
  const auth = getAuth(app);
  const results = { anonymousAuth: null, uploads: [] };

  try {
    const cred = await signInAnonymously(auth);
    results.anonymousAuth = { status: "PASS", uid: cred.user.uid };
  } catch (e) {
    results.anonymousAuth = { status: "FAIL", error: errMsg(e) };
  }

  const samples = [
    { label: "payment-receipt-png", folder: "registrations/Delegate Registration/receipt", contentType: "image/png", bytes: pngBytes() },
    { label: "pdf-upload", folder: "registrations/Best Practices/supportingPdf", contentType: "application/pdf", bytes: minimalPdfBytes() },
    { label: "csv-upload", folder: "registrations/Olympiad/studentList", contentType: "text/csv", bytes: new TextEncoder().encode("name,class\nAudit,10\n") },
    { label: "xlsx-upload", folder: "registrations/Olympiad/studentList", contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", bytes: minimalXlsxBytes() },
  ];

  for (const s of samples) {
    const storagePath = `${s.folder}/prod_audit_${Date.now()}_${s.label}`;
    const entry = { label: s.label, path: storagePath, status: "FAIL", url: null, error: null };
    try {
      const r = ref(storage, storagePath);
      await uploadBytes(r, s.bytes, { contentType: s.contentType });
      const url = await getDownloadURL(r);
      entry.status = "PASS";
      entry.url = url;
      try {
        await deleteObject(r);
        entry.cleaned = true;
      } catch {
        entry.cleaned = false;
      }
    } catch (e) {
      entry.error = errMsg(e);
    }
    results.uploads.push(entry);
  }

  results.overall = results.uploads.every((u) => u.status === "PASS") ? "PASS" : results.uploads.some((u) => u.status === "PASS") ? "PARTIAL" : "FAIL";
  return results;
}

function pngBytes() {
  // 1x1 PNG
  const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function minimalPdfBytes() {
  const pdf = "%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0>>endobj\nxref\n0 3\ntrailer<</Root 1 0 R>>\n%%EOF";
  return new TextEncoder().encode(pdf);
}

function minimalXlsxBytes() {
  // Not a valid xlsx — tests MIME enforcement
  return new TextEncoder().encode("PK\x03\x04fake-xlsx-probe");
}

// ─── PHASE 3 & 4: Pages + legacy routes ─────────────────────────────────────
async function phase3And4Pages() {
  const matrix = [];
  const legacy = [];

  const { text: regHtml } = await fetchText("/registration");
  const hasRecaptcha = /recaptcha|grecaptcha|NEXT_PUBLIC_RECAPTCHA/i.test(regHtml);

  for (const cat of HUB_CATEGORIES) {
    const slug = cat.toLowerCase().replace(/\s+/g, " ");
    const renders = regHtml.includes(cat) || new RegExp(cat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(regHtml);
    matrix.push({
      category: cat,
      frontend: renders ? "PASS" : "UNKNOWN",
      note: renders ? "Category label found on /registration HTML" : "Client-rendered; label may load via JS",
    });
  }

  // API probes
  const api = {};
  try {
    const cap = await fetch(`${BASE}/api/registration/verify-captcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "probe", action: "registration" }),
    });
    const capBody = await cap.json();
    api.captcha = {
      status: cap.ok || capBody.error === "Missing captcha token" || capBody.error?.includes("token") ? "PASS" : "FAIL",
      http: cap.status,
      body: capBody,
    };
  } catch (e) {
    api.captcha = { status: "FAIL", error: errMsg(e) };
  }

  try {
    const order = await fetch(`${BASE}/api/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 10000, currency: "INR", receipt: "prod_audit" }),
    });
    const orderBody = await order.json();
    api.createOrder = {
      status: order.ok && orderBody.order_id ? "PASS" : "FAIL",
      http: order.status,
      hasOrderId: Boolean(orderBody.order_id),
    };
  } catch (e) {
    api.createOrder = { status: "FAIL", error: errMsg(e) };
  }

  try {
    const email = await fetch(`${BASE}/api/registration/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId: "SMK2026-000001",
        fullName: "Prod Audit",
        email: "prod-audit-probe@rase.co.in.invalid",
      }),
    });
    const emailBody = await email.json();
    api.sendEmail = {
      status: email.ok ? "PASS" : "FAIL",
      http: email.status,
      emailStatus: emailBody.emailStatus ?? emailBody.error,
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

  return { matrix, legacy, hasRecaptcha, api, registrationPageStatus: regHtml.length > 1000 ? "PASS" : "FAIL" };
}

function classifyLegacy(route, res, text, redirected, finalUrl) {
  if (!res.ok) return "BROKEN";
  if (route.path.includes("datadekh") || route.path === "/Talentdata") {
    if (res.status === 200 && text.length > 200) return "ACTIVE";
    return "BROKEN";
  }
  if (route.path === "/registration/Accomodation" && !redirected && /Accommodation|accommodation/i.test(text)) {
    return "ACTIVE";
  }
  if (redirected && /\/registration\/?$/.test(finalUrl)) return "LEGACY";
  if (redirected) return "LEGACY";
  return "ACTIVE";
}

// ─── PHASE 5: Payment data integrity (from readable samples) ────────────────
function phase5PaymentIntegrity(masterRead) {
  if (!masterRead?.samples?.length) {
    return { status: "INCONCLUSIVE", reason: "Cannot read registrations without permission", overall: "FAIL" };
  }
  const samples = masterRead.samples;
  const withOrderId = samples.filter((s) => s.hasRazorpayOrderId).length;
  const withUtr = samples.filter((s) => s.hasUtr).length;
  return {
    status: "PASS",
    sampleSize: samples.length,
    withRazorpayOrderId: withOrderId,
    withUtr,
    webhookCorrelatable: withOrderId > 0 ? "PASS" : "FAIL",
    samples,
    overall: withOrderId > 0 ? "PASS" : samples.length > 0 ? "FAIL" : "INCONCLUSIVE",
  };
}

// ─── PHASE 6: Webhook audit logs probe ──────────────────────────────────────
async function phase6WebhookLogs(db) {
  try {
    const snap = await getDocs(
      query(collection(db, "audit_logs"), orderBy("createdAt", "desc"), limit(10))
    );
    const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const webhookLogs = logs.filter((l) => l.action === "razorpay_webhook");
    return {
      status: snap.size > 0 ? "PASS" : "FAIL",
      totalLogs: snap.size,
      webhookLogs: webhookLogs.length,
      recent: logs.slice(0, 5).map((l) => ({
        action: l.action,
        registrationId: l.registrationId,
        paymentStatus: l.paymentStatus,
        razorpayOrderId: l.razorpayOrderId,
      })),
      overall: webhookLogs.length > 0 ? "PASS" : "FAIL",
      note: webhookLogs.length === 0 ? "No razorpay_webhook audit logs visible to unauthenticated client" : null,
    };
  } catch (e) {
    return { status: "FAIL", error: errMsg(e), overall: "FAIL" };
  }
}

// ─── Playwright UI verification ─────────────────────────────────────────────
async function phase3Playwright() {
  let chromium;
  try {
    const pw = await import("playwright");
    chromium = pw.chromium;
  } catch (e) {
    return { status: "SKIPPED", error: "playwright not available: " + errMsg(e) };
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const ui = { categories: [], conclaveValidation: null, captchaScript: null };

  try {
    await page.goto(`${BASE}/registration`, { waitUntil: "networkidle", timeout: 60000 });

    ui.captchaScript = await page.evaluate(() => {
      const scripts = [...document.querySelectorAll("script[src]")].map((s) => s.src);
      return scripts.some((s) => s.includes("recaptcha") || s.includes("google.com/recaptcha"));
    });

    for (const cat of HUB_CATEGORIES) {
      const entry = { category: cat, renders: false, canSelect: false, validationBlocked: null, submitBlocked: null };
      try {
        const btn = page.getByRole("button", { name: new RegExp(cat.replace(/[()]/g, "\\$&"), "i") }).first();
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

// ─── Score ──────────────────────────────────────────────────────────────────
function computeScore(phases) {
  let score = 0;
  if (phases.firestore?.overall === "PASS") score += 20;
  else if (phases.firestore?.overall === "PARTIAL") score += 10;
  if (phases.storage?.overall === "PASS") score += 10;
  else if (phases.storage?.overall === "PARTIAL") score += 5;
  if (phases.pages?.registrationPageStatus === "PASS") score += 5;
  if (phases.playwright?.status === "PASS") score += 15;
  else if (phases.playwright?.status === "PARTIAL") score += 8;
  if (phases.pages?.api?.captcha?.status === "PASS") score += 5;
  if (phases.pages?.api?.createOrder?.status === "PASS") score += 10;
  if (phases.payment?.overall === "PASS") score += 15;
  if (phases.webhook?.overall === "PASS") score += 10;
  if (phases.pages?.api?.sendEmail?.status === "PASS") score += 5;
  if (phases.email?.smtpWorking) score += 5;
  return Math.min(100, score);
}

async function main() {
  console.log(`Production Registration Audit: ${BASE}\n`);

  console.log("Phase 1: Firestore...");
  report.phases.firestore = await phase1Firestore();

  const app2 = initializeApp(firebaseConfig, "prod-audit-logs");
  const db2 = getFirestore(app2);

  console.log("Phase 2: Storage...");
  report.phases.storage = await phase2Storage();

  console.log("Phase 3/4: Pages & legacy...");
  report.phases.pages = await phase3And4Pages();

  console.log("Phase 5: Payment integrity...");
  report.phases.payment = phase5PaymentIntegrity(report.phases.firestore.masterRead);

  console.log("Phase 6: Webhook logs...");
  report.phases.webhook = await phase6WebhookLogs(db2);

  console.log("Phase 3 UI: Playwright...");
  report.phases.playwright = await phase3Playwright();

  report.phases.email = {
    apiReachable: report.phases.pages.api?.sendEmail?.status === "PASS",
    smtpWorking: report.phases.pages.api?.sendEmail?.emailStatus === "sent",
    emailStatus: report.phases.pages.api?.sendEmail?.emailStatus,
    adminNotification: "NOT_PROBED",
    emailDeliveryStatusUpdate: "INCONCLUSIVE",
  };

  report.phases.admin = {
    pageReachable: null,
    canViewAll: report.phases.firestore.masterRead?.status === "PASS" ? "PASS" : "BLOCKED_WITHOUT_ADMIN",
    legacyInAdmin: "FAIL",
    note: "Admin UI requires Google OAuth; data read used unauthenticated Firestore client",
  };

  try {
    const { res } = await fetchText("/admin");
    report.phases.admin.pageReachable = res.ok ? "PASS" : "FAIL";
  } catch {
    report.phases.admin.pageReachable = "FAIL";
  }

  report.phases.dataIntegrity = {
    duplicateCheck: "INCONCLUSIVE",
    orphanPayments: "INCONCLUSIVE",
    note: "Full integrity counts require admin/service-account Firestore access",
  };

  if (report.phases.firestore.masterRead?.samples) {
    const ids = report.phases.firestore.masterRead.samples.map((s) => s.registrationId).filter(Boolean);
    report.phases.dataIntegrity.sampleRegistrationIds = ids;
    report.phases.dataIntegrity.duplicateCheck = new Set(ids).size === ids.length ? "PASS" : "FAIL";
  }

  report.score = computeScore(report.phases);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(`\nWrote ${OUT}`);
  console.log(`Production Registration Score: ${report.score}/100`);
  console.log(JSON.stringify(report.phases, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
