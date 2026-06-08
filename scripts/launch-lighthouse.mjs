#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = (process.argv[2] || "https://www.rase.co.in").replace(/\/$/, "");
const OUT_DIR = path.resolve("docs/lighthouse/launch");
const PAGES = [
  { path: "/", name: "home" },
  { path: "/press", name: "press" },
  { path: "/media-center", name: "media-center" },
  { path: "/registration", name: "registration" },
];

fs.mkdirSync(OUT_DIR, { recursive: true });
const results = [];

for (const page of PAGES) {
  const url = `${BASE}${page.path}`;
  const jsonPath = path.join(OUT_DIR, `${page.name}.json`);
  console.log(`Auditing ${url}…`);
  spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--max-wait-for-load=120000",
      "--output=json",
      `--output-path=${jsonPath}`,
      "--quiet",
    ],
    { shell: true, stdio: "inherit" }
  );

  if (fs.existsSync(jsonPath)) {
    const j = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const c = j.categories;
    const a = j.audits;
    results.push({
      page: page.name,
      url,
      performance: Math.round((c.performance?.score ?? 0) * 100),
      accessibility: Math.round((c.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((c["best-practices"]?.score ?? 0) * 100),
      seo: Math.round((c.seo?.score ?? 0) * 100),
      lcp: a["largest-contentful-paint"]?.displayValue,
      tbt: a["total-blocking-time"]?.displayValue,
      cls: a["cumulative-layout-shift"]?.displayValue,
      bootup: a["bootup-time"]?.displayValue,
      unusedJs: a["unused-javascript"]?.displayValue,
    });
  } else {
    results.push({ page: page.name, url, error: "audit failed" });
  }
}

const summaryPath = path.join(OUT_DIR, "summary.json");
fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
console.log(`\nWrote ${summaryPath}`);
console.log(JSON.stringify(results, null, 2));
