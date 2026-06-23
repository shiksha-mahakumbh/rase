/**
 * Audit homepage notice board + full noticeboard fallbacks.
 * Run: npx tsx scripts/audit-noticeboard.ts
 */
import {
  DEFAULT_NOTICES_EN,
  DEFAULT_NOTICES_HI,
  resolvePublicNotices,
  resolveWidgetNotices,
  sortNotices,
} from "../src/data/default-notices";

const issues: string[] = [];
const warnings: string[] = [];

function auditNotices(label: string, notices: typeof DEFAULT_NOTICES_EN) {
  console.log(`\n## ${label} (${notices.length} notices)`);

  const slugs = new Set<string>();
  for (const n of notices) {
    if (!n.title.trim()) issues.push(`${label}: empty title (${n.id})`);
    if (!n.description.trim()) issues.push(`${label}: empty description — ${n.slug}`);
    if (!n.slug.trim()) issues.push(`${label}: empty slug (${n.id})`);
    if (slugs.has(n.slug)) issues.push(`${label}: duplicate slug — ${n.slug}`);
    slugs.add(n.slug);

    if (!n.category) warnings.push(`${label}: no category — ${n.slug}`);
    if (!n.publishAt) warnings.push(`${label}: no publishAt — ${n.slug}`);
  }

  const pinned = notices.filter((n) => n.isPinned).length;
  const withCategory = notices.filter((n) => n.category).length;
  console.log(`  Pinned: ${pinned}`);
  console.log(`  With category: ${withCategory}/${notices.length}`);
  console.log(`  With description: ${notices.filter((n) => n.description.length > 20).length}/${notices.length}`);

  const widget = resolveWidgetNotices([], notices, "en", 5);
  console.log("\n  Homepage widget (top 5):");
  for (const w of widget) {
    console.log(`    ${w.isPinned ? "📌" : "  "} [${w.category?.slug ?? "—"}] ${w.title}`);
  }
}

console.log("═══════════════════════════════════════════");
console.log("  NOTICE BOARD AUDIT");
console.log("═══════════════════════════════════════════");

auditNotices("English defaults", DEFAULT_NOTICES_EN);
auditNotices("Hindi defaults", DEFAULT_NOTICES_HI);

const resolved = resolvePublicNotices([]);
console.log(`\n## resolvePublicNotices([]) → ${resolved.length} items`);
console.log(`## sortNotices stable: ${sortNotices(resolved)[0]?.slug === resolved[0]?.slug ? "OK" : "FAIL"}`);

// Slug alignment between EN widget and full list
const enSlugs = new Set(DEFAULT_NOTICES_EN.map((n) => n.slug));
const widgetSlugs = resolveWidgetNotices([], DEFAULT_NOTICES_EN, "en", 5).map((n) => n.slug);
const allResolvable = widgetSlugs.every((s) => enSlugs.has(s));
if (!allResolvable) {
  issues.push("Widget slugs not found in full EN list");
}

console.log("\n═══════════════════════════════════════════");
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const w of warnings.slice(0, 5)) console.log(`  ⚠ ${w}`);
  if (warnings.length > 5) console.log(`  … and ${warnings.length - 5} more`);
}
if (issues.length) {
  console.log(`ISSUES (${issues.length}):`);
  for (const i of issues) console.log(`  ✗ ${i}`);
  console.log("\nAUDIT FAILED");
  process.exit(1);
}

console.log("PASS: Notice board defaults look healthy.");
console.log("═══════════════════════════════════════════");
