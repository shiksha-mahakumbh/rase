/**
 * Audit footer links, CMS merge, and social sanitization.
 * Run: npx tsx scripts/audit-footer.ts
 */
import {
  CORE_FOOTER_LOGOS,
  FOOTER_QUICK_LINK_EXCLUDED,
  mergeFooterQuickLinks,
  programLinks,
  quickLinks,
  resolveFooterQuickLinks,
  resolveFooterSocialLinks,
} from "../src/data/default-footer";
import { resolveNavHref } from "../src/lib/security/safe-nav-url";
import { educationLinks } from "../src/components/layout/footer-content";

const issues: string[] = [];
const programHrefs = new Set(programLinks.map((l) => l.href));

console.log("═══════════════════════════════════════════");
console.log("  FOOTER AUDIT");
console.log("═══════════════════════════════════════════\n");

const resolved = resolveFooterQuickLinks(null);
for (const link of resolved) {
  if (programHrefs.has(link.href)) {
    issues.push(`Quick link duplicates programs: ${link.name} → ${link.href}`);
  }
  if (FOOTER_QUICK_LINK_EXCLUDED.has(link.href)) {
    issues.push(`Quick link should be excluded: ${link.href}`);
  }
}
if (!issues.length) console.log("✓ Quick links do not duplicate programs column");

const cmsWithNoise = resolveFooterQuickLinks({
  id: "test",
  slug: "footer",
  name: "Footer",
  menuType: "footer",
  locale: "en",
  isActive: true,
  items: [
    { id: "1", menuId: "test", label: "Privacy Policy", url: "/privacy-policy", sortOrder: 0, isExternal: false },
    { id: "2", menuId: "test", label: "Registration", url: "/registration", sortOrder: 1, isExternal: false },
    { id: "3", menuId: "test", label: "Speakers", url: "/speakers/directory", sortOrder: 2, isExternal: false },
  ],
} as never);
for (const bad of ["/privacy-policy", "/registration", "/speakers/directory"]) {
  if (cmsWithNoise.some((l) => l.href === bad)) {
    issues.push(`CMS noise not filtered from quick links: ${bad}`);
  }
}
if (!cmsWithNoise.some((l) => l.href === "/privacy-policy")) {
  console.log("✓ CMS privacy/registration/speakers filtered from quick links");
}

const hasDownloadsInPrograms = programLinks.some((l) => l.href === "/downloads");
const hasMediaInPrograms = programLinks.some((l) => l.href === "/media-center");
const hasConclave = [...quickLinks, ...programLinks].some((l) => l.href === "/conclave");
if (!hasDownloadsInPrograms) issues.push("Downloads missing from programs");
if (!hasMediaInPrograms) issues.push("Media Centre missing from programs");
if (hasConclave) issues.push("Conclaves link still in footer columns");
else console.log("✓ Downloads & Media Centre in programs; conclave removed");

if (CORE_FOOTER_LOGOS.length > 5) {
  issues.push(`Too many ecosystem logos: ${CORE_FOOTER_LOGOS.length}`);
} else {
  console.log(`✓ Ecosystem strip: ${CORE_FOOTER_LOGOS.length} logos`);
}

const logoSrcs = CORE_FOOTER_LOGOS.map((l) => l.src);
if (new Set(logoSrcs).size !== logoSrcs.length) {
  issues.push("Duplicate logo src in ecosystem strip");
} else {
  console.log("✓ No duplicate ecosystem logos");
}

const journalLink = educationLinks.find((l) => l.href.includes("pub.dhe"));
if (journalLink && !resolveNavHref(journalLink.href).external) {
  issues.push("Journals link should resolve as external");
} else {
  console.log("✓ External journals link resolves safely");
}

const social = resolveFooterSocialLinks({
  youtube: "https://www.youtube.com/@ShikshaMahakumbh",
  bad: "javascript:alert(1)",
});
if (social.length !== 1) issues.push(`Social filter failed: ${social.length}`);
else console.log("✓ Social links sanitized + labeled");

const merged = mergeFooterQuickLinks(quickLinks, [{ label: "Introduction", url: "/introduction" }]);
if (merged.length < quickLinks.length) {
  issues.push(`CMS merge shrank defaults: ${merged.length} < ${quickLinks.length}`);
}

console.log(`\n## resolveFooterQuickLinks(null): ${resolved.length} links`);

console.log("\n═══════════════════════════════════════════");
if (issues.length) {
  for (const i of issues) console.log(`✗ ${i}`);
  process.exit(1);
}
console.log("PASS: Footer defaults and merge logic look healthy.");
console.log("═══════════════════════════════════════════");
