#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = fs.readFileSync(path.join(root, "src/app/sitemap.ts"), "utf8");

function extractArray(name) {
  const re = new RegExp(`const ${name} = \\[([\\s\\S]*?)\\] as const;`);
  const m = src.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

const paths = new Set();
const staticBlock = src.match(/const STATIC_PATHS = \[([\s\S]*?)\];/)?.[1] ?? "";
for (const m of staticBlock.matchAll(/"([^"]+)"/g)) paths.add(m[1]);

for (const spread of staticBlock.matchAll(/\.\.\.([A-Z_]+)/g)) {
  const arr = extractArray(spread[1]);
  arr.forEach((p) => paths.add(p));
}

// PILLAR_PATHS is derived — approximate from ALL_PILLAR_SLUGS file
const pillarSrc = fs.readFileSync(path.join(root, "src/lib/knowledge-graph/pillar-registry.ts"), "utf8");
const slugs = [...pillarSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const overrides = { media: "media-center" };
slugs.forEach((s) => paths.add(overrides[s] ?? s));

// MEDIA_ARCHIVE_KEYS
const mediaKeys = fs.readFileSync(path.join(root, "src/data/media-archive-keys.ts"), "utf8");
const keys = [...mediaKeys.matchAll(/"([^"]+\/[^"]+\/[^"]+)"/g)].map((m) => {
  const [edition, year, type] = m[1].split("/");
  return `media/${edition}/${year}/${type}`;
});
keys.forEach((p) => paths.add(p));

// PRESS paths
const pressSrc = fs.readFileSync(path.join(root, "src/constants/canonical-routes.ts"), "utf8");
const pressPaths = [...pressSrc.matchAll(/:\s*"(\/press\/[^"]+)"/g)].map((m) => m[1].replace(/^\//, ""));
pressPaths.forEach((p) => paths.add(p));

console.log(JSON.stringify({
  count: paths.size,
  hasGlimpses: paths.has("glimpses"),
  hasAccommodation: paths.has("accommodation"),
  hasComingSoon: paths.has("coming-soon"),
}, null, 2));
