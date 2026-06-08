#!/usr/bin/env node
/**
 * RC1 environment variable presence check (values NOT printed).
 * Usage: node scripts/verify-env.mjs
 */
import fs from "node:fs";
import path from "node:path";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = { ...loadEnvFile(path.resolve(".env")), ...process.env };

const groups = {
  site: [
    { key: "NEXT_PUBLIC_SITE_URL", required: true, staging: true },
  ],
  firebase: [
    { key: "NEXT_PUBLIC_FIREBASE_API_KEY", required: false, note: "Uses inline config in lib/firebase/client.ts if unset" },
    { key: "FIREBASE_PROJECT_ID", required: false },
  ],
  email: [
    { key: "SMTP_HOST", required: true, staging: true },
    { key: "SMTP_USER", required: true, staging: true },
    { key: "SMTP_PASS", required: true, staging: true },
    { key: "SMTP_FROM", required: false },
    { key: "SMTP_PORT", required: false },
    { key: "REGISTRATION_EMAIL_SECRET", required: false },
    { key: "REGISTRATION_EMAIL_REQUIRE_SECRET", required: false },
  ],
  registration: [
    { key: "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", required: true, production: true },
    { key: "RECAPTCHA_SECRET_KEY", required: true, production: true },
    { key: "NEXT_PUBLIC_RAZORPAY_KEY_ID", required: true, production: true },
    { key: "RAZORPAY_KEY_ID", required: true, production: true },
    { key: "RAZORPAY_KEY_SECRET", required: true, production: true },
    { key: "RAZORPAY_WEBHOOK_SECRET", required: true, production: true },
  ],
  analytics: [
    { key: "NEXT_PUBLIC_GA_ID", required: false },
    { key: "NEXT_PUBLIC_GTM_ID", required: false },
    { key: "NEXT_PUBLIC_CLARITY_ID", required: false },
    { key: "NEXT_PUBLIC_META_PIXEL_ID", required: false },
  ],
  ads: [
    { key: "NEXT_PUBLIC_ADSENSE_ENABLED", required: false },
    { key: "NEXT_PUBLIC_ADS_SLOTS_PREVIEW", required: false },
  ],
  monitoring: [
    { key: "NEXT_PUBLIC_SENTRY_DSN", required: false },
    { key: "VISITOR_COUNTER_USE_FIRESTORE", required: false },
  ],
};

const results = [];
let fail = 0;

for (const [group, vars] of Object.entries(groups)) {
  for (const v of vars) {
    const present = Boolean(env[v.key] && env[v.key].length > 0);
    const ok = !v.required || present;
    if (!ok) fail++;
    results.push({
      group,
      key: v.key,
      present,
      required: Boolean(v.required),
      ok,
      note: v.note,
    });
  }
}

console.log(JSON.stringify({ checked: results.length, missingRequired: fail, vars: results }, null, 2));
process.exit(fail > 0 ? 1 : 0);
