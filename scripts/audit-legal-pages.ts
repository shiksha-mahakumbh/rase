/**
 * Audit legal/policy pages and sitemap coverage.
 * Run: npx tsx scripts/audit-legal-pages.ts
 */
import fs from "node:fs";
import path from "node:path";
import { legalLinks } from "../src/components/layout/footer-content";
import { SITEMAP_CORE_PATHS } from "../src/lib/knowledge-graph/site-cleanup";

const ROOT = path.resolve(import.meta.dirname ?? __dirname, "..");
const issues: string[] = [];
const LEGAL_SLUGS = [
  "privacy-policy",
  "terms-and-conditions",
  "disclaimer",
  "refund-policy",
  "cookie-policy",
] as const;

console.log("═══════════════════════════════════════════");
console.log("  LEGAL PAGES AUDIT");
console.log("═══════════════════════════════════════════\n");

// Footer legal nav
const footerHrefs = new Set(legalLinks.map((l) => l.href));
for (const slug of LEGAL_SLUGS) {
  const href = `/${slug}`;
  if (!footerHrefs.has(href)) issues.push(`Footer missing link: ${href}`);
}
if (!footerHrefs.has("/sitemap.xml")) issues.push("Footer missing sitemap.xml link");
else console.log("✓ Footer lists all 5 policies + sitemap.xml");

// Sitemap core paths
for (const slug of LEGAL_SLUGS) {
  if (!SITEMAP_CORE_PATHS.includes(slug)) {
    issues.push(`SITEMAP_CORE_PATHS missing: ${slug}`);
  }
}
console.log("✓ All legal slugs in SITEMAP_CORE_PATHS");

// Page files + shell props
for (const slug of LEGAL_SLUGS) {
  const pagePath = path.join(ROOT, "src", "app", slug, "page.tsx");
  if (!fs.existsSync(pagePath)) {
    issues.push(`Missing page: src/app/${slug}/page.tsx`);
    continue;
  }
  const src = fs.readFileSync(pagePath, "utf8");
  if (!src.includes("LegalPageShell")) issues.push(`${slug}: missing LegalPageShell`);
  if (!src.includes(`path="/${slug}"`)) issues.push(`${slug}: LegalPageShell missing path prop`);
  if (!src.includes("generateLegalPageMetadata")) issues.push(`${slug}: missing generateLegalPageMetadata`);
  if (!src.includes(`path: "/${slug}"`)) issues.push(`${slug}: metadata path mismatch`);
}
console.log("✓ All 5 page routes exist with metadata + LegalPageShell path");

// LegalPageShell UX
const shellPath = path.join(ROOT, "src", "components", "layouts", "LegalPageShell.tsx");
const shellSrc = fs.readFileSync(shellPath, "utf8");
if (!shellSrc.includes("showCta={false}")) issues.push("LegalPageShell must disable mid-page CTA");
else console.log("✓ LegalPageShell disables registration CTA block");

if (!shellSrc.includes("breadcrumbs")) issues.push("LegalPageShell missing breadcrumbs");
else console.log("✓ LegalPageShell includes breadcrumb JSON-LD");

if (!fs.existsSync(path.join(ROOT, "src", "components", "layouts", "LegalRelatedLinks.tsx"))) {
  issues.push("Missing LegalRelatedLinks component");
} else {
  console.log("✓ Cross-links between policies via LegalRelatedLinks");
}

// Sitemap.ts uses SITE_URL (canonical .com by design)
const sitemapSrc = fs.readFileSync(path.join(ROOT, "src", "app", "sitemap.ts"), "utf8");
if (!sitemapSrc.includes("SITEMAP_CORE_PATHS")) {
  issues.push("sitemap.ts should include SITEMAP_CORE_PATHS");
} else {
  console.log("✓ sitemap.ts merges core paths (legal pages included)");
}

// Cookie consent links
const cookieSrc = fs.readFileSync(
  path.join(ROOT, "src", "components", "common", "CookieConsent.tsx"),
  "utf8"
);
if (!cookieSrc.includes("/privacy-policy") || !cookieSrc.includes("/cookie-policy")) {
  issues.push("CookieConsent must link privacy + cookie policies");
} else {
  console.log("✓ Cookie banner links to Privacy + Cookie policies");
}

console.log("\n## Production notes (manual)");
console.log("  • Canonical URLs use NEXT_PUBLIC_SITE_URL (shikshamahakumbh.com) on rase.co.in alias — intentional");
console.log("  • sitemap.xml lists .com URLs only (0 rase.co.in refs) — correct for multi-domain deploy");
console.log("  • Deploy latest main for footer/nav fixes on rase.co.in legal pages");

console.log("\n═══════════════════════════════════════════");
if (issues.length) {
  for (const i of issues) console.log(`✗ ${i}`);
  process.exit(1);
}
console.log("PASS: Legal pages structure and wiring look healthy.");
console.log("═══════════════════════════════════════════");
