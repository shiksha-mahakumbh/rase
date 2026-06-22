#!/usr/bin/env node
/**
 * Phase 6 — internal link audit after site cleanup.
 * Usage: node scripts/audit-internal-links.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");

function read(file) {
  return fs.readFileSync(path.join(src, file), "utf8");
}

/** Parse string[] export from site-cleanup / content-map (simple regex) */
function extractQuotedPaths(source, arrayName) {
  const re = new RegExp(`${arrayName}[\\s\\S]*?=\\s*\\[([\\s\\S]*?)\\];`);
  const m = source.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/path:\s*"([^"]+)"/g)].map((x) => x[1]);
}

function extractSetPaths(source, setName) {
  const re = new RegExp(`export const ${setName}[\\s\\S]*?= new Set\\(\\[([\\s\\S]*?)\\]\\)`);
  const m = source.match(re);
  if (!m) return new Set();
  const items = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  return new Set(items);
}

function extractHrefFromCurated(source) {
  return [...source.matchAll(/href:\s*"([^"]+)"/g)].map((x) => x[1]);
}

const cleanup = read("lib/knowledge-graph/site-cleanup.ts");
const contentMap = read("lib/knowledge-graph/content-map.ts");

const blocked = extractSetPaths(cleanup, "BLOCKED_RELATED_LINK_PATHS");
const redirectShells = extractSetPaths(cleanup, "REDIRECT_SHELL_PATHS");
const sitemapCore = new Set(
  [...cleanup.matchAll(/SITEMAP_CORE_PATHS[\s\S]*?"([^"]+)"/g)].map((x) => x[1])
);

const contentPaths = extractQuotedPaths(contentMap, "CONTENT_MAP");
const curatedHrefs = extractHrefFromCurated(cleanup);
const educationHubHrefs = extractHrefFromCurated(
  cleanup.slice(cleanup.indexOf("EDUCATION_HUB_PROGRAMME_LINKS"))
);

const issues = [];

function checkLink(href, source) {
  if (!href.startsWith("/") && !href.startsWith("http")) return;
  if (href.startsWith("http")) return;
  if (blocked.has(href)) {
    issues.push({ severity: "error", source, href, message: "blocked related-link path" });
  }
  if (redirectShells.has(href.replace(/^\//, ""))) {
    issues.push({ severity: "error", source, href, message: "redirect shell (should not be linked)" });
  }
}

for (const p of contentPaths) {
  if (p.startsWith("http")) continue;
  checkLink(p, "content-map");
  if (redirectShells.has(p.replace(/^\//, ""))) {
    issues.push({ severity: "error", source: "content-map", href: p, message: "redirect shell in CONTENT_MAP" });
  }
}

for (const href of curatedHrefs) checkLink(href, "curated-links");
for (const href of educationHubHrefs) checkLink(href, "education-hub");

const sitemapExcluded = extractSetPaths(cleanup, "SITEMAP_EXCLUDED_PATHS");
for (const p of sitemapCore) {
  if (sitemapExcluded.has(p)) {
    issues.push({
      severity: "warn",
      source: "sitemap",
      href: `/${p}`,
      message: "in SITEMAP_CORE but also SITEMAP_EXCLUDED",
    });
  }
}

console.log("Internal link audit (Phase 6)");
console.log("─".repeat(50));
console.log(`Content map entries: ${contentPaths.length}`);
console.log(`Curated hrefs scanned: ${curatedHrefs.length}`);
console.log(`Sitemap core paths: ${sitemapCore.size}`);
console.log(`Redirect shells: ${redirectShells.size}`);
console.log("");

if (issues.length === 0) {
  console.log("PASS — no blocked or redirect-shell links in curated graph.");
  process.exit(0);
}

const errors = issues.filter((i) => i.severity === "error");
const warns = issues.filter((i) => i.severity === "warn");

for (const i of errors) {
  console.log(`ERROR [${i.source}] ${i.href} — ${i.message}`);
}
for (const i of warns) {
  console.log(`WARN  [${i.source}] ${i.href} — ${i.message}`);
}

console.log("");
console.log(`Result: ${errors.length} error(s), ${warns.length} warning(s)`);
process.exit(errors.length > 0 ? 1 : 0);
