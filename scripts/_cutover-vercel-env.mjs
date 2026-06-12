#!/usr/bin/env node
/** Add missing Vercel production env vars from local .env (non-interactive). */
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

function parseEnv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

const env = { ...parseEnv(".env"), ...parseEnv(".env.local") };

const toSet = [
  ["DATABASE_URL", env.DATABASE_URL || env.POSTGRES_PRISMA_URL],
  ["DIRECT_URL", env.DIRECT_URL || env.POSTGRES_URL_NON_POOLING],
  ["NEXT_PUBLIC_SITE_URL", "https://www.shikshamahakumbh.com"],
];

for (const [name, value] of toSet) {
  if (!value) {
    console.log(`[skip] ${name}: no local value`);
    continue;
  }
  try {
    execSync(`npx vercel env rm ${name} production --yes`, { stdio: "pipe", shell: true });
  } catch {
    /* not present */
  }
  execSync(`npx vercel env add ${name} production --value "${value.replace(/"/g, '\\"')}" --yes`, {
    stdio: "inherit",
    shell: true,
  });
  console.log(`[ok] ${name} set on production`);
}
