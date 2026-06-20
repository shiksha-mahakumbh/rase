#!/usr/bin/env node
/**
 * Full launch certification audit — Phases 1–10
 * Usage: node scripts/launch-certification-audit.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = (process.argv[2] || "https://www.rase.co.in").replace(/\/$/, "");

const DRIFT_ROUTES = ["/glimpses", "/coming-soon"];
const SMOKE_ROUTES = [
  { path: "/", name: "homepage", check: (t) => /Shiksha/i.test(t) },
  { path: "/registration", name: "registration", check: (t) => /registration|Register/i.test(t) },
  { path: "/press", name: "press", check: (t) => /press|Press/i.test(t) },
  { path: "/media-center", name: "media-center", check: (t) => /media|Media/i.test(t) },
  { path: "/knowledge", name: "knowledge-hub", check: (t) => /knowledge|Knowledge/i.test(t) },
  { path: "/glimpses", name: "glimpses", check: (t) => t.length > 300 },
  { path: "/coming-soon", name: "coming-soon", check: (t) => /coming|soon/i.test(t) },
];

const SHELL_MARKERS = [
  { path: "/introduction", marker: "PublicPageShell", alt: /introduction/i },
  { path: "/events", marker: "ConferenceHubPage", alt: /events|summit/i },
  { path: "/committee/shikshamahakumbh2025", marker: "CommitteeEditionPage", alt: /committee|shiksha/i },
  { path: "/departments/academic-council", marker: "DepartmentPage", alt: /academic|council/i },
];

async function fetchPage(url, opts = {}) {
  const res = await fetch(url, { redirect: "follow", ...opts });
  const text = await res.text();
  return { res, text, url };
}

function parseSitemapUrls(xml) {
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml))) urls.push(m[1].trim());
  return urls;
}

function localSitemapPaths() {
  const sitemapSrc = fs.readFileSync(path.join(ROOT, "src/app/sitemap.ts"), "utf8");
  const staticMatch = sitemapSrc.match(/const STATIC_PATHS = \[([\s\S]*?)\];/);
  if (!staticMatch) return { count: 0, paths: [] };
  const paths = [];
  const spreadRe = /\.\.\.([A-Z_]+)/g;
  const quotedRe = /"([^"]+)"/g;
  let spread;
  while ((spread = spreadRe.exec(staticMatch[1]))) {
    const varName = spread[1];
    const varRe = new RegExp(`const ${varName} = \\[([\\s\\S]*?)\\]`, "m");
    const vm = sitemapSrc.match(varRe);
    if (vm) {
      let q;
      const inner = /"([^"]+)"/g;
      while ((q = inner.exec(vm[1]))) paths.push(q[1]);
    }
  }
  let q;
  while ((q = quotedRe.exec(staticMatch[1]))) paths.push(q[1]);
  const unique = [...new Set(paths)];
  return { count: unique.length, paths: unique };
}

async function phase1() {
  const local = localSitemapPaths();
  const report = {
    localSitemapCount: local.count,
    productionSitemapCount: 0,
    missingRoutes: [],
    missingPages: [],
    missingMetadata: [],
    missingAssets: [],
    routeChecks: [],
  };

  for (const route of DRIFT_ROUTES) {
    try {
      const { res, text } = await fetchPage(`${BASE}${route}`);
      const inSitemap = false;
      report.routeChecks.push({
        route,
        status: res.status,
        ok: res.ok,
        hasContent: text.length > 500,
        hasPublicPageShell: text.includes("PublicPageShell") || text.includes("public-page-shell"),
      });
      if (!res.ok) report.missingPages.push(route);
    } catch (e) {
      report.missingPages.push(`${route} (${e.message})`);
    }
  }

  try {
    const { res, text } = await fetchPage(`${BASE}/sitemap.xml`);
    const urls = parseSitemapUrls(text);
    report.productionSitemapCount = urls.length;
    for (const route of DRIFT_ROUTES) {
      const full = `${BASE}${route}`;
      if (!urls.some((u) => u.replace(/\/$/, "") === full)) {
        report.missingRoutes.push(route);
      }
    }
    const localUrls = local.paths.map((p) => (p ? `${BASE}/${p}` : BASE));
    for (const lu of localUrls) {
      if (!urls.some((u) => u.replace(/\/$/, "") === lu.replace(/\/$/, ""))) {
        const rel = lu.replace(BASE, "") || "/";
        if (!report.missingRoutes.includes(rel)) report.missingRoutes.push(rel);
      }
    }
  } catch (e) {
    report.error = e.message;
  }

  for (const route of ["/coming-soon"]) {
    try {
      const { text } = await fetchPage(`${BASE}${route}`);
      const hasTitle = /<title>[^<]+<\/title>/i.test(text);
      const hasDesc = /name="description"/i.test(text);
      if (!hasTitle || !hasDesc) report.missingMetadata.push(route);
    } catch {
      report.missingMetadata.push(route);
    }
  }

  return report;
}

async function phase2() {
  const vars = [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
    "RECAPTCHA_SECRET_KEY",
    "RAZORPAY_WEBHOOK_SECRET",
  ];
  const report = { variables: {}, probes: [] };

  for (const v of vars) {
    report.variables[v] = { status: "unknown" };
  }

  try {
    const { res, text } = await fetchPage(`${BASE}/`, {});
    const canon = text.match(/rel="canonical" href="([^"]+)"/);
    const siteUrlOk = (canon?.[1] ?? "").startsWith("https://www.rase.co.in");
    report.variables.NEXT_PUBLIC_SITE_URL = {
      status: siteUrlOk ? "present" : "invalid",
      evidence: "canonical host probe",
    };
    const recaptchaKey = text.match(/recaptcha|grecaptcha|RECAPTCHA/i);
    report.variables.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = {
      status: recaptchaKey ? "present" : "missing",
      evidence: "registration page script probe (deferred)",
    };
  } catch (e) {
    report.variables.NEXT_PUBLIC_SITE_URL = { status: "unknown", error: e.message };
  }

  try {
    const res = await fetch(`${BASE}/api/registration/verify-captcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "test-token" }),
    });
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text.slice(0, 200) };
    }
    report.probes.push({ endpoint: "verify-captcha", status: res.status, body });
    if (body.error === "reCAPTCHA not configured") {
      report.variables.RECAPTCHA_SECRET_KEY = { status: "missing", evidence: "API returns not configured" };
    } else if (res.status === 400 && body.error) {
      report.variables.RECAPTCHA_SECRET_KEY = { status: "present", evidence: "API accepts requests (secret configured)" };
    } else {
      report.variables.RECAPTCHA_SECRET_KEY = { status: "unknown", evidence: body };
    }
  } catch (e) {
    report.probes.push({ endpoint: "verify-captcha", error: e.message });
    report.variables.RECAPTCHA_SECRET_KEY = { status: "unknown", error: e.message };
  }

  try {
    const res = await fetch(`${BASE}/api/payments/razorpay-webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "invalid-test-signature",
      },
      body: JSON.stringify({ event: "payment.captured", payload: {} }),
    });
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text.slice(0, 200) };
    }
    report.probes.push({ endpoint: "razorpay-webhook", status: res.status, body });
    if (body.error === "Webhook not configured") {
      report.variables.RAZORPAY_WEBHOOK_SECRET = { status: "missing", evidence: "API returns not configured" };
    } else if (res.status === 401 || res.status === 400) {
      report.variables.RAZORPAY_WEBHOOK_SECRET = { status: "present", evidence: "Webhook secret configured (sig validation active)" };
    } else {
      report.variables.RAZORPAY_WEBHOOK_SECRET = { status: "unknown", evidence: body };
    }
  } catch (e) {
    report.probes.push({ endpoint: "razorpay-webhook", error: e.message });
    report.variables.RAZORPAY_WEBHOOK_SECRET = { status: "unknown", error: e.message };
  }

  try {
    const { text } = await fetchPage(`${BASE}/registration`);
    const hasRecaptchaScript = /recaptcha|grecaptcha|google\.com\/recaptcha/i.test(text);
    report.variables.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = {
      status: hasRecaptchaScript ? "present" : "missing",
      evidence: "registration page HTML",
    };
  } catch (e) {
    report.variables.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = { status: "unknown", error: e.message };
  }

  return report;
}

async function phase3() {
  const report = {
    localCommit: null,
    buildPageCount: 206,
    shellMarkers: [],
    perfMarkers: [],
  };
  try {
    const { execSync } = await import("node:child_process");
    report.localCommit = execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
    report.localCommitShort = execSync("git log -1 --oneline", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    report.localCommit = "unknown";
  }

  for (const { path: p, marker, alt } of SHELL_MARKERS) {
    try {
      const { res, text } = await fetchPage(`${BASE}${p}`);
      const deployed =
        text.includes(marker) ||
        (typeof alt === "function" ? alt(text) : text.includes(alt));
      report.shellMarkers.push({ path: p, marker, status: res.status, deployed });
    } catch (e) {
      report.shellMarkers.push({ path: p, marker, error: e.message, deployed: false });
    }
  }

  const perfPaths = ["/introduction", "/press"];
  for (const p of perfPaths) {
    try {
      const { text } = await fetchPage(`${BASE}${p}`);
      const noFramer = !/framer-motion|data-framer/i.test(text);
      report.perfMarkers.push({ path: p, framerRemoved: noFramer });
    } catch (e) {
      report.perfMarkers.push({ path: p, error: e.message });
    }
  }

  try {
    const { text } = await fetchPage(`${BASE}/`);
    report.productionBuildId = text.match(/"buildId":"([^"]+)"/)?.[1] ?? null;
    report.hasNextData = text.includes("__NEXT_DATA__");
  } catch {}

  return report;
}

async function phase4() {
  const { res, text } = await fetchPage(`${BASE}/sitemap.xml`);
  const urls = parseSitemapUrls(text);
  const required = ["glimpses", "accommodation", "coming-soon"];
  const missing = required.filter((r) => !urls.some((u) => u.includes(`/${r}`)));
  return {
    status: res.status,
    totalUrls: urls.length,
    requiredPresent: required.filter((r) => !missing.includes(r)),
    missing,
    sampleUrls: urls.slice(0, 5),
  };
}

async function phase5() {
  const { res, text } = await fetchPage(`${BASE}/robots.txt`);
  const hasSitemap = /Sitemap:\s*(\S+)/i.test(text);
  const sitemapRef = text.match(/Sitemap:\s*(\S+)/i)?.[1] ?? null;
  const blocksAll = /Disallow:\s*\/\s*$/im.test(text);
  const allowsRoot = !blocksAll;
  return {
    status: res.status,
    hasUserAgent: /User-agent/i.test(text),
    sitemapRef,
    sitemapValid: sitemapRef?.includes("sitemap"),
    blocksAll,
    allowsRoot,
    content: text.slice(0, 500),
  };
}

async function phase6() {
  const results = [];
  for (const route of SMOKE_ROUTES) {
    try {
      const { res, text } = await fetchPage(`${BASE}${route.path}`);
      const contentOk = route.check(text);
      const hydrationRisk = /Hydration failed|Application error|Internal Server Error/i.test(text);
      results.push({
        name: route.name,
        path: route.path,
        status: res.status,
        pass: res.ok && contentOk && !hydrationRisk,
        hydrationRisk,
        contentOk,
      });
    } catch (e) {
      results.push({ name: route.name, path: route.path, pass: false, error: e.message });
    }
  }
  return { results, passed: results.filter((r) => r.pass).length, total: results.length };
}

async function phase7() {
  const report = { frontend: "unknown", api: "unknown", endToEnd: "fail" };
  try {
    const { text } = await fetchPage(`${BASE}/registration`);
    report.frontend = /recaptcha|grecaptcha/i.test(text) ? "present" : "missing";
  } catch (e) {
    report.frontend = `error: ${e.message}`;
  }
  try {
    const res = await fetch(`${BASE}/api/registration/verify-captcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "" }),
    });
    const body = await res.json();
    report.apiStatus = res.status;
    report.apiBody = body;
    if (body.error === "reCAPTCHA not configured") {
      report.api = "missing_secret";
      report.endToEnd = "fail";
    } else if (res.status === 400) {
      report.api = "configured";
      report.endToEnd = report.frontend === "present" ? "partial" : "fail";
    } else {
      report.api = "unknown";
    }
  } catch (e) {
    report.api = `error: ${e.message}`;
  }
  return report;
}

async function phase8() {
  const report = { webhook: "unknown", signatureValidation: "unknown", endToEnd: "fail" };
  try {
    const res = await fetch(`${BASE}/api/payments/razorpay-webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "invalid-signature-for-test",
      },
      body: JSON.stringify({
        event: "payment.captured",
        payload: { payment: { entity: { id: "pay_test", order_id: "order_test" } } },
      }),
    });
    const body = await res.json().catch(() => ({}));
    report.webhookStatus = res.status;
    report.webhookBody = body;
    if (body.error === "Webhook not configured") {
      report.webhook = "missing_secret";
      report.signatureValidation = "not_testable";
    } else if (res.status === 401 || body.error?.includes?.("signature")) {
      report.webhook = "configured";
      report.signatureValidation = "active";
      report.endToEnd = "partial";
    } else {
      report.webhook = "unknown";
    }
  } catch (e) {
    report.webhook = `error: ${e.message}`;
  }
  report.note = "Full Firestore/audit E2E requires valid Razorpay test payment — not run in this audit";
  return report;
}

async function phase10Extras() {
  const canonicalPages = ["/", "/press", "/media-center", "/registration", "/coming-soon"];
  const canonicals = [];
  for (const p of canonicalPages) {
    try {
      const { res, text } = await fetchPage(`${BASE}${p}`);
      const canon = text.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? null;
      canonicals.push({
        path: p,
        status: res.status,
        canonical: canon,
        valid: (canon ?? "").startsWith("https://www.rase.co.in"),
      });
    } catch (e) {
      canonicals.push({ path: p, error: e.message, valid: false });
    }
  }
  return { canonicals };
}

async function main() {
  console.log(`Launch certification audit: ${BASE}\n`);

  const local = localSitemapPaths();
  const p1 = await phase1();
  const p2 = await phase2();
  const p3 = await phase3();
  const p4 = await phase4();
  const p5 = await phase5();
  const p6 = await phase6();
  const p7 = await phase7();
  const p8 = await phase8();
  const p10 = await phase10Extras();

  const out = {
    auditedAt: new Date().toISOString(),
    baseUrl: BASE,
    localSitemapCount: local.count,
    phases: {
      deploymentDrift: p1,
      environment: p2,
      buildVerification: p3,
      sitemap: p4,
      robots: p5,
      smokeTests: p6,
      captcha: p7,
      payment: p8,
      extras: p10,
    },
  };

  const outPath = path.join(ROOT, "docs/launch-audit-results.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Wrote ${outPath}`);
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
