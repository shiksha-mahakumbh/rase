/**
 * Deep audit for Academic · Media · Sponsors homepage showcase.
 * Run: npx tsx scripts/audit-partners-showcase.ts
 */
import { buildAffiliationShowcase } from "../src/lib/cms/build-affiliation-showcase";
import { groupAffiliationsByTier } from "../src/lib/cms/affiliation-tier";
import { getAffiliationShowcaseStats } from "../src/lib/cms/affiliation-showcase-stats";
import { normalizeAffiliationKey } from "../src/lib/cms/partner-showcase";
import { resolveAffiliationWebsite } from "../src/lib/cms/affiliation-websites";
import { MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS } from "../src/data/mahakumbh-abhiyan-speakers";

const grouped = buildAffiliationShowcase({});
const stats = getAffiliationShowcaseStats(grouped);

console.log("═══════════════════════════════════════════");
console.log("  PARTNERS SHOWCASE AUDIT — 3 TABS");
console.log("═══════════════════════════════════════════\n");

console.log("## COUNTS");
console.log(`  Academic:  ${stats.byTab.academic}`);
console.log(`  Media:     ${stats.byTab.media}`);
console.log(`  Sponsors:  ${stats.byTab.sponsors}`);
console.log(`  Total:     ${stats.total}`);
console.log(`  Linked:    ${stats.linked} (${Math.round((stats.linked / stats.total) * 100)}%)\n`);

for (const tab of ["academic", "media", "sponsors"] as const) {
  const tiers = groupAffiliationsByTier(tab, grouped[tab]);
  console.log(`## ${tab.toUpperCase()} TIERS`);
  for (const t of tiers) {
    const linked = t.entries.filter((e) => e.website).length;
    console.log(`  [${t.labelEn}] ${t.entries.length} (${linked} linked)`);
  }
  console.log();
}

// Potential duplicates (fuzzy - same key or one contains other)
const allEntries = [...grouped.academic, ...grouped.media, ...grouped.sponsors];
const keyMap = new Map<string, string[]>();
for (const e of allEntries) {
  const k = normalizeAffiliationKey(e.name);
  const list = keyMap.get(k) ?? [];
  list.push(`${e.name}`);
  keyMap.set(k, list);
}
const exactDupKeys = [...keyMap.entries()].filter(([, v]) => v.length > 1);

console.log("## EXACT KEY DUPLICATES (cross-listing same key)");
console.log(exactDupKeys.length === 0 ? "  None" : exactDupKeys.map(([k, v]) => `  ${k}: ${v.join(" | ")}`).join("\n"));
console.log();

// Misrouting: media/sponsor names that look academic
const suspiciousMedia = grouped.media.filter(
  (e) => /university|iit|nit|iim|विश्वविद्यालय/i.test(e.name) && !/press|pioneer|hindu|dainik/i.test(e.name)
);
const suspiciousSponsor = grouped.sponsors.filter(
  (e) => /university|school|विद्यालय/i.test(e.name)
);
const suspiciousAcademic = grouped.academic.filter(
  (e) => /business world|dainik|pioneer|uttam hindu/i.test(e.name)
);

console.log("## POSSIBLE MISCLASSIFICATION");
console.log(`  Academic tab with press names: ${suspiciousAcademic.length}`);
suspiciousAcademic.slice(0, 5).forEach((e) => console.log(`    - ${e.name}`));
console.log(`  Media tab with uni names: ${suspiciousMedia.length}`);
suspiciousMedia.slice(0, 5).forEach((e) => console.log(`    - ${e.name}`));
console.log(`  Sponsor tab with school/uni: ${suspiciousSponsor.length}`);
suspiciousSponsor.slice(0, 5).forEach((e) => console.log(`    - ${e.name}`));
console.log();

// Unlinked but resolvable offline
const unlinkedResolvable = allEntries.filter(
  (e) => !e.website && resolveAffiliationWebsite(e.name)
);
console.log(`## UNLINKED BUT PATTERN-MATCHABLE: ${unlinkedResolvable.length}`);
console.log();

// Speaker orgs not in any tab
const speakerOrgs = new Set<string>();
for (const ed of MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS) {
  for (const s of ed.speakers) {
    if (s.organization?.trim()) speakerOrgs.add(s.organization.trim());
  }
}
const allNames = new Set(allEntries.map((e) => normalizeAffiliationKey(e.name)));
const missingSpeakerOrgs = [...speakerOrgs].filter(
  (o) => !allNames.has(normalizeAffiliationKey(o))
);
console.log(`## SPEAKER ORGS NOT IN SHOWCASE: ${missingSpeakerOrgs.length}`);
missingSpeakerOrgs.slice(0, 15).forEach((o) => console.log(`    - ${o}`));
if (missingSpeakerOrgs.length > 15) console.log(`    ... +${missingSpeakerOrgs.length - 15} more`);
console.log();

// Edition 6.0
const has6 = MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS.some((e) => e.edition === "6.0");
console.log(`## EDITION 6.0 DATA: ${has6 ? "present" : "MISSING in mahakumbh-abhiyan-speakers.ts"}`);
console.log();

// Items in wrong tier samples for academic
const academicTiers = groupAffiliationsByTier("academic", grouped.academic);
const govTier = academicTiers.find((t) => t.id === "government");
const nationalTier = academicTiers.find((t) => t.id === "national");
console.log("## ACADEMIC TIER SAMPLES");
console.log("  Organizing (first 5):", academicTiers.find((t) => t.id === "organizing")?.entries.slice(0, 5).map((e) => e.name).join(", ") ?? "—");
console.log("  Government (first 5):", govTier?.entries.slice(0, 5).map((e) => e.name).join(", ") ?? "—");
console.log("  National (first 5):", nationalTier?.entries.slice(0, 5).map((e) => e.name).join(", ") ?? "—");
console.log("  YouTube tier count:", academicTiers.find((t) => t.id === "youtube")?.entries.length ?? 0);
console.log("  Other tier count:", academicTiers.find((t) => t.id === "other")?.entries.length ?? 0);
console.log();

// Cross-tab: same org in multiple tabs
const byNorm = new Map<string, Set<string>>();
for (const tab of ["academic", "media", "sponsors"] as const) {
  for (const e of grouped[tab]) {
    const k = normalizeAffiliationKey(e.name);
    const tabs = byNorm.get(k) ?? new Set();
    tabs.add(tab);
    byNorm.set(k, tabs);
  }
}
const crossTab = [...byNorm.entries()].filter(([, tabs]) => tabs.size > 1);
console.log(`## CROSS-TAB DUPLICATES (same name in 2+ tabs): ${crossTab.length}`);
crossTab.slice(0, 10).forEach(([k, tabs]) => console.log(`    ${k}: ${[...tabs].join(", ")}`));
console.log();

console.log("## MEDIA TAB FULL LIST");
grouped.media.forEach((e) => console.log(`  ${e.website ? "🔗" : "  "} ${e.name}`));
console.log();

console.log("## SPONSORS TAB FULL LIST");
grouped.sponsors.forEach((e) => console.log(`  ${e.website ? "🔗" : "  "} ${e.name}`));
console.log();

console.log("AUDIT COMPLETE");
