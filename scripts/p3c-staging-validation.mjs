#!/usr/bin/env node
/**
 * P3c staging / local production validation suite.
 * Usage: node scripts/p3c-staging-validation.mjs [baseUrl]
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = (process.argv[2] || process.env.LH_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const OUT = path.resolve("docs/lighthouse/p3c");
const PAGES = [
  { path: "/", name: "home" },
  { path: "/past-events", name: "past-events" },
  { path: "/media-center", name: "media-center" },
  { path: "/contact-us", name: "contact-us" },
  { path: "/departments/academic-council", name: "academic-council" },
  { path: "/committees", name: "committees" },
];

fs.mkdirSync(OUT, { recursive: true });

const report = {
  baseUrl: BASE,
  timestamp: new Date().toISOString(),
  lighthouse: [],
  seo: {},
  links: null,
  redirects: null,
};

console.log(`P3c validation against ${BASE}\n`);

// SEO probes
for (const [name, p] of [
  ["sitemap", "/sitemap.xml"],
  ["robots", "/robots.txt"],
]) {
  try {
    const res = await fetch(`${BASE}${p}`);
    const text = await res.text();
    report.seo[name] = {
      status: res.status,
      ok: res.ok,
      urlCount: name === "sitemap" ? (text.match(/<loc>/g) || []).length : undefined,
      hasSitemapDirective: name === "robots" ? /Sitemap/i.test(text) : undefined,
    };
    console.log(`${res.ok ? "PASS" : "FAIL"} ${name} ${res.status}`);
  } catch (e) {
    report.seo[name] = { ok: false, error: e.message };
    console.log(`FAIL ${name} — ${e.message}`);
  }
}

// Lighthouse
for (const page of PAGES) {
  const url = `${BASE}${page.path}`;
  const jsonPath = path.join(OUT, `${page.name}.json`);
  console.log(`Lighthouse: ${url}`);
  spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
      "--max-wait-for-load=120000",
      `--output=json`,
      `--output-path=${jsonPath}`,
      "--quiet",
    ],
    { shell: true, stdio: "ignore" }
  );

  if (fs.existsSync(jsonPath)) {
    const j = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const c = j.categories;
    const a = j.audits;
    const row = {
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
      inp: a["interaction-to-next-paint"]?.displayValue ?? a["experimental-interaction-to-next-paint"]?.displayValue,
    };
    report.lighthouse.push(row);
    console.log(
      `  perf=${row.performance} a11y=${row.accessibility} seo=${row.seo} lcp=${row.lcp} cls=${row.cls}`
    );
  } else {
    report.lighthouse.push({ page: page.name, url, error: "audit failed" });
    console.log(`  FAIL audit`);
  }
}

// Internal links (local repo script)
const linkRes = spawnSync("node", ["scripts/verify-internal-links.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
});
try {
  report.links = JSON.parse(linkRes.stdout.trim().split("\n").pop() || "{}");
} catch {
  report.links = { error: linkRes.stderr || "parse failed" };
}
console.log(`\nLinks: ${report.links?.brokenCount ?? "?"} broken`);

// Redirect config
const redirRes = spawnSync("node", ["scripts/test-redirects.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
});
try {
  const lines = redirRes.stdout.trim().split("\n");
  report.redirects = JSON.parse(lines.slice(-10).join("\n"));
} catch {
  report.redirects = { pass: redirRes.status === 0 };
}
console.log(`Redirects: ${report.redirects?.pass ? "PASS" : "CHECK"}`);

// Go/No-Go
const targets = {
  perfMin: 85,
  a11yMin: 95,
  seoMin: 100,
};
const lhOk = report.lighthouse.filter((r) => !r.error);
const perfPass = lhOk.every((r) => r.performance >= targets.perfMin);
const a11yPass = lhOk.every((r) => r.accessibility >= targets.a11yMin);
const seoPass = lhOk.every((r) => r.seo >= targets.seoMin);
const clsPass = lhOk.every((r) => r.cls === "0" || r.cls === "0.0");
const linksPass = report.links?.brokenCount === 0;
const redirectsPass = report.redirects?.pass === true;

report.goNoGo = {
  performance: perfPass,
  accessibility: a11yPass,
  seo: seoPass,
  cls: clsPass,
  links: linksPass,
  redirects: redirectsPass,
  recommendProduction: perfPass && a11yPass && seoPass && clsPass && linksPass && redirectsPass,
};

const outPath = path.join(OUT, "staging-report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(`\nWrote ${outPath}`);
console.log(`\nGo/No-Go: ${report.goNoGo.recommendProduction ? "GO" : "NO-GO"}`);
process.exit(report.goNoGo.recommendProduction ? 0 : 1);
