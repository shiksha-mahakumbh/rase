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
  {
    id: "cms-cache-purge-on-write",
    pass:
      read("src/server/services/page.service.ts").includes("purgeCmsContentCaches") &&
      read("src/server/services/notice.service.ts").includes("purgeNoticesCaches") &&
      read("src/server/services/site-settings.service.ts").includes("purgeCmsContentCaches"),
    detail: "CMS services purge ISR/cache tags after mutations",
  },
  {
    id: "seo-robots-mapping",
    pass:
      read("src/lib/seo/robots-meta.ts").includes("normalizeSeoBody") &&
      read("src/app/api/v2/admin/seo/[entityType]/[entityId]/route.ts").includes("enrichSeoForAdmin"),
    detail: "SEO admin API maps robotsIndex/Follow ↔ robots string",
  },
  {
    id: "admin-locale-selectors",
    pass:
      read("src/app/admin/cms/homepage/page.tsx").includes("AdminLocaleSelect") &&
      read("src/app/admin/cms/settings/page.tsx").includes("AdminLocaleSelect") &&
      read("src/app/admin/cms/seo/page.tsx").includes("AdminLocaleSelect"),
    detail: "homepage/settings/SEO admin pages support en + hi locale",
  },
  {
    id: "admin-revision-panels",
    pass:
      read("src/app/admin/cms/pages/[id]/page.tsx").includes("AdminRevisionsPanel") &&
      read("src/components/admin/cms/NoticeEditor.tsx").includes("AdminRevisionsPanel") &&
      read("src/components/admin/cms/CommitteeEditor.tsx").includes("AdminRevisionsPanel"),
    detail: "CMS editors expose revision history UI",
  },
  {
    id: "cms-role-gating-ui",
    pass:
      read("src/components/admin/cms/AdminUi.tsx").includes("CmsReadOnlyBanner") &&
      read("src/lib/adminAuth.tsx").includes("canMutateCms"),
    detail: "Data Entry role sees read-only CMS banner + gated actions",
  },
  {
    id: "cms-dashboard-grouped",
    pass: read("src/app/admin/cms/page.tsx").includes("GROUP_ORDER"),
    detail: "CMS dashboard grouped by nav sections",
  },
  {
    id: "cms-audit-logs-ui",
    pass: fs.existsSync(path.join(src, "app/admin/cms/audit-logs/page.tsx")),
    detail: "audit logs admin page wired to v2 API",
  },
  {
    id: "admin-mutation-rate-limit",
    pass: read("src/server/lib/api-handler.ts").includes("v2-admin-mutation"),
    detail: "v2 admin mutations default to rate limiting",
  },
  {
    id: "registrations-slim-nav",
    pass: fs.existsSync(path.join(src, "components/admin/cms/AdminRegistrationsShell.tsx")),
    detail: "registration routes use slim admin shell",
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
