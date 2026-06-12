#!/usr/bin/env node
/**
 * Staging environment validation — presence only, never prints values.
 */
import "dotenv/config";
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
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (val) out[key] = val;
  }
  return out;
}

const env = {
  ...loadEnvFile(path.resolve(".env")),
  ...loadEnvFile(path.resolve(".env.local")),
  ...process.env,
};

function present(key) {
  const v = env[key];
  return Boolean(v && String(v).trim().length > 0);
}

function supabaseAuthOk() {
  return (
    (present("NEXT_PUBLIC_SUPABASE_URL") || present("SUPABASE_URL")) &&
    (present("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
      present("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
      present("SUPABASE_ANON_KEY")) &&
    present("SUPABASE_SERVICE_ROLE_KEY")
  );
}

const checks = [
  { group: "Security", key: "ADMIN_SESSION_SECRET", ok: present("ADMIN_SESSION_SECRET") || present("ADMIN_OPS_SECRET"), note: "ADMIN_OPS_SECRET fallback" },
  { group: "Security", key: "REGISTRATION_LOOKUP_SECRET", ok: present("REGISTRATION_LOOKUP_SECRET") || present("REGISTRATION_EMAIL_SECRET") || present("ADMIN_OPS_SECRET"), note: "fallback chain" },
  { group: "Security", key: "ADMIN_OPS_SECRET", ok: present("ADMIN_OPS_SECRET") },
  { group: "Database", key: "DATABASE_URL", ok: present("DATABASE_URL") },
  { group: "Database", key: "DIRECT_URL", ok: present("DIRECT_URL") },
  { group: "Supabase", key: "NEXT_PUBLIC_SUPABASE_URL", alt: "SUPABASE_URL", ok: present("NEXT_PUBLIC_SUPABASE_URL") || present("SUPABASE_URL") },
  {
    group: "Supabase",
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    alt: "SUPABASE_ANON_KEY",
    ok:
      present("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
      present("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ||
      present("SUPABASE_ANON_KEY"),
  },
  { group: "Supabase", key: "SUPABASE_SERVICE_ROLE_KEY", ok: present("SUPABASE_SERVICE_ROLE_KEY") },
  { group: "Supabase Auth", key: "Supabase URL + keys", ok: supabaseAuthOk() },
  { group: "SMTP", key: "SMTP_HOST", ok: present("SMTP_HOST") },
  { group: "SMTP", key: "SMTP_PORT", ok: present("SMTP_PORT") },
  { group: "SMTP", key: "SMTP_USER", ok: present("SMTP_USER") },
  { group: "SMTP", key: "SMTP_PASS", ok: present("SMTP_PASS") },
  { group: "SMTP", key: "SMTP_FROM", ok: present("SMTP_FROM") },
  { group: "Razorpay", key: "RAZORPAY_KEY_ID", ok: present("RAZORPAY_KEY_ID") },
  { group: "Razorpay", key: "RAZORPAY_KEY_SECRET", ok: present("RAZORPAY_KEY_SECRET") },
  { group: "Razorpay", key: "RAZORPAY_WEBHOOK_SECRET", ok: present("RAZORPAY_WEBHOOK_SECRET") },
  { group: "Site", key: "NEXT_PUBLIC_SITE_URL", ok: present("NEXT_PUBLIC_SITE_URL") },
  { group: "Registration", key: "REGISTRATION_BACKEND", ok: !present("REGISTRATION_BACKEND") || env.REGISTRATION_BACKEND === "supabase", note: "expected: supabase (or unset)" },
  { group: "Registration", key: "RECAPTCHA_SECRET_KEY", ok: present("RECAPTCHA_SECRET_KEY") },
  { group: "Registration", key: "NEXT_PUBLIC_RECAPTCHA_SITE_KEY", ok: present("NEXT_PUBLIC_RECAPTCHA_SITE_KEY") },
];

const missing = checks.filter((c) => !c.ok);
const report = {
  timestamp: new Date().toISOString(),
  total: checks.length,
  passed: checks.length - missing.length,
  failed: missing.length,
  checks,
  missingKeys: missing.map((c) => c.key),
};

const outPath = path.resolve("docs/staging/env-check-result.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log(JSON.stringify({ passed: report.passed, failed: report.failed, missingKeys: report.missingKeys }, null, 2));
process.exit(missing.length > 0 ? 1 : 0);
