#!/usr/bin/env node
/** Read-only Supabase audit via public APIs (no service role required). */
import fs from "node:fs";
import { isAnonRolesAccessBlocked } from "./lib/anon-roles-probe.mjs";

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
  ...loadEnvFile(".env"),
  ...loadEnvFile(".env.local"),
  ...loadEnvFile(".env.vercel.production"),
  ...process.env,
};

const url = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY;
const site = process.env.SITE_URL ?? "https://www.rase.co.in";

async function probe(name, fetchFn) {
  try {
    return { name, ok: true, ...(await fetchFn()) };
  } catch (e) {
    return { name, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function main() {
  const report = {
    checkedAt: new Date().toISOString(),
    projectRef: url?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? null,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(url),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(anon),
      SUPABASE_SERVICE_ROLE_KEY: Boolean(env.SUPABASE_SERVICE_ROLE_KEY),
      DATABASE_URL: Boolean(env.DATABASE_URL),
      DIRECT_URL: Boolean(env.DIRECT_URL),
    },
    probes: [],
    gaps: [],
  };

  if (!url || !anon) {
    report.gaps.push("Missing NEXT_PUBLIC_SUPABASE_URL or anon key locally");
  }

  report.probes.push(
    await probe("production-health-v2", async () => {
      const res = await fetch(`${site}/api/v2/health`);
      const body = await res.json();
      return { status: res.status, body };
    })
  );

  if (url && anon) {
    report.probes.push(
      await probe("supabase-auth-health", async () => {
        const res = await fetch(`${url}/auth/v1/health`, {
          headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        });
        return { status: res.status, body: await res.text() };
      })
    );

    report.probes.push(
      await probe("roles-anon-select", async () => {
        const res = await fetch(`${url}/rest/v1/roles?select=slug&limit=1`, {
          headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        });
        const text = await res.text();
        return {
          status: res.status,
          blocked: isAnonRolesAccessBlocked(res.status, text),
          sample: text.slice(0, 120),
        };
      })
    );

    report.probes.push(
      await probe("storage-anon-list-buckets", async () => {
        const res = await fetch(`${url}/storage/v1/bucket`, {
          headers: { apikey: anon, Authorization: `Bearer ${anon}` },
        });
        return { status: res.status, body: (await res.text()).slice(0, 200) };
      })
    );

    report.probes.push(
      await probe("publications-bucket-public-read", async () => {
        const res = await fetch(
          `${url}/storage/v1/object/public/publications/proceedings/Proceeding1.pdf`,
          { method: "HEAD" }
        );
        return { status: res.status, exists: res.ok };
      })
    );
  }

  const health = report.probes.find((p) => p.name === "production-health-v2")?.body;
  if (health?.supabase?.database !== "connected") {
    report.gaps.push(`Production DB not connected (${health?.supabase?.database ?? "unknown"})`);
  }
  if (health?.supabase?.configured !== true) {
    report.gaps.push("Production reports Supabase not fully configured (service role or DATABASE_URL)");
  }

  const rolesProbe = report.probes.find((p) => p.name === "roles-anon-select");
  if (rolesProbe?.ok && !rolesProbe.blocked) {
    report.gaps.push("Anon can read roles table — RLS may be missing or misconfigured");
  }

  const pubBucket = report.probes.find((p) => p.name === "publications-bucket-public-read");
  if (pubBucket?.ok && pubBucket.status === 400) {
    report.gaps.push("publications bucket not created (optional — proceedings on GitHub CDN)");
  }

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    report.gaps.push("SUPABASE_SERVICE_ROLE_KEY not available locally (expected for Vercel-only secrets)");
  }

  const strict = process.argv.includes("--strict") || process.env.AUDIT_SUPABASE_STRICT === "1";
  console.log(JSON.stringify(report, null, 2));

  if (strict && report.gaps.length > 0) {
    console.error(`\n✗ audit:supabase — ${report.gaps.length} gap(s)`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
