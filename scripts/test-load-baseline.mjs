#!/usr/bin/env node
/**
 * Lightweight load baseline — concurrent health probes (no external tooling).
 * Usage: node scripts/test-load-baseline.mjs [baseUrl]
 * Env: LOAD_TEST_BASE_URL, LOAD_TEST_CONCURRENCY (default 20)
 */
const base = (process.argv[2] || process.env.LOAD_TEST_BASE_URL || "").replace(/\/$/, "");
const concurrency = Number(process.env.LOAD_TEST_CONCURRENCY || 20);
const timeoutMs = Number(process.env.LOAD_TEST_TIMEOUT_MS || 8000);

if (!base) {
  console.log("SKIP load baseline — pass base URL or set LOAD_TEST_BASE_URL");
  process.exit(0);
}

const url = `${base}/api/v2/health`;

async function probe(index) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = performance.now();
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();
    const elapsed = Math.round(performance.now() - started);
    if (!res.ok) {
      return { index, ok: false, elapsed, detail: `HTTP ${res.status}` };
    }
    try {
      const payload = JSON.parse(text);
      const healthy = payload.status === "ok" || payload.ok === true;
      return {
        index,
        ok: healthy,
        elapsed,
        detail: healthy ? "ok" : "unexpected payload",
      };
    } catch {
      return { index, ok: false, elapsed, detail: "invalid JSON" };
    }
  } catch (error) {
    return {
      index,
      ok: false,
      elapsed: Math.round(performance.now() - started),
      detail: error instanceof Error ? error.message : "request failed",
    };
  } finally {
    clearTimeout(timer);
  }
}

console.log(`Load baseline: ${concurrency} concurrent GET ${url}\n`);
const results = await Promise.all(
  Array.from({ length: concurrency }, (_, index) => probe(index + 1))
);

const passed = results.filter((result) => result.ok);
const failed = results.filter((result) => !result.ok);
const latencies = passed.map((result) => result.elapsed).sort((a, b) => a - b);
const p95 = latencies[Math.max(0, Math.ceil(latencies.length * 0.95) - 1)] ?? 0;

for (const result of results) {
  console.log(
    `${result.ok ? "PASS" : "FAIL"} probe-${result.index} ${result.elapsed}ms — ${result.detail}`
  );
}

console.log(
  `\n${passed.length}/${results.length} succeeded` +
    (latencies.length ? `; p95 latency ${p95}ms` : "")
);

if (failed.length > 0) {
  process.exit(1);
}
