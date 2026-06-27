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
    name: "health-v2",
    path: "/api/v2/health",
    assert: async (res, text) => {
      if (!res.ok) return `HTTP ${res.status}`;
      try {
        const j = JSON.parse(text);
        return j.status === "ok" || j.ok === true ? null : `unexpected payload`;
      } catch {
        return "not JSON";
      }
    },
  },
  {
    name: "health-legacy",
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
    name: "publications-hub",
    path: "/publications",
    assert: async (res) => (res.ok ? null : `HTTP ${res.status}`),
  },
  {
    name: "academic-council",
    path: "/departments/academic-council",
    assert: async (res, text) =>
      res.ok && /Academic Council|Conference/i.test(text) ? null : "AC page missing",
  },
  {
    name: "introduction",
    path: "/introduction",
    assert: async (res) => (res.ok ? null : `HTTP ${res.status}`),
  },
  {
    name: "faq",
    path: "/faq",
    assert: async (res, text) =>
      res.ok && /faq|question|answer|सामान्य/i.test(text) ? null : `HTTP ${res.status}`,
  },
  {
    name: "locale-hi-home",
    path: "/hi",
    assert: async (res, text) =>
      res.ok && text.length > 500 ? null : `HTTP ${res.status} or empty`,
  },
  {
    name: "locale-hi-introduction",
    path: "/hi/introduction",
    assert: async (res, text) =>
      res.ok && text.length > 500 ? null : `HTTP ${res.status} or empty`,
  },
  {
    name: "locale-hi-registration",
    path: "/hi/registration",
    assert: async (res, text) =>
      res.ok && text.length > 500 ? null : `HTTP ${res.status} or empty`,
  },
  {
    name: "locale-hi-contact",
    path: "/hi/contact-us",
    assert: async (res, text) =>
      res.ok && /contact|संपर्क|Get in Touch/i.test(text)
        ? null
        : `HTTP ${res.status}`,
  },
  {
    name: "newsletter-api",
    path: "/api/v2/newsletter/subscribe",
    method: "OPTIONS",
    assert: async (res) =>
      res.status === 204 || res.status === 405 || res.ok ? null : `HTTP ${res.status}`,
  },
  {
    name: "admin-entry",
    path: "/admin",
    assert: async (res, text) =>
      res.ok && /admin|sign|password|email/i.test(text) ? null : "admin entry missing",
  },
];

async function runOne(test) {
  const url = `${base}${test.path}`;
  try {
    const res = await fetch(url, {
      method: test.method ?? "GET",
      redirect: "follow",
    });
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
