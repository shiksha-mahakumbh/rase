#!/usr/bin/env node
/** Smoke-test registration/admin redirects on production (read-only GET). */
const BASE = (process.argv[2] || "https://www.rase.co.in").replace(/\/$/, "");

const CASES = [
  { path: "/registration", expect: "200", finalIncludes: "/registration" },
  { path: "/accommodation", expect: "redirect", finalIncludes: "/registration" },
  { path: "/heiprojectdisplaysubmission", expect: "redirect", finalIncludes: "/registration" },
  { path: "/AllData", expect: "redirect", finalIncludes: "/admin" },
  { path: "/participantregistrationdatadekh", expect: "redirect", finalIncludes: "/admin" },
  { path: "/registration/volunteer", expect: "redirect", finalIncludes: "/registration" },
];

async function probe({ path, expect, finalIncludes }) {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  const location = res.headers.get("location") ?? "";
  const redirected = res.status >= 300 && res.status < 400;

  if (expect === "200") {
    const ok = res.status === 200;
    return { path, pass: ok, status: res.status, detail: ok ? "OK" : "Expected 200" };
  }

  const follow = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const finalUrl = follow.url;
  const pass =
    redirected &&
    (location.includes(finalIncludes) || finalUrl.includes(finalIncludes));

  return {
    path,
    pass,
    status: res.status,
    location,
    finalUrl,
    detail: pass ? "redirect OK" : "redirect mismatch",
  };
}

const results = [];
for (const c of CASES) {
  try {
    results.push(await probe(c));
  } catch (e) {
    results.push({ path: c.path, pass: false, detail: e.message });
  }
}

const pass = results.every((r) => r.pass);
console.log(JSON.stringify({ base: BASE, checkedAt: new Date().toISOString(), pass, results }, null, 2));
process.exit(pass ? 0 : 1);
