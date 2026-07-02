#!/usr/bin/env node
/**
 * Writes docs/go-live/VERIFICATION_REPORT.json from live production probes.
 * Usage: node scripts/generate-go-live-report.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repo = path.resolve(".");
const base = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "https://www.rase.co.in").replace(
  /\/$/,
  ""
);
const outPath = path.join(repo, "docs/go-live/VERIFICATION_REPORT.json");

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: base,
  gitSha: spawnSync("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" }).stdout?.trim() ?? null,
  probes: {},
};

async function fetchJson(url) {
  const res = await fetch(url, { redirect: "follow" });
  return { status: res.status, ok: res.ok, body: await res.json().catch(() => null) };
}

report.probes.status = await fetchJson(`${base}/api/v2/status`);
report.probes.health = await fetchJson(`${base}/api/v2/health`);

const summaryPath = path.join(repo, "docs/lighthouse/live/latest-summary.json");
if (fs.existsSync(summaryPath)) {
  report.lighthouse = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(`Wrote ${outPath}`);
