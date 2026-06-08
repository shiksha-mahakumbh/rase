#!/usr/bin/env node
/**
 * Production FULL GO verification — run after deploy + env setup.
 * Usage: node scripts/production-go-live.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = (process.argv[2] || "https://www.rase.co.in").replace(/\/$/, "");
const CERTIFIED_COMMIT = "3380ce94d31877930a5787e2ef19cd7ba7632714";
const EXPECTED_SITEMAP = 107;

const checks = [];

function record(name, pass, detail = "") {
  checks.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  console.log(`Production GO-LIVE check: ${BASE}\n`);

  for (const route of ["/glimpses", "/accommodation", "/coming-soon"]) {
    try {
      const res = await fetch(`${BASE}${route}`);
      record(`route ${route}`, res.ok, `HTTP ${res.status}`);
    } catch (e) {
      record(`route ${route}`, false, e.message);
    }
  }

  try {
    const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
    const count = (xml.match(/<loc>/g) || []).length;
    const has = (p) => xml.includes(`/${p}`);
    record("sitemap-count", count >= EXPECTED_SITEMAP, `${count} URLs (expected ≥${EXPECTED_SITEMAP})`);
    record("sitemap-glimpses", has("glimpses"));
    record("sitemap-accommodation", has("accommodation"));
    record("sitemap-coming-soon", has("coming-soon"));
  } catch (e) {
    record("sitemap", false, e.message);
  }

  try {
    const cap = await fetch(`${BASE}/api/registration/verify-captcha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "probe" }),
    });
    const capBody = await cap.json();
    const capOk = capBody.error !== "reCAPTCHA not configured";
    record("captcha-configured", capOk, capBody.error ?? "ok");
  } catch (e) {
    record("captcha-configured", false, e.message);
  }

  try {
    const wh = await fetch(`${BASE}/api/payments/razorpay-webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "probe",
      },
      body: "{}",
    });
    const whBody = await wh.json();
    const whOk = whBody.error !== "Webhook not configured";
    record("webhook-configured", whOk, whBody.error ?? `HTTP ${wh.status}`);
  } catch (e) {
    record("webhook-configured", false, e.message);
  }

  const summaryPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "docs",
    "production-go-live-results.json"
  );
  fs.writeFileSync(
    summaryPath,
    JSON.stringify({ baseUrl: BASE, certifiedCommit: CERTIFIED_COMMIT, checkedAt: new Date().toISOString(), checks }, null, 2)
  );
  console.log(`\nWrote ${summaryPath}`);

  const passed = checks.filter((c) => c.pass).length;
  console.log(`\n${passed}/${checks.length} checks passed`);
  process.exit(passed === checks.length ? 0 : 1);
}

main();
