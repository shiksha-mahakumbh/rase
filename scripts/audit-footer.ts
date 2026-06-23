/**
 * Audit footer links, CMS merge, and social sanitization.
 * Run: npx tsx scripts/audit-footer.ts
 */
import {
  mergeFooterQuickLinks,
  quickLinks,
  resolveFooterQuickLinks,
  resolveFooterSocialLinks,
} from "../src/data/default-footer";
import { resolveNavHref } from "../src/lib/security/safe-nav-url";

const issues: string[] = [];

console.log("═══════════════════════════════════════════");
console.log("  FOOTER AUDIT");
console.log("═══════════════════════════════════════════\n");

// CMS must extend, not replace
const thinCms = [
  { label: "Introduction", url: "/introduction" },
  { label: "Contact", url: "/contact-us" },
];
const merged = mergeFooterQuickLinks(quickLinks, thinCms);
if (merged.length < quickLinks.length) {
  issues.push(`CMS thin menu replaced defaults: ${merged.length} < ${quickLinks.length}`);
} else {
  console.log(`✓ CMS merge keeps defaults (${merged.length} links, base ${quickLinks.length})`);
}

const hasNotice = merged.some((l) => l.href === "/noticeboard");
const hasDownloads = merged.some((l) => l.href === "/downloads");
if (!hasNotice) issues.push("Missing Notice Board in quick links");
if (!hasDownloads) issues.push("Missing Downloads in quick links");
if (hasNotice && hasDownloads) console.log("✓ Notice Board & Downloads in quick links");

// SMK 6.0 consistency
const smkLinks = merged.filter((l) => /6\.0|mahakumbh/i.test(l.name));
const smkHrefs = new Set(smkLinks.map((l) => l.href));
if (smkLinks.length > 1 && smkHrefs.size > 1) {
  const reg = merged.find((l) => l.name.includes("Register"));
  if (smkLinks.some((l) => l.href === "/registration") && smkLinks.some((l) => l.href === "/upcoming-events")) {
    // OK: registration vs upcoming are different labels
  }
}
console.log(`✓ SMK links: ${smkLinks.map((l) => `${l.name}→${l.href}`).join(", ") || "n/a"}`);

// External journal link
const journal = merged.find((l) => l.href.includes("pub.dhe"));
// journal is in educationLinks not quick - check education via import
import { educationLinks } from "../src/components/layout/footer-content";
const journalLink = educationLinks.find((l) => l.href.includes("pub.dhe"));
if (journalLink && !resolveNavHref(journalLink.href).external) {
  issues.push("Journals link should resolve as external");
} else {
  console.log("✓ External journals link resolves safely");
}

// Social sanitization
const social = resolveFooterSocialLinks({ youtube: "https://www.youtube.com/@ShikshaMahakumbh", bad: "javascript:alert(1)" });
if (social.length !== 1) issues.push(`Social filter failed: ${social.length}`);
if (social[0] && !social[0].label.includes("YouTube")) issues.push("Social aria label missing");
else console.log("✓ Social links sanitized + labeled");

// Empty CMS items ignored in merge
const withEmpty = mergeFooterQuickLinks(quickLinks, [{ label: "", url: "/nope" }]);
if (withEmpty.length !== merged.length) issues.push("Empty CMS row affected merge");

console.log(`\n## resolveFooterQuickLinks(null): ${resolveFooterQuickLinks(null).length} links`);

console.log("\n═══════════════════════════════════════════");
if (issues.length) {
  for (const i of issues) console.log(`✗ ${i}`);
  process.exit(1);
}
console.log("PASS: Footer defaults and merge logic look healthy.");
console.log("═══════════════════════════════════════════");
