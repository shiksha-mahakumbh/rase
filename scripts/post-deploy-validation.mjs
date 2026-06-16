#!/usr/bin/env node
/**
 * Post-deploy production validation — Shiksha Mahakumbh
 * Usage: node scripts/post-deploy-validation.mjs [baseUrl]
 */
const BASE = (process.argv[2] || "https://www.shikshamahakumbh.com").replace(/\/$/, "");
const results = [];

function record(phase, name, ok, evidence) {
  results.push({ phase, name, ok, evidence });
  console.log(`${ok ? "PASS" : "FAIL"} [${phase}] ${name}`);
  if (evidence) console.log(`       → ${evidence}`);
}

async function timedFetch(url, init = {}) {
  const start = performance.now();
  const res = await fetch(url, { ...init, redirect: "follow" });
  const ms = Math.round(performance.now() - start);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* ignore */
  }
  return { res, text, json, ms };
}

async function securityTests() {
  const cases = [
    {
      name: "admin registrations unauthenticated → 401",
      url: `${BASE}/api/admin/gateway/registrations`,
      method: "GET",
      expectStatus: 401,
    },
    {
      name: "admin stats unauthenticated → 401",
      url: `${BASE}/api/admin/gateway/stats`,
      method: "GET",
      expectStatus: 401,
    },
    {
      name: "webhook without signature → 401/400",
      url: `${BASE}/api/payments/razorpay-webhook`,
      method: "POST",
      body: "{}",
      expectStatus: [400, 401, 403],
    },
    {
      name: "submit empty body → 400",
      url: `${BASE}/api/registration/submit`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      expectStatus: 400,
    },
    {
      name: "create-order fee mismatch → 400",
      url: `${BASE}/api/payments/create-order`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 1,
        currency: "INR",
        notes: {
          registrationType: "Projects",
          category: "School Student",
          email: "security-test@example.com",
          amount: "200",
        },
      }),
      expectStatus: 400,
    },
  ];

  for (const c of cases) {
    try {
      const { res, json, ms } = await timedFetch(c.url, {
        method: c.method,
        headers: c.headers,
        body: c.body,
      });
      const expected = Array.isArray(c.expectStatus) ? c.expectStatus : [c.expectStatus];
      const ok = expected.includes(res.status);
      record(
        "security",
        c.name,
        ok,
        `HTTP ${res.status} (${ms}ms) body=${JSON.stringify(json ?? "").slice(0, 120)}`
      );
    } catch (e) {
      record("security", c.name, false, e.message);
    }
  }
}

async function pageTests() {
  const pages = [
    { name: "registration page", path: "/registration" },
    { name: "registration success page", path: "/registration/success" },
    { name: "health", path: "/api/health" },
    { name: "admin entry", path: "/admin" },
  ];
  const timings = [];

  for (const p of pages) {
    try {
      const { res, text, json, ms } = await timedFetch(`${BASE}${p.path}`);
      timings.push({ path: p.path, ms });
      let ok = res.ok;
      let evidence = `HTTP ${res.status}, ${ms}ms`;
      if (p.path === "/registration") {
        ok = ok && /registration|Register|category/i.test(text);
        evidence += ok ? ", registration UI present" : ", content check failed";
      }
      if (p.path === "/api/health") {
        ok = json?.status === "ok";
        evidence += ` status=${json?.status ?? "n/a"}`;
      }
      record("performance", p.name, ok, evidence);
    } catch (e) {
      record("performance", p.name, false, e.message);
    }
  }

  const msList = timings.map((t) => t.ms);
  if (msList.length) {
    record(
      "performance",
      "page load summary",
      true,
      `min=${Math.min(...msList)}ms avg=${Math.round(msList.reduce((a, b) => a + b, 0) / msList.length)}ms max=${Math.max(...msList)}ms`
    );
  }
}

async function deploymentProbe() {
  try {
    const { res, text, ms } = await timedFetch(`${BASE}/registration`);
    const hasPaymentRecoveryRoute = text.includes("registration") || res.ok;
    record(
      "deployment",
      `production reachable ${BASE}`,
      res.ok,
      `HTTP ${res.status} (${ms}ms), bytes=${text.length}`
    );
    return hasPaymentRecoveryRoute;
  } catch (e) {
    record("deployment", `production reachable ${BASE}`, false, e.message);
    return false;
  }
}

async function main() {
  console.log(`\n=== Post-deploy validation: ${BASE} ===\n`);
  await deploymentProbe();
  await pageTests();
  await securityTests();

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== Summary: ${passed}/${results.length} passed ===`);
  if (failed.length) {
    console.log("Failures:");
    for (const f of failed) console.log(`  - [${f.phase}] ${f.name}: ${f.evidence}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
