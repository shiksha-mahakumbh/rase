#!/usr/bin/env node
/**
 * Quick go-live probes for rase.co.in (or custom base URL).
 * Usage: node scripts/validate-go-live.mjs [baseUrl]
 */
const base = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "https://www.rase.co.in").replace(
  /\/$/,
  ""
);

const paths = [
  {
    name: "https-scheme",
    path: "/",
    assert: async (res) => (res.url.startsWith("https://") ? null : `final URL not HTTPS: ${res.url}`),
  },
  {
    name: "hsts-header",
    path: "/",
    assert: async (res) =>
      res.headers.get("strict-transport-security") ? null : "missing Strict-Transport-Security",
  },
  {
    name: "health-v2",
    path: "/api/v2/health",
    assert: async (res, text) => {
      if (!res.ok) return `HTTP ${res.status}`;
      try {
        const j = JSON.parse(text);
        return j.status === "ok" || j.ok === true ? null : `status=${j.status}`;
      } catch {
        return "not JSON";
      }
    },
  },
  {
    name: "sitemap",
    path: "/sitemap.xml",
    assert: async (res, text) =>
      res.ok && (text.includes("<urlset") || text.includes("<?xml")) ? null : "invalid sitemap",
  },
  {
    name: "robots",
    path: "/robots.txt",
    assert: async (res, text) =>
      res.ok && /User-agent/i.test(text) ? null : "invalid robots.txt",
  },
  {
    name: "canonical-host",
    path: "/sitemap.xml",
    assert: async (res, text) => {
      if (!res.ok) return `HTTP ${res.status}`;
      const host = new URL(base).host;
      return text.includes(host) ? null : `sitemap missing canonical host ${host}`;
    },
  },
];

async function probe({ name, path, assert }) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();
    const err = await assert(res, text);
    const ok = !err;
    console.log(`${ok ? "PASS" : "FAIL"} ${name} ${res.status} ${url}${err ? ` — ${err}` : ""}`);
    return ok;
  } catch (e) {
    console.log(`FAIL ${name} ${url} — ${e.message}`);
    return false;
  }
}

console.log(`Go-live validation: ${base}\n`);
const results = [];
for (const p of paths) {
  results.push(await probe(p));
}
const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
