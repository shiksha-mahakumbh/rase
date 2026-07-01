#!/usr/bin/env node
/**
 * Security checklist items 81–90 — Lighthouse, bundles, lazy loading, images, fonts, CDN, compression.
 */
import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(".");
const src = path.join(repo, "src");
const results = [];

function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

function readSrc(rel) {
  return fs.readFileSync(path.join(src, rel), "utf8");
}

function readRepo(rel) {
  return fs.readFileSync(path.join(repo, rel), "utf8");
}

function existsRepo(rel) {
  return fs.existsSync(path.join(repo, rel));
}

// 81 Lighthouse
if (existsRepo("scripts/run-lighthouse.mjs") && existsRepo("scripts/audit-site-performance.ts")) {
  pass("lighthouse_tooling", "Lighthouse runner and site performance guardrails exist");
} else {
  fail("lighthouse_tooling", "Missing lighthouse or performance audit scripts");
}

if (readRepo(".github/workflows/ci.yml").includes("audit:site-performance")) {
  pass("lighthouse_ci_guardrails", "CI runs audit:site-performance guardrails");
} else {
  fail("lighthouse_ci_guardrails", "Site performance audit not wired in CI");
}

// 82–83 Bundle / tree shaking
if (
  readRepo("next.config.js").includes("optimizePackageImports") &&
  existsRepo("scripts/analyze-bundle.mjs")
) {
  pass("bundle_tree_shaking", "optimizePackageImports configured with bundle analysis script");
} else {
  fail("bundle_tree_shaking", "Bundle optimization or analysis missing");
}

// 84 Lazy loading
if (
  readSrc("lib/perf/deferred-showcases.ts").includes("dynamic(") &&
  readSrc("components/home/HomeBelowFold.tsx").includes("dynamic(")
) {
  pass("lazy_loading_showcases", "Heavy showcases and homepage sections are code-split");
} else {
  fail("lazy_loading_showcases", "Lazy loading pattern incomplete");
}

// 85 Images
if (
  readRepo("next.config.js").includes("image/avif") &&
  !readSrc("components/content/Baton.tsx").includes('layout="fill"') &&
  readSrc("components/content/Books.tsx").includes("width={256}")
) {
  pass("images_next_api", "AVIF/WebP enabled; Baton/Books use modern next/image props");
} else {
  fail("images_next_api", "Image optimization gaps remain");
}

if (readSrc("components/media/OptimizedImage.tsx").includes("sizes")) {
  pass("images_optimized_wrapper", "OptimizedImage helper provides default sizes");
} else {
  fail("images_optimized_wrapper", "OptimizedImage helper missing");
}

// 86 Fonts
if (
  readSrc("app/layout.tsx").includes('display: "optional"') &&
  readSrc("app/layout.tsx").includes("next/font/google")
) {
  pass("fonts_self_hosted", "Root layout uses next/font with optional display");
} else {
  fail("fonts_self_hosted", "Font loading strategy incomplete");
}

// 87 Hydration
if (
  readSrc("components/home/HeroSection.tsx").includes("HeroLcpImage") &&
  !readSrc("components/home/HeroSection.tsx").includes('"use client"')
) {
  pass("hydration_server_hero", "Homepage hero is server-rendered with deferred LCP image");
} else {
  fail("hydration_server_hero", "Homepage hero hydration not optimized");
}

// 88 Memory leaks
if (
  readSrc("lib/razorpay/load-checkout-script.ts").includes("removeEventListener") &&
  readSrc("components/content/Books.tsx").includes("removeEventListener")
) {
  pass("memory_listener_cleanup", "Script and resize listeners clean up on reuse/unmount");
} else {
  fail("memory_listener_cleanup", "Listener cleanup gaps");
}

// 89 CDN
if (
  readRepo("next.config.js").includes("remotePatterns") &&
  readRepo("next.config.js").includes("supabase.co")
) {
  pass("cdn_remote_images", "next/image remotePatterns include Supabase CDN");
} else {
  fail("cdn_remote_images", "CDN remote image patterns missing");
}

// 90 Compression
if (
  readRepo("package.json").includes("compress:public") &&
  readRepo(".github/workflows/ci.yml").includes("compress:public")
) {
  pass("compression_build_pipeline", "Public asset compression runs in build and CI");
} else {
  fail("compression_build_pipeline", "Compression pipeline incomplete");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(`\nPhase 6 performance checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const r of results) {
  console.log(`${r.status === "PASS" ? "✓" : "✗"} ${r.test}: ${r.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
