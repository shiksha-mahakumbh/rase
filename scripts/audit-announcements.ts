/**
 * Audit homepage announcements (accordion, ticker bars, modal fallbacks).
 * Run: npx tsx scripts/audit-announcements.ts
 */
import {
  DEFAULT_ANNOUNCEMENT_BARS_EN,
  DEFAULT_ANNOUNCEMENT_BARS_HI,
  FALLBACK_WELCOME_MODAL,
  filterCmsAnnouncementItems,
  getDefaultAnnouncementItems,
  resolveAnnouncementBars,
  resolveAnnouncementItems,
  resolveTickerItems,
} from "../src/data/default-announcements";
import { resolveNavHref } from "../src/lib/security/safe-nav-url";

const issues: string[] = [];

console.log("═══════════════════════════════════════════");
console.log("  ANNOUNCEMENTS AUDIT");
console.log("═══════════════════════════════════════════\n");

// Empty CMS rows must not surface
const emptyCms = filterCmsAnnouncementItems([
  { title: "", body: "x", url: "/" },
  { title: "OK", body: "", url: "/" },
  { title: "Valid", body: "Body text", url: "/registration", cta: "Go" },
]);
if (emptyCms.length !== 1) {
  issues.push(`filterCmsAnnouncementItems: expected 1 valid row, got ${emptyCms.length}`);
} else {
  console.log("✓ Empty CMS rows filtered");
}

const enItems = getDefaultAnnouncementItems("en");
const hiItems = getDefaultAnnouncementItems("hi");
console.log(`\n## Accordion defaults: EN ${enItems.length}, HI ${hiItems.length}`);

for (const item of enItems) {
  if (!item.title || !item.detail) issues.push(`EN accordion missing content: ${item.id}`);
  const nav = resolveNavHref(item.href);
  if (nav.href !== item.href || nav.external !== item.external) {
    issues.push(`EN nav mismatch: ${item.title}`);
  }
  console.log(`  [${item.iconKey}] ${item.title} → ${item.external ? "ext" : "int"} ${item.href}`);
}

const resolvedFromEmpty = resolveAnnouncementItems([], "en");
if (resolvedFromEmpty.length < 4) {
  issues.push(`resolveAnnouncementItems fallback too short: ${resolvedFromEmpty.length}`);
}

const bars = resolveAnnouncementBars([], "en");
console.log(`\n## Ticker bars (EN fallback): ${bars.length}`);
for (const b of bars) {
  console.log(`  ${b.title}: ${b.message.slice(0, 50)}…`);
}

const ticker = resolveTickerItems([], "en");
if (ticker.length !== DEFAULT_ANNOUNCEMENT_BARS_EN.length) {
  issues.push(`Ticker count mismatch: ${ticker.length}`);
}

console.log(`\n## Modal fallback CTA: "${FALLBACK_WELCOME_MODAL.ctaLabel}"`);
if (FALLBACK_WELCOME_MODAL.ctaLabel === "click here") {
  issues.push("Modal still uses poor CTA label");
}

const hiBars = resolveAnnouncementBars([], "hi");
if (hiBars.length !== DEFAULT_ANNOUNCEMENT_BARS_HI.length) {
  issues.push("Hindi bars fallback missing");
}

console.log("\n═══════════════════════════════════════════");
if (issues.length) {
  console.log("ISSUES:");
  for (const i of issues) console.log(`  ✗ ${i}`);
  process.exit(1);
}
console.log("PASS: Announcement defaults and resolvers look healthy.");
console.log("═══════════════════════════════════════════");
