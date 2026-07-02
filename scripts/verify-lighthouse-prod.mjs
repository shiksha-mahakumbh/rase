#!/usr/bin/env node
/**
 * Live Lighthouse via PageSpeed Insights API (no local Chrome required).
 * Usage: node scripts/verify-lighthouse-prod.mjs [url]
 */
import fs from "node:fs";
import path from "node:path";

const target = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "https://www.rase.co.in").replace(
  /\/$/,
  ""
);
const minPerf = Number(process.env.MIN_LIGHTHOUSE_PERF ?? "85");
const minA11y = Number(process.env.MIN_LIGHTHOUSE_A11Y ?? "90");
const minSeo = Number(process.env.MIN_LIGHTHOUSE_SEO ?? "90");
const strategy = process.env.LH_STRATEGY ?? "mobile";
const maxAgeHours = Number(process.env.LH_CACHE_MAX_AGE_HOURS ?? "168");

const outDir = path.resolve("docs/lighthouse/live");
const summaryPath = path.join(outDir, "latest-summary.json");
fs.mkdirSync(outDir, { recursive: true });

function buildApiUrl() {
  const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  apiUrl.searchParams.set("url", `${target}/`);
  apiUrl.searchParams.set("strategy", strategy);
  for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
    apiUrl.searchParams.append("category", category);
  }
  return apiUrl;
}

function readCachedSummary() {
  if (!fs.existsSync(summaryPath)) return null;
  try {
    const cached = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
    if (!cached?.checkedAt || !cached?.scores) return null;
    const ageMs = Date.now() - new Date(cached.checkedAt).getTime();
    if (ageMs > maxAgeHours * 60 * 60 * 1000) return null;
    return cached;
  } catch {
    return null;
  }
}

function evaluateScores(scores) {
  let failed = 0;
  if (scores.performance >= minPerf) {
    console.log(`PASS performance >= ${minPerf}`);
  } else {
    console.log(`FAIL performance ${scores.performance} < ${minPerf}`);
    failed += 1;
  }
  if (scores.accessibility >= minA11y) {
    console.log(`PASS accessibility >= ${minA11y}`);
  } else {
    console.log(`FAIL accessibility ${scores.accessibility} < ${minA11y}`);
    failed += 1;
  }
  if (scores.seo >= minSeo) {
    console.log(`PASS seo >= ${minSeo}`);
  } else {
    console.log(`FAIL seo ${scores.seo} < ${minSeo}`);
    failed += 1;
  }
  return failed;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPsiWithRetry() {
  const delays = [0, 8_000, 20_000, 45_000];
  let lastStatus = 0;

  for (let attempt = 0; attempt < delays.length; attempt += 1) {
    if (delays[attempt] > 0) {
      console.log(`PSI rate limited — retrying in ${delays[attempt] / 1000}s…`);
      await sleep(delays[attempt]);
    }

    const res = await fetch(buildApiUrl(), { signal: AbortSignal.timeout(120_000) });
    lastStatus = res.status;
    if (res.status === 429) {
      continue;
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  }

  throw new Error(`HTTP ${lastStatus}`);
}

console.log(`Lighthouse (PSI) verification: ${target} (${strategy})\n`);

if (process.env.SKIP_LIGHTHOUSE_VERIFY === "1") {
  console.log("SKIP lighthouse — SKIP_LIGHTHOUSE_VERIFY=1");
  process.exit(0);
}

let failed = 0;

try {
  const json = await fetchPsiWithRetry();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(outDir, `psi-${strategy}-${stamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2));

  const categories = json.lighthouseResult?.categories ?? {};
  const scores = {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
  };

  console.log(`Scores: perf=${scores.performance} a11y=${scores.accessibility} bp=${scores.bestPractices} seo=${scores.seo}`);
  console.log(`Report: ${outPath}\n`);

  failed = evaluateScores(scores);

  fs.writeFileSync(
    summaryPath,
    JSON.stringify({ checkedAt: new Date().toISOString(), target, strategy, scores, report: outPath }, null, 2)
  );
} catch (error) {
  const cached = readCachedSummary();
  if (cached?.scores) {
    console.log(
      `WARN PSI unavailable (${error instanceof Error ? error.message : String(error)}) — using cached summary from ${cached.checkedAt}`
    );
    failed = evaluateScores(cached.scores);
    if (failed === 0) {
      console.log("PASS lighthouse (cached PSI summary)");
    }
  } else {
    console.log(`FAIL psi-api — ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

process.exit(failed > 0 ? 1 : 0);
