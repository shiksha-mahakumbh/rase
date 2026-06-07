#!/usr/bin/env node
/**
 * Production smoke tests — rase.co.in
 * Usage: node scripts/production-smoke-test.mjs [baseUrl]
 */
const base = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "https://www.rase.co.in").replace(
  /\/$/,
  ""
);

const tests = [
  {
    name: "health-json",
    path: "/api/health",
    assert: async (res, text) => {
      if (!res.ok) return `HTTP ${res.status}`;
      try {
        const j = JSON.parse(text);
        return j.status === "ok" ? null : `status=${j.status}`;
      } catch {
        return "not JSON";
      }
    },
  },
  {
    name: "robots-txt",
    path: "/robots.txt",
    assert: async (_res, text) =>
      /User-agent/i.test(text) ? null : "missing User-agent",
  },
  {
    name: "sitemap-xml",
    path: "/sitemap.xml",
    assert: async (_res, text) =>
      text.includes("<urlset") || text.includes("<?xml") ? null : "not XML urlset",
  },
  {
    name: "homepage",
    path: "/",
    assert: async (res, text) =>
      res.ok && text.includes("Shiksha") ? null : "homepage content missing",
  },
  {
    name: "registration",
    path: "/registration",
    assert: async (res, text) =>
      res.ok && /registration|Register/i.test(text) ? null : "registration page missing",
  },
  {
    name: "registration-success",
    path: "/registration/success",
    assert: async (res) => (res.ok ? null : `HTTP ${res.status}`),
  },
  {
    name: "knowledge-hub",
    path: "/knowledge",
    assert: async (res, text) =>
      res.ok && /knowledge|Knowledge/i.test(text) ? null : "knowledge hub missing",
  },
  {
    name: "introduction",
    path: "/introduction",
    assert: async (res) => (res.ok ? null : `HTTP ${res.status}`),
  },
  {
    name: "locale-hi-registration",
    path: "/hi/registration",
    assert: async (res, text) =>
      res.ok && text.length > 500 ? null : `HTTP ${res.status} or empty`,
  },
  {
    name: "admin-page",
    path: "/admin",
    assert: async (res, text) =>
      res.ok && /admin|sign|google/i.test(text) ? null : "admin entry missing",
  },
];

async function runOne(test) {
  const url = `${base}${test.path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();
    const err = await test.assert(res, text);
    const ok = !err;
    console.log(`${ok ? "PASS" : "FAIL"} ${test.name} ${res.status} ${url}${err ? ` — ${err}` : ""}`);
    return ok;
  } catch (e) {
    console.log(`FAIL ${test.name} ${url} — ${e.message}`);
    return false;
  }
}

console.log(`Smoke test: ${base}\n`);
const results = [];
for (const t of tests) {
  results.push(await runOne(t));
}
const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(passed === results.length ? 0 : 1);
