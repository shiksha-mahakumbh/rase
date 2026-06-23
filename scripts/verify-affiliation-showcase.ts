/**
 * Quick sanity check for homepage affiliation showcase data.
 * Run: npx tsx scripts/verify-affiliation-showcase.ts
 */
import { buildAffiliationShowcase } from "../src/lib/cms/build-affiliation-showcase";
import { getAffiliationShowcaseStats } from "../src/lib/cms/affiliation-showcase-stats";
import { CURATED_MEDIA_AFFILIATIONS, CURATED_SPONSOR_AFFILIATIONS } from "../src/lib/cms/affiliation-classify";

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

const curatedMedia = CURATED_MEDIA_AFFILIATIONS.map((e) => e.name);
const curatedSponsor = CURATED_SPONSOR_AFFILIATIONS.map((e) => e.name);

const missingMedia = curatedMedia.filter((n) => !mediaNames.some((m) => m.toLowerCase().includes(n.toLowerCase().split(" ")[0]!)));
const missingSponsor = curatedSponsor.filter((n) => !sponsorNames.some((s) => s.toLowerCase().includes(n.toLowerCase())));

console.log("\nCurated media present:", missingMedia.length === 0 ? "YES" : `MISSING: ${missingMedia.join(", ")}`);
console.log("Curated sponsors present:", missingSponsor.length === 0 ? "YES" : `MISSING: ${missingSponsor.join(", ")}`);

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
if (stats.byTab.academic < 20) {
  console.error("\nFAIL: Expected substantial academic list");
  process.exit(1);
}

console.log("\nPASS: Affiliation showcase data looks healthy.");
