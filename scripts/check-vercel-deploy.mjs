#!/usr/bin/env node
/**
 * Fail CI when a main push has no GitHub Production deployment within the wait window.
 * Usage: node scripts/check-vercel-deploy.mjs [--sha=abc1234] [--wait-min=20]
 */
import { execSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const args = process.argv.slice(2);
const shaArg = args.find((a) => a.startsWith("--sha="))?.slice(6);
const waitMin = Number(args.find((a) => a.startsWith("--wait-min="))?.slice(11) ?? 20);
const repo = process.env.GITHUB_REPOSITORY ?? "shiksha-mahakumbh/rase";

function gitSha() {
  if (shaArg) return shaArg;
  return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
}

function ghJson(path) {
  return JSON.parse(execSync(`gh api "${path}"`, { encoding: "utf8" }));
}

async function main() {
  const sha = gitSha();
  const short = sha.slice(0, 7);
  const deadline = Date.now() + waitMin * 60_000;
  let attempt = 0;

  console.log(`Waiting up to ${waitMin}m for Production deployment of ${short}…`);

  while (Date.now() < deadline) {
    attempt += 1;
    const deployments = ghJson(
      `repos/${repo}/deployments?environment=Production&per_page=10`
    );
    const match = deployments.find((d) => d.sha?.startsWith(sha.slice(0, 12)) || d.sha === sha);

    if (match) {
      const statuses = ghJson(`repos/${repo}/deployments/${match.id}/statuses?per_page=5`);
      const latest = statuses[0];
      const state = latest?.state ?? "unknown";
      console.log(
        `Deployment ${match.id} state=${state} (${latest?.description ?? "no description"})`
      );

      if (state === "success") {
        console.log(`✓ Production deployment confirmed for ${short}`);
        return;
      }
      if (state === "failure" || state === "error") {
        console.error(`✗ Production deployment failed for ${short}`);
        process.exit(1);
      }
    } else {
      console.log(`Attempt ${attempt}: no Production deployment for ${short} yet`);
    }

    await sleep(30_000);
  }

  console.error(
    `✗ No successful Production deployment for ${short} within ${waitMin} minutes. ` +
      "Check Vercel Git integration or run the manual deploy workflow."
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
