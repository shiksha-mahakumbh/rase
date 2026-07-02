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

const outDir = path.resolve("docs/lighthouse/live");
fs.mkdirSync(outDir, { recursive: true });

const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
apiUrl.searchParams.set("url", `${target}/`);
apiUrl.searchParams.set("strategy", strategy);
for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
  apiUrl.searchParams.append("category", category);
}

console.log(`Lighthouse (PSI) verification: ${target} (${strategy})\n`);

let failed = 0;

try {
  const res = await fetch(apiUrl, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) {
    console.log(`FAIL psi-api HTTP ${res.status}`);
    process.exit(1);
  }

  const json = await res.json();
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

  const summaryPath = path.join(outDir, "latest-summary.json");
  fs.writeFileSync(
    summaryPath,
    JSON.stringify({ checkedAt: new Date().toISOString(), target, strategy, scores, report: outPath }, null, 2)
  );
} catch (error) {
  console.log(`FAIL psi-api — ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

process.exit(failed > 0 ? 1 : 0);
