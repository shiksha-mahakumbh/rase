#!/usr/bin/env node
/**
 * Push audit P1 production env vars to Vercel (non-interactive).
 *
 * Sets: CRON_SECRET, REGISTRATION_EMAIL_SECRET, REGISTRATION_EMAIL_REQUIRE_SECRET,
 *       DIRECT_URL (from POSTGRES_URL_NON_POOLING on Vercel if missing),
 *       UPSTASH_* and NEXT_PUBLIC_SENTRY_DSN when present locally.
 *
 * Usage:
 *   node scripts/setup-audit-vercel-env.mjs
 *   node scripts/setup-audit-vercel-env.mjs --dry-run
 *
 * Requires VERCEL_TOKEN env or Vercel CLI auth (`npx vercel login`).
 */
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

const PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_k6YZpm35GqkuZcYOohnXVTM0Uy9f";
const TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_0PYXWQMwAV9fPWOTuxk54H9K";
const TARGETS = ["production", "preview"];
const dryRun = process.argv.includes("--dry-run");

const AUTH_PATHS = [
  join(homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
  join(homedir(), ".config", "vercel", "auth.json"),
];

function loadVercelToken() {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN;
  for (const p of AUTH_PATHS) {
    if (!existsSync(p)) continue;
    try {
      const auth = JSON.parse(readFileSync(p, "utf8"));
      if (auth.token) return auth.token;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function parseEnv(filePath) {
  if (!existsSync(filePath)) return {};
  const out = {};
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

function secret(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

async function vercelFetch(token, path, options = {}) {
  const url = `https://api.vercel.com${path}${path.includes("?") ? "&" : "?"}teamId=${TEAM_ID}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`Vercel API ${path} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return body;
}

async function listProjectEnv(token) {
  const data = await vercelFetch(token, `/v9/projects/${PROJECT_ID}/env`);
  return data.envs ?? [];
}

async function getDecryptedEnv(token, key) {
  const envs = await listProjectEnv(token);
  const entry = envs.find((e) => e.key === key);
  if (!entry) return null;
  const data = await vercelFetch(
    token,
    `/v9/projects/${PROJECT_ID}/env/${entry.id}?decrypt=true`
  );
  return data.value ?? null;
}

async function upsertEnv(token, key, value, targets = TARGETS) {
  if (!value) {
    console.log(`[skip] ${key}: no value`);
    return false;
  }
  if (dryRun) {
    console.log(`[dry-run] would set ${key} on ${targets.join(", ")}`);
    return true;
  }

  const envs = await listProjectEnv(token);
  const existing = envs.filter((e) => e.key === key);

  for (const target of targets) {
    const match = existing.find((e) => e.target?.includes(target));
    if (match) {
      await vercelFetch(token, `/v9/projects/${PROJECT_ID}/env/${match.id}`, {
        method: "PATCH",
        body: JSON.stringify({ value, target: [target] }),
      });
      console.log(`[ok] ${key} updated → ${target}`);
    } else {
      await vercelFetch(token, `/v10/projects/${PROJECT_ID}/env`, {
        method: "POST",
        body: JSON.stringify({
          key,
          value,
          type: "encrypted",
          target: [target],
        }),
      });
      console.log(`[ok] ${key} created → ${target}`);
    }
  }
  return true;
}

async function main() {
  const token = loadVercelToken();
  if (!token) {
    console.error("No Vercel token. Set VERCEL_TOKEN or run: npx vercel login");
    process.exit(1);
  }

  const local = {
    ...parseEnv(".env"),
    ...parseEnv(".env.local"),
    ...parseEnv(".env.vercel.production"),
  };

  const envs = await listProjectEnv(token);
  const existingKeys = new Set(envs.map((e) => e.key));
  console.log(`Project: rase-co-in (${PROJECT_ID})`);
  console.log(`Existing env keys: ${existingKeys.size}`);

  let directUrl = local.DIRECT_URL || local.POSTGRES_URL_NON_POOLING;
  if (!directUrl && !existingKeys.has("DIRECT_URL")) {
    directUrl =
      (await getDecryptedEnv(token, "POSTGRES_URL_NON_POOLING")) ??
      (await getDecryptedEnv(token, "DIRECT_URL"));
  }

  const generated = {
    CRON_SECRET: local.CRON_SECRET || secret(32),
    REGISTRATION_EMAIL_SECRET: local.REGISTRATION_EMAIL_SECRET || secret(32),
  };

  const plan = [
    ["CRON_SECRET", generated.CRON_SECRET, !existingKeys.has("CRON_SECRET")],
    [
      "REGISTRATION_EMAIL_SECRET",
      generated.REGISTRATION_EMAIL_SECRET,
      !existingKeys.has("REGISTRATION_EMAIL_SECRET"),
    ],
    [
      "REGISTRATION_EMAIL_REQUIRE_SECRET",
      local.REGISTRATION_EMAIL_REQUIRE_SECRET || "true",
      true,
    ],
    ["DIRECT_URL", directUrl, !existingKeys.has("DIRECT_URL") && Boolean(directUrl)],
    [
      "UPSTASH_REDIS_REST_URL",
      local.UPSTASH_REDIS_REST_URL,
      !existingKeys.has("UPSTASH_REDIS_REST_URL") && Boolean(local.UPSTASH_REDIS_REST_URL),
    ],
    [
      "UPSTASH_REDIS_REST_TOKEN",
      local.UPSTASH_REDIS_REST_TOKEN,
      !existingKeys.has("UPSTASH_REDIS_REST_TOKEN") && Boolean(local.UPSTASH_REDIS_REST_TOKEN),
    ],
    [
      "NEXT_PUBLIC_SENTRY_DSN",
      local.NEXT_PUBLIC_SENTRY_DSN,
      !existingKeys.has("NEXT_PUBLIC_SENTRY_DSN") && Boolean(local.NEXT_PUBLIC_SENTRY_DSN),
    ],
  ];

  for (const [key, value, shouldSet] of plan) {
    if (!shouldSet) {
      if (existingKeys.has(key)) console.log(`[skip] ${key}: already on Vercel`);
      continue;
    }
    await upsertEnv(token, key, value);
  }

  if (!existingKeys.has("UPSTASH_REDIS_REST_URL")) {
    console.log("\n[manual] Upstash: https://vercel.com/dhe-projects/rase-co-in/stores → Create Redis");
    console.log("         Or: https://vercel.com/integrations/upstash");
  }
  if (!existingKeys.has("NEXT_PUBLIC_SENTRY_DSN")) {
    console.log("\n[manual] Sentry: https://vercel.com/integrations/sentry (links DSN automatically)");
  }

  if (!dryRun) {
    console.log("\nTrigger production redeploy via Git push or Vercel dashboard.");
    try {
      await vercelFetch(token, `/v13/deployments`, {
        method: "POST",
        body: JSON.stringify({
          name: "rase-co-in",
          project: PROJECT_ID,
          target: "production",
          gitSource: {
            type: "github",
            org: "shiksha-mahakumbh",
            repo: "rase",
            ref: "main",
          },
        }),
      });
      console.log("[ok] Production redeploy triggered");
    } catch (e) {
      console.log("[warn] Redeploy trigger skipped:", e.message ?? e);
    }
  }

  console.log("\nVerify after deploy: curl -s https://www.rase.co.in/api/v2/health");
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
