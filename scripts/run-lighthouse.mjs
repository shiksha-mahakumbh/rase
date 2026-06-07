import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.LH_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve("docs/lighthouse/p3b");
const PAGES = [
  { path: "/", name: "home" },
  { path: "/past-events", name: "past-events" },
  { path: "/media-center", name: "media-center" },
  { path: "/contact-us", name: "contact-us" },
  { path: "/departments/academic-council", name: "academic-council" },
  { path: "/committees", name: "committees" },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const results = [];

for (const page of PAGES) {
  const url = `${BASE}${page.path}`;
  const jsonPath = path.join(OUT_DIR, `${page.name}.json`);
  const htmlPath = path.join(OUT_DIR, `${page.name}.html`);

  console.log(`Auditing ${url}…`);
  const r = spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--max-wait-for-load=90000",
      `--output=json`,
      `--output-path=${jsonPath}`,
      "--quiet",
    ],
    { shell: true, stdio: "inherit" }
  );

  spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--max-wait-for-load=90000",
      `--output=html`,
      `--output-path=${htmlPath}`,
      "--quiet",
    ],
    { shell: true, stdio: "ignore" }
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
      fcp: a["first-contentful-paint"]?.displayValue,
      cls: a["cumulative-layout-shift"]?.displayValue,
      tbt: a["total-blocking-time"]?.displayValue,
    });
  } else {
    results.push({ page: page.name, url, error: "audit failed" });
  }
}

const summaryPath = path.join(OUT_DIR, "summary.json");
fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
console.log(`\nWrote ${summaryPath}`);
console.log(JSON.stringify(results, null, 2));
