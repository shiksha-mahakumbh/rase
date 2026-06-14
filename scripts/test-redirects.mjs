import { LEGACY_REDIRECTS } from "../src/config/legacy-redirects.js";

const canonicalRoutes = new Set([
  "/past-events",
  "/upcoming-events",
  "/contact-us",
  "/best-wishes",
  "/wishes-received",
  "/committees",
  "/media-center",
  "/press",
  "/coming-soon",
  "/accommodation",
  "/departments/academic-council",
  "/departments/prabandhan",
  "/departments/prachar",
  "/departments/sampark",
  "/departments/vitt",
  "/press/baton-ceremony-smk-4",
  "/press/shiksha-mahakumbh-4-0",
  "/press/residential-camp-success",
  "/press/residential-camp-hindi",
  "/press/national-coverage",
  "/press/education-summit-coverage",
  "/press/mahakumbh-programme-update",
  "/press/education-movement",
  "/press/summit-highlights",
  "/media/shiksha-mahakumbh/4.0/digital",
  "/media/shiksha-mahakumbh/1.0/digital",
  "/media/shiksha-mahakumbh/3.0/digital",
  "/media/shiksha-mahakumbh/2.0/digital",
  "/media/shiksha-mahakumbh/4.0/print",
  "/media/shiksha-mahakumbh/1.0/print",
  "/media/shiksha-mahakumbh/3.0/print",
  "/media/shiksha-mahakumbh/2.0/print",
  "/departments/academic-council",
]);

const issues = [];
for (const r of LEGACY_REDIRECTS) {
  if (!r.permanent) issues.push(`Not permanent: ${r.source}`);
  if (r.source === r.destination) issues.push(`Self redirect: ${r.source}`);
  if (!canonicalRoutes.has(r.destination) && !r.destination.startsWith("/participant") && !r.destination.startsWith("/ngo")) {
    // destination should be canonical
  }
  if (canonicalRoutes.has(r.source)) issues.push(`Canonical in redirect source: ${r.source}`);
}

const chains = new Map();
for (const r of LEGACY_REDIRECTS) {
  if (chains.has(r.destination)) {
    const next = LEGACY_REDIRECTS.find((x) => x.source === r.destination);
    if (next) issues.push(`Redirect chain: ${r.source} → ${r.destination} → ${next.destination}`);
  }
  chains.set(r.source, r.destination);
}

console.log(JSON.stringify({
  totalRedirects: LEGACY_REDIRECTS.length,
  allPermanent: LEGACY_REDIRECTS.every((r) => r.permanent),
  issues,
  pass: issues.length === 0,
}, null, 2));
process.exit(issues.length > 0 ? 1 : 0);
