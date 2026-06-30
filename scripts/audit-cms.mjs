#!/usr/bin/env node
/** CMS hardening audit — static checks for sanitize, maintenance, revisions, SEO, media URLs. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "src");

function read(rel) {
  const p = path.join(root, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
}

const checks = [
  {
    id: "cms-sanitize-module",
    pass: fs.existsSync(path.join(src, "server", "lib", "cms-sanitize.ts")),
    detail: "server/lib/cms-sanitize.ts exists",
  },
  {
    id: "page-sanitize-on-write",
    pass: /sanitizeCmsHtmlField/.test(read("src/server/services/page.service.ts")),
    detail: "page.service sanitizes content/excerpt on save",
  },
  {
    id: "notice-sanitize-on-write",
    pass: /sanitizeNoticeDescription/.test(read("src/server/services/notice.service.ts")),
    detail: "notice.service strips HTML from descriptions",
  },
  {
    id: "notice-revisions",
    pass:
      read("src/server/services/entity-revision.service.ts").includes('"notice"') &&
      fs.existsSync(path.join(src, "app/api/v2/admin/notices/[id]/revisions/route.ts")),
    detail: "notice entity revisions + admin API",
  },
  {
    id: "schema-jsonld-validation",
    pass:
      read("src/lib/seo/schema-json-ld.ts").includes("validateSchemaJsonLd") &&
      read("src/server/services/seo.service.ts").includes("validateSchemaJsonLd"),
    detail: "schemaJsonLd validated in seo.service",
  },
  {
    id: "safe-jsonld-render",
    pass: read("src/app/page.tsx").includes("safeJsonLdScriptContent"),
    detail: "homepage uses safe JSON-LD injection",
  },
  {
    id: "maintenance-middleware",
    pass:
      read("src/middleware.ts").includes("isMaintenanceMode") &&
      fs.existsSync(path.join(src, "app/maintenance/page.tsx")),
    detail: "maintenance mode enforced in middleware",
  },
  {
    id: "maintenance-probe-api",
    pass: fs.existsSync(path.join(src, "app/api/v2/settings/maintenance/route.ts")),
    detail: "edge-friendly maintenance probe route",
  },
  {
    id: "media-public-urls",
    pass: read("src/server/services/media-library.service.ts").includes("buildMediaPublicUrl"),
    detail: "media library uses stable public bucket URLs",
  },
  {
    id: "hi-homepage-fallback",
    pass: read("src/lib/cms/server.ts").includes('getPublicHomepage("en")'),
    detail: "hi locale falls back to en homepage when missing",
  },
];

let failed = 0;
console.log("CMS audit\n");
for (const c of checks) {
  const mark = c.pass ? "PASS" : "FAIL";
  if (!c.pass) failed++;
  console.log(`  [${mark}] ${c.id}: ${c.detail}`);
}
console.log(`\n${checks.length - failed}/${checks.length} passed`);
process.exit(failed ? 1 : 0);
