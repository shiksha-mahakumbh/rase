#!/usr/bin/env node
/**
 * Fetch service_role API key from Supabase Management API and add to Vercel Preview.
 * Requires SUPABASE_ACCESS_TOKEN (supabase.com/dashboard/account/tokens) or `supabase login`.
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=sbp_... node scripts/fetch-service-role-from-supabase.mjs
 *   node scripts/fetch-service-role-from-supabase.mjs --from-env-file .env.supabase-keys
 */
import fs from "node:fs";
import path from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PROJECT_REF = "rcpbfrauyyyorptckrlp";
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_k6YZpm35GqkuZcYOohnXVTM0Uy9f";
const VERCEL_TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_0PYXWQMwAV9fPWOTuxk54H9K";
const ENV_KEY = "SUPABASE_SERVICE_ROLE_KEY";

const AUTH_PATHS = [
  path.join(homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
  path.join(homedir(), ".config", "vercel", "auth.json"),
];

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

function loadVercelToken() {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN;
  for (const p of AUTH_PATHS) {
    if (!fs.existsSync(p)) continue;
    try {
      const auth = JSON.parse(fs.readFileSync(p, "utf8"));
      if (auth.token) return auth.token;
    } catch {
      /* ignore */
    }
  }
  return null;
}

async function vercelFetch(token, apiPath, options = {}) {
  const url = `https://api.vercel.com${apiPath}${apiPath.includes("?") ? "&" : "?"}teamId=${VERCEL_TEAM_ID}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Vercel API ${apiPath} → ${res.status}: ${text.slice(0, 200)}`);
  return text ? JSON.parse(text) : {};
}

async function fetchServiceRoleFromSupabase(accessToken) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Supabase API → ${res.status}: ${text.slice(0, 200)}`);
  }
  const keys = JSON.parse(text);
  const service = keys.find((k) => k.name === "service_role" || k.type === "service_role");
  if (!service?.api_key) {
    throw new Error("service_role key not found in Supabase API response");
  }
  return service.api_key;
}

async function addToPreview(vercelToken, value) {
  const { envs } = await vercelFetch(vercelToken, `/v9/projects/${VERCEL_PROJECT_ID}/env`);
  if (envs.some((e) => e.key === ENV_KEY && e.target?.includes("preview"))) {
    console.log(`[skip] ${ENV_KEY} already on preview`);
    return;
  }
  await vercelFetch(vercelToken, `/v10/projects/${VERCEL_PROJECT_ID}/env`, {
    method: "POST",
    body: JSON.stringify({
      key: ENV_KEY,
      value,
      type: "sensitive",
      target: ["preview"],
    }),
  });
  console.log(`[ok] ${ENV_KEY} added to preview (length ${value.length})`);
}

async function main() {
  const fromEnvFile = process.argv.includes("--from-env-file")
    ? process.argv[process.argv.indexOf("--from-env-file") + 1]
    : null;

  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
  if (!serviceRoleKey && fromEnvFile) {
    const file = path.isAbsolute(fromEnvFile) ? fromEnvFile : path.join(ROOT, fromEnvFile);
    serviceRoleKey = loadEnvFile(file)[ENV_KEY] ?? null;
  }
  if (!serviceRoleKey) {
    const local = loadEnvFile(path.join(ROOT, ".env.vercel.production"));
    serviceRoleKey = local[ENV_KEY] || null;
  }

  if (!serviceRoleKey) {
    const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
    if (!accessToken) {
      console.error(
        "Need SUPABASE_ACCESS_TOKEN or SUPABASE_SERVICE_ROLE_KEY.\n" +
          "Get token: https://supabase.com/dashboard/account/tokens\n" +
          "Or service role: Project Settings → API → service_role key"
      );
      process.exit(1);
    }
    serviceRoleKey = await fetchServiceRoleFromSupabase(accessToken);
    console.log(`[ok] fetched service_role from Supabase API (length ${serviceRoleKey.length})`);
  }

  const vercelToken = loadVercelToken();
  if (!vercelToken) {
    console.error("Vercel CLI login required");
    process.exit(1);
  }

  await addToPreview(vercelToken, serviceRoleKey);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
