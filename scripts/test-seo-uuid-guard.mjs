#!/usr/bin/env node
/**
 * Verifies SEO UUID guard blocks route slugs before Prisma (no DB required).
 */
import { readFileSync } from "node:fs";

const source = readFileSync("src/server/services/seo.service.ts", "utf8");
const match = source.match(
  /const UUID_RE\s*=\s*(\/[^;]+\/i);/
);
if (!match) {
  console.error("FAIL: UUID_RE not found in seo.service.ts");
  process.exit(1);
}

const UUID_RE = eval(match[1]);
const slugs = ["noticeboard", "downloads", "contact", "about", "home"];
const validUuid = "40000000-0000-4000-8000-000000000006";

const results = [];
for (const slug of slugs) {
  const passes = UUID_RE.test(slug);
  results.push({ slug, passesGuard: !passes, wouldQueryDb: passes });
  if (passes) {
    console.error(`FAIL: slug "${slug}" would reach Prisma`);
    process.exit(1);
  }
}

if (!UUID_RE.test(validUuid)) {
  console.error("FAIL: valid UUID rejected by guard");
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      guard: "UUID_RE in seo.service.ts",
      slugTests: results,
      validUuidAccepted: true,
    },
    null,
    2
  )
);
