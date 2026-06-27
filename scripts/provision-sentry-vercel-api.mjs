#!/usr/bin/env node
/**
 * Provision Sentry via Vercel REST API (free Developer plan am3_f).
 * Bypasses browser billingPlanId error when CLI terms are accepted.
 */
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_0PYXWQMwAV9fPWOTuxk54H9K";
const PROJECT_ID = process.env.VERCEL_PROJECT_ID ?? "prj_k6YZpm35GqkuZcYOohnXVTM0Uy9f";
const PLAN_ID = "am3_f";

const AUTH_PATHS = [
  join(homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
  join(homedir(), ".config", "vercel", "auth.json"),
];

function loadToken() {
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

async function api(token, path, options = {}) {
  const sep = path.includes("?") ? "&" : "?";
  const url = `https://api.vercel.com${path}${sep}teamId=${TEAM_ID}`;
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
    throw new Error(`${path} → ${res.status}: ${text.slice(0, 400)}`);
  }
  return body;
}

async function main() {
  const token = loadToken();
  if (!token) {
    console.error("No Vercel token. Run: npx vercel login");
    process.exit(1);
  }

  const configs = await api(token, "/v1/integrations/configurations?view=account");
  const sentryCfg = (configs.configurations ?? configs).find?.(
    (c) => c.slug === "sentry" || c.integrationSlug === "sentry"
  ) ?? (Array.isArray(configs) ? configs.find((c) => /sentry/i.test(c.slug ?? "")) : null);

  let configId = sentryCfg?.id;
  if (!configId) {
    console.log("No Sentry configuration yet — install via CLI first (terms only):");
    console.log("https://vercel.com/dhe-projects/~/integrations/accept-terms/sentry?source=cli");
    console.log("Then: npm run setup:sentry");
    process.exit(1);
  }

  console.log(`Sentry config: ${configId}`);

  const body = {
    name: "rase-monitoring",
    integrationConfigurationId: configId,
    integrationProductIdOrSlug: "sentry",
    source: "cli",
    billingPlanId: PLAN_ID,
    metadata: {
      name: "rase-co-in",
      region: "us",
      platform: "javascript-nextjs",
    },
  };

  const created = await api(token, "/v1/storage/stores/integration/direct", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const storeId = created.store?.externalResourceId ?? created.store?.id;
  console.log("[ok] Sentry store created:", storeId ?? JSON.stringify(created.store?.status));

  if (storeId) {
    try {
      await api(token, `/v1/storage/stores/${storeId}/connections`, {
        method: "POST",
        body: JSON.stringify({
          projectId: PROJECT_ID,
          envVarPrefix: "",
          environments: ["production", "preview"],
        }),
      });
      console.log("[ok] Connected to rase-co-in");
    } catch (e) {
      console.warn("[warn] Connect step:", e.message);
    }
  }

  console.log("\nRedeploy production, then check /api/v2/health");
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
