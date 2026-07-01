#!/usr/bin/env node
/**
 * Security checklist items 63–80 — SEO metadata, sitemap, schema, redirects, SSR.
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

// 63–66 Metadata / OG / Twitter
if (
  readRepo("src/config/site.ts").includes('?? "https://www.rase.co.in"') &&
  readSrc("app/layout.tsx").includes("metadataBase")
) {
  pass("seo_site_url_canonical", "SITE_URL default matches root metadataBase domain");
} else {
  fail("seo_site_url_canonical", "SITE_URL and metadataBase domain mismatch");
}

if (
  readSrc("lib/seo/metadata.ts").includes("openGraph") &&
  readSrc("lib/seo/metadata.ts").includes("twitter") &&
  readSrc("lib/seo/metadata.ts").includes("1200")
) {
  pass("seo_og_twitter_defaults", "createPageMetadata sets OG/Twitter with 1200×630 images");
} else {
  fail("seo_og_twitter_defaults", "createPageMetadata OG/Twitter incomplete");
}

if (!readSrc("lib/seo/cms-metadata.ts").includes("`${title} | ${SITE_NAME}`")) {
  pass("seo_cms_title_no_double_suffix", "CMS metadata avoids duplicate title suffix");
} else {
  fail("seo_cms_title_no_double_suffix", "CMS metadata may double-apply title template");
}

if (readSrc("app/workshops/page.tsx").includes("createPageMetadata")) {
  pass("seo_workshops_full_metadata", "Workshops hub uses createPageMetadata with OG/Twitter");
} else {
  fail("seo_workshops_full_metadata", "Workshops page missing full metadata");
}

// 67 Canonicals
if (readSrc("app/media/layout.tsx").includes("/media-center")) {
  pass("seo_media_canonical_schema", "Media layout JSON-LD uses /media-center canonical path");
} else {
  fail("seo_media_canonical_schema", "Media layout schema URLs incorrect");
}

// 68–69 robots / sitemap
if (existsRepo("src/app/robots.ts") && existsRepo("src/app/sitemap.ts")) {
  pass("seo_robots_sitemap_routes", "Next.js robots.ts and sitemap.ts present");
} else {
  fail("seo_robots_sitemap_routes", "Missing robots.ts or sitemap.ts");
}

const siteCleanup = readSrc("lib/knowledge-graph/site-cleanup.ts");
if (siteCleanup.includes('"partners"') && !siteCleanup.includes('"registration/success"')) {
  pass("seo_sitemap_allowlist", "Sitemap includes /partners and omits noindex registration/success");
} else {
  fail("seo_sitemap_allowlist", "Sitemap allowlist needs partners or still lists success page");
}

if (!readSrc("server/services/seo.service.ts").includes("noticeboard#")) {
  pass("seo_sitemap_no_notice_fragments", "Sitemap avoids noticeboard fragment URLs");
} else {
  fail("seo_sitemap_no_notice_fragments", "Sitemap still emits noticeboard#slug entries");
}

// 70 hreflang
if (
  readSrc("lib/seo/hreflang.ts").includes("HREFLANG_PAIRS") &&
  readSrc("app/faq/page.tsx").includes("withHreflang")
) {
  pass("seo_hreflang_bilingual", "Hreflang helper and FAQ page bilingual metadata wiring");
} else {
  fail("seo_hreflang_bilingual", "Hreflang coverage incomplete");
}

// 71–74 Schema.org / FAQ / breadcrumbs
if (
  readSrc("app/faq/page.tsx").includes("buildFaqPageSchema") &&
  readSrc("app/faq/page.tsx").includes("application/ld+json")
) {
  pass("seo_faq_jsonld", "FAQ page emits FAQPage JSON-LD");
} else {
  fail("seo_faq_jsonld", "FAQ page missing FAQ schema");
}

if (existsRepo("src/components/seo/BreadcrumbJsonLd.tsx") && existsRepo("src/lib/seo/schema/builders.ts")) {
  pass("seo_schema_builders", "Breadcrumb and schema builders available");
} else {
  fail("seo_schema_builders", "Schema builder components missing");
}

// 75–76 Internal links / redirects
if (existsRepo("src/config/legacy-redirects.js") && readRepo("next.config.js").includes("redirects()")) {
  pass("seo_legacy_redirects", "Legacy redirects wired in next.config.js");
} else {
  fail("seo_legacy_redirects", "Legacy redirects not configured");
}

// 77 Duplicate content / redirect shells
if (
  readSrc("app/initiatives/layout.tsx").includes("createRedirectShellMetadata") &&
  readSrc("app/knowledge/layout.tsx").includes("createRedirectShellMetadata")
) {
  pass("seo_redirect_shell_noindex", "Redirect shell layouts emit noindex metadata");
} else {
  fail("seo_redirect_shell_noindex", "Redirect shells still indexable in HTML metadata");
}

if (!readSrc("app/noticeboard/layout.tsx").includes("PUBLIC_PAGE_META")) {
  pass("seo_noticeboard_single_metadata", "Noticeboard layout does not duplicate page metadata");
} else {
  fail("seo_noticeboard_single_metadata", "Noticeboard layout conflicts with generateMetadata");
}

// 78 Image SEO
if (
  readSrc("lib/seo/metadataBuilders.ts").includes("DEFAULT_OG_WIDTH") &&
  !readSrc("lib/seo/metadataBuilders.ts").includes("width: 512")
) {
  pass("seo_og_image_dimensions", "Publication/event metadata uses standard OG dimensions");
} else {
  fail("seo_og_image_dimensions", "OG images still forced to 512×512");
}

// 79–80 CWV / SSR patterns
if (
  readSrc("app/page.tsx").includes("revalidate") ||
  readRepo("src/app/page.tsx").match(/revalidate/)
) {
  pass("seo_isr_home", "Homepage uses ISR revalidate");
} else {
  fail("seo_isr_home", "Homepage missing ISR revalidate");
}

if (
  readSrc("app/noticeboard/page.tsx").includes("revalidate") &&
  readSrc("app/press/[slug]/page.tsx").includes("generateStaticParams")
) {
  pass("seo_ssg_isr_mix", "Noticeboard ISR and press SSG patterns in use");
} else {
  fail("seo_ssg_isr_mix", "SSR/SSG/ISR patterns incomplete");
}

// Admin noindex
if (
  readSrc("app/admin/layout.tsx").includes("NO_INDEX_META") &&
  readSrc("app/admin/cms/layout.tsx").includes("NO_INDEX_META")
) {
  pass("seo_admin_noindex", "Admin surfaces export noindex metadata");
} else {
  fail("seo_admin_noindex", "Admin noindex metadata missing");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(`\nPhase 5 SEO checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const r of results) {
  console.log(`${r.status === "PASS" ? "✓" : "✗"} ${r.test}: ${r.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
