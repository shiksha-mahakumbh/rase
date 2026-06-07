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
  { name: "health", path: "/api/health", expectJson: true },
  { name: "sitemap", path: "/sitemap.xml", expectXml: true },
  { name: "robots", path: "/robots.txt", expectText: true },
];

async function probe({ name, path, expectJson, expectXml, expectText }) {
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();
    const snippet = text.slice(0, 120).replace(/\s+/g, " ");
    let bodyOk = true;
    let note = "";

    if (expectJson) {
      try {
        const j = JSON.parse(text);
        bodyOk = j.status === "ok";
        if (!bodyOk) note = `JSON status=${j.status}`;
      } catch {
        bodyOk = false;
        note = "Response is not JSON (deploy /api/health or check routing)";
      }
    } else if (expectXml) {
      bodyOk = text.includes("<urlset") || text.includes("<?xml");
      if (!bodyOk) note = "Expected XML sitemap";
    } else if (expectText) {
      bodyOk = /User-agent/i.test(text) || /Sitemap/i.test(text);
      if (!bodyOk) note = "Expected robots.txt directives";
    }

    const ok = res.ok && bodyOk;
    console.log(`${ok ? "PASS" : "FAIL"} ${name} ${res.status} ${url}${note ? ` — ${note}` : ""}`);
    if (!ok && snippet) console.log(`  snippet: ${snippet}…`);
    return ok;
  } catch (e) {
    console.log(`FAIL ${name} ${url} — ${e.message}`);
    return false;
  }
}

console.log(`Go-live validation: ${base}\n`);
const results = await Promise.all(paths.map(probe));
const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
