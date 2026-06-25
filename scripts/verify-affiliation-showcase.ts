/**
 * Quick sanity check for homepage affiliation showcase data.
 * Run: npx tsx scripts/verify-affiliation-showcase.ts
 */
import { buildAffiliationShowcase } from "../src/lib/cms/build-affiliation-showcase";
import { getAffiliationShowcaseStats } from "../src/lib/cms/affiliation-showcase-stats";
import { CONFERENCE_SUPPORT_MASTER } from "../src/data/conference-support-master";

const grouped = buildAffiliationShowcase({});
const stats = getAffiliationShowcaseStats(grouped);

console.log("=== Affiliation Showcase Verification ===\n");
console.log("Academic:", stats.byTab.academic);
console.log("Media:", stats.byTab.media);
console.log("Sponsors:", stats.byTab.sponsors);
console.log("Total:", stats.total);
console.log("With website:", stats.linked);

const sampleLinked = [
  ...grouped.media.filter((e) => e.website).map((e) => e.name),
  ...grouped.sponsors.filter((e) => e.website).map((e) => e.name),
].slice(0, 8);
console.log("Sample linked:", sampleLinked.join(", ") || "none");

const mediaNames = grouped.media.map((e) => e.name);
const sponsorNames = grouped.sponsors.map((e) => e.name);

const masterMedia = CONFERENCE_SUPPORT_MASTER.filter((e) => e.section === "L").map((e) => e.name);
const masterSponsor = CONFERENCE_SUPPORT_MASTER.filter((e) => e.section === "K").map((e) => e.name);

const missingMedia = masterMedia.filter((n) => !mediaNames.some((m) => m.toLowerCase().includes(n.toLowerCase().split(" ")[0]!)));
const missingSponsor = masterSponsor.filter((n) => !sponsorNames.some((s) => s.toLowerCase().includes(n.toLowerCase().split(" ")[0]!)));

console.log("\nMaster media present:", missingMedia.length === 0 ? "YES" : `MISSING: ${missingMedia.join(", ")}`);
console.log("Master sponsors present:", missingSponsor.length === 0 ? "YES" : `MISSING: ${missingSponsor.join(", ")}`);

const badUrls = [...grouped.academic, ...grouped.media, ...grouped.sponsors]
  .filter((e) => e.website && !e.website.startsWith("https://") && !e.website.startsWith("http://"))
  .map((e) => e.name);

console.log("Unsafe URLs:", badUrls.length === 0 ? "NONE" : badUrls.join(", "));

if (stats.byTab.media < 4) {
  console.error("\nFAIL: Expected at least 4 media partners");
  process.exit(1);
}
if (stats.byTab.sponsors < 6) {
  console.error("\nFAIL: Expected at least 6 sponsors");
  process.exit(1);
}
if (stats.byTab.academic < 100) {
  console.error("\nFAIL: Expected substantial academic list (master has 150+)");
  process.exit(1);
}

console.log("\nPASS: Affiliation showcase data looks healthy.");
