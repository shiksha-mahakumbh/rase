/**
 * Push SMTP_* from .env / .env.local to Vercel Production.
 * Usage: node scripts/_set-vercel-smtp-env.mjs
 */
import dotenv from "dotenv";
import { spawnSync } from "node:child_process";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const VARS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"];

function addEnv(name, value) {
  const result = spawnSync("npx", ["vercel", "env", "add", name, "production", "--force"], {
    input: value,
    encoding: "utf8",
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    console.error(`Failed ${name}:`, result.stderr || result.stdout);
    return false;
  }
  console.log(`Set ${name} on Vercel Production`);
  return true;
}

let ok = true;
for (const name of VARS) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name} in environment (.env / .env.local)`);
    ok = false;
    continue;
  }
  if (!addEnv(name, value)) ok = false;
}

process.exit(ok ? 0 : 1);
