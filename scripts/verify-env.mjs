#!/usr/bin/env node
/**
 * Environment variable presence check (values NOT printed).
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

const env = {
  ...loadEnvFile(path.resolve(".env")),
  ...loadEnvFile(path.resolve(".env.local")),
  ...process.env,
};

function hasBrevoSmtp() {
  return Boolean(
    env.BREVO_SMTP_HOST && env.BREVO_SMTP_USER && env.BREVO_SMTP_PASS
  );
}

function hasGenericSmtp() {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

const groups = {
  site: [{ key: "NEXT_PUBLIC_SITE_URL", required: true, staging: true }],
  supabase: [
    { key: "DATABASE_URL", required: true, production: true },
    { key: "DIRECT_URL", required: true, production: true },
    { key: "NEXT_PUBLIC_SUPABASE_URL", required: true, production: true },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: true, production: true },
    { key: "SUPABASE_SERVICE_ROLE_KEY", required: true, production: true },
  ],
  admin: [
    { key: "ADMIN_OPS_SECRET", required: true, production: true },
    { key: "ADMIN_SESSION_SECRET", required: true, production: true },
    { key: "REGISTRATION_LOOKUP_SECRET", required: true, production: true },
    { key: "REGISTRATION_UPLOAD_SECRET", required: false, productionRecommended: true },
    { key: "ADMIN_GATEWAY_SIGNING_SECRET", required: false, productionRecommended: true },
    { key: "ADMIN_BOOTSTRAP_EMAILS", required: false },
  ],
  registration: [
    {
      key: "REGISTRATION_BACKEND",
      required: false,
      validate: (raw) => !raw || raw === "supabase",
      note: "expected: supabase (or unset; runtime is Supabase-only)",
    },
    { key: "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", required: true, production: true },
    { key: "RECAPTCHA_SECRET_KEY", required: true, production: true },
    { key: "NEXT_PUBLIC_RAZORPAY_KEY_ID", required: true, production: true },
    { key: "RAZORPAY_KEY_ID", required: true, production: true },
    { key: "RAZORPAY_KEY_SECRET", required: true, production: true },
    { key: "RAZORPAY_WEBHOOK_SECRET", required: true, production: true },
  ],
  email: [
    {
      key: "EMAIL_TRANSPORT",
      required: true,
      validate: () => hasBrevoSmtp() || hasGenericSmtp(),
      note: "Set BREVO_SMTP_HOST+USER+PASS or SMTP_HOST+USER+PASS",
    },
    { key: "BREVO_SMTP_HOST", required: false },
    { key: "BREVO_SMTP_USER", required: false },
    { key: "BREVO_SMTP_PASS", required: false },
    { key: "SMTP_HOST", required: false },
    { key: "SMTP_USER", required: false },
    { key: "SMTP_PASS", required: false },
    { key: "SMTP_FROM", required: false },
    { key: "SMTP_PORT", required: false },
    { key: "REGISTRATION_EMAIL_SECRET", required: false },
    { key: "REGISTRATION_EMAIL_REQUIRE_SECRET", required: false },
  ],
  analytics: [
    { key: "NEXT_PUBLIC_GA_ID", required: false },
    { key: "NEXT_PUBLIC_GTM_ID", required: false },
    { key: "NEXT_PUBLIC_CLARITY_ID", required: false },
    { key: "NEXT_PUBLIC_META_PIXEL_ID", required: false },
    { key: "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION", required: false },
  ],
  ads: [
    { key: "NEXT_PUBLIC_ADSENSE_ENABLED", required: false },
    { key: "NEXT_PUBLIC_ADS_SLOTS_PREVIEW", required: false },
  ],
  monitoring: [{ key: "NEXT_PUBLIC_SENTRY_DSN", required: false }],
  redis: [
    { key: "UPSTASH_REDIS_REST_URL", required: false, productionRecommended: true },
    { key: "UPSTASH_REDIS_REST_TOKEN", required: false, productionRecommended: true },
  ],
  cron: [{ key: "CRON_SECRET", required: false, productionRecommended: true }],
};

const results = [];
let fail = 0;

for (const [group, vars] of Object.entries(groups)) {
  for (const v of vars) {
    const raw = env[v.key];
    const present = Boolean(raw && String(raw).length > 0);
    const valid = v.validate ? v.validate(raw) : present;
    const ok = !v.required || valid;
    if (!ok) fail++;
    results.push({
      group,
      key: v.key,
      present,
      valid: v.validate ? valid : present,
      required: Boolean(v.required),
      ok,
      note: v.note,
    });
  }
}

console.log(
  JSON.stringify({ checked: results.length, missingRequired: fail, vars: results }, null, 2)
);

const isProductionDeploy =
  env.VERCEL_ENV === "production" || env.NODE_ENV === "production";

if (isProductionDeploy && env.ADMIN_OPS_ALLOW_DIRECT === "true") {
  fail++;
  results.push({
    group: "admin",
    key: "ADMIN_OPS_ALLOW_DIRECT",
    present: true,
    valid: false,
    required: true,
    ok: false,
    note: "Must not be true in production — disables signed gateway enforcement",
  });
  console.error("ADMIN_OPS_ALLOW_DIRECT must not be true in production");
}

process.exit(fail > 0 ? 1 : 0);
