#!/usr/bin/env node
/**
 * Remove legacy Firebase environment variables from Vercel.
 * Requires: `npx vercel login` and project linked (`npx vercel link`).
 *
 * Usage:
 *   node scripts/cleanup-vercel-firebase-env.mjs           # dry-run (default)
 *   node scripts/cleanup-vercel-firebase-env.mjs --apply   # remove vars
 */
import { execSync } from "node:child_process";

const APPLY = process.argv.includes("--apply");
const ENVS = ["production", "preview", "development"];

const LEGACY_KEYS = [
  "FIREBASE_SERVICE_ACCOUNT_JSON",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_SA_PATH",
  "VISITOR_COUNTER_USE_FIRESTORE",
];

function run(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], shell: true }).trim();
}

function vercelEnvLs(target) {
  try {
    return run(`npx vercel env ls ${target}`);
  } catch (e) {
    return e.stdout?.toString?.() ?? e.message ?? "";
  }
}

function keyPresent(listOutput, key) {
  return new RegExp(`\\b${key}\\b`, "m").test(listOutput);
}

function removeKey(target, key) {
  run(`npx vercel env rm ${key} ${target} --yes`);
}

console.log(APPLY ? "Mode: APPLY (will remove vars)\n" : "Mode: DRY-RUN (pass --apply to remove)\n");

let linked = true;
try {
  const who = run("npx vercel whoami");
  console.log(`Vercel account: ${who}`);
} catch {
  linked = false;
  console.error("Not logged in. Run: npx vercel login");
}

const report = { checkedAt: new Date().toISOString(), environments: {}, apply: APPLY };

for (const target of ENVS) {
  const listing = linked ? vercelEnvLs(target) : "";
  const found = LEGACY_KEYS.filter((key) => keyPresent(listing, key));
  const regBackendFirebase = /REGISTRATION_BACKEND/.test(listing) && /firebase/i.test(listing);

  report.environments[target] = {
    legacyKeysFound: found,
    registrationBackendFirebase: regBackendFirebase,
    action: [],
  };

  console.log(`\n=== ${target.toUpperCase()} ===`);
  if (!linked) {
    console.log("(skipped — not authenticated)");
    continue;
  }

  if (found.length === 0 && !regBackendFirebase) {
    console.log("No legacy Firebase vars found.");
    continue;
  }

  for (const key of found) {
    console.log(`Found: ${key}`);
    report.environments[target].action.push(`remove ${key}`);
    if (APPLY) {
      try {
        removeKey(target, key);
        console.log(`  removed ${key}`);
      } catch (e) {
        console.error(`  failed ${key}:`, e.stderr?.toString?.() || e.message);
      }
    }
  }

  if (regBackendFirebase) {
    console.log("Found: REGISTRATION_BACKEND=firebase (recommend remove or set to supabase in dashboard)");
    report.environments[target].action.push("fix REGISTRATION_BACKEND");
    if (APPLY) {
      try {
        removeKey(target, "REGISTRATION_BACKEND");
        run(
          `npx vercel env add REGISTRATION_BACKEND ${target} --value supabase --yes`
        );
        console.log("  set REGISTRATION_BACKEND=supabase");
      } catch (e) {
        console.error("  failed REGISTRATION_BACKEND:", e.stderr?.toString?.() || e.message);
      }
    }
  }
}

console.log("\n" + JSON.stringify(report, null, 2));

if (!APPLY && linked) {
  console.log("\nTo apply removals: node scripts/cleanup-vercel-firebase-env.mjs --apply");
}
