/**
 * Push BREVO_SMTP_* from .env.local to Vercel Production.
 * Usage: node scripts/_set-vercel-brevo-env.mjs
 * Requires: vercel CLI logged in, BREVO vars in .env.local
 */
import dotenv from "dotenv";
import { spawnSync } from "node:child_process";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const VARS = [
  "BREVO_SMTP_HOST",
  "BREVO_SMTP_PORT",
  "BREVO_SMTP_USER",
  "BREVO_SMTP_PASS",
  "BREVO_SMTP_FROM",
];

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
    console.error(`Missing ${name} in environment (.env.local)`);
    ok = false;
    continue;
  }
  if (!addEnv(name, value)) ok = false;
}

process.exit(ok ? 0 : 1);
