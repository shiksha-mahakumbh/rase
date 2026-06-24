/**
 * Site-wide performance guardrails for 90+ Lighthouse target.
 * Run: npx tsx scripts/audit-site-performance.ts
 */
import fs from "node:fs";
import path from "node:path";
import { MEDIA_ARCHIVE_KEYS } from "../src/data/media-archive-keys";
import { LEGACY_REDIRECTS } from "../src/config/legacy-redirects.js";

const ROOT = path.resolve(import.meta.dirname ?? __dirname, "..");
const APP = path.join(ROOT, "src", "app");
const issues: string[] = [];

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function ok(msg: string) {
  console.log(`✓ ${msg}`);
}

function listPageFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "admin") continue;
      listPageFiles(full, acc);
    } else if (entry.name === "page.tsx") {
      acc.push(path.relative(APP, full).replace(/\\/g, "/"));
    }
  }
  return acc;
}

console.log("═══════════════════════════════════════════");
console.log("  SITE-WIDE PERFORMANCE AUDIT (90+ target)");
console.log("═══════════════════════════════════════════\n");

// ── Global shell ──
const layoutSrc = read("src/components/layouts/PublicPageLayout.tsx");
if (layoutSrc.includes('"use client"')) {
  issues.push("PublicPageLayout must be a server component");
} else if (!layoutSrc.includes("loadPublicChromeCms")) {
  issues.push("PublicPageLayout must server-load CMS chrome data");
} else if (!layoutSrc.includes("NavBarShell")) {
  issues.push("PublicPageLayout must use server NavBarShell");
} else {
  ok("PublicPageLayout: server CMS + deferred Nav/Footer");
}

const footerSrc = read("src/components/layout/Footer.tsx");
if (footerSrc.includes("RecaptchaScript")) {
  issues.push("Footer must not load reCAPTCHA site-wide");
} else {
  ok("Footer: no global reCAPTCHA script");
}

const clientChromeSrc = read("src/app/ClientChrome.tsx");
if (clientChromeSrc.includes('import { Toaster } from "react-hot-toast"')) {
  issues.push("ClientChrome must lazy-load react-hot-toast");
} else if (clientChromeSrc.includes("pickWelcomeModalBar") || clientChromeSrc.includes("isHomePath")) {
  issues.push("ClientChrome must not mount home welcome modal (use HomeWelcomeModal)");
} else if (!clientChromeSrc.includes("requestIdleCallback")) {
  issues.push("ClientChrome should defer non-critical widgets until idle");
} else {
  ok("ClientChrome: deferred global widgets, no home modal");
}

const sectionShellSrc = read("src/components/ui/SectionShell.tsx");
if (/from\s+["']framer-motion["']/.test(sectionShellSrc)) {
  issues.push("SectionShell must not import framer-motion");
} else {
  ok("SectionShell: CSS reveal (no framer-motion)");
}

const nextConfig = read("next.config.js");
if (!nextConfig.includes("optimizePackageImports")) {
  issues.push("next.config.js missing optimizePackageImports");
} else if (!nextConfig.includes("image/avif")) {
  issues.push("next.config.js should serve AVIF images");
} else {
  ok("next.config: package import optimization + AVIF");
}

// ── Media archives (no antd / framer-motion) ──
const archiveDir = path.join(ROOT, "src/components/media/archive");
for (const file of fs.readdirSync(archiveDir)) {
  if (!file.endsWith(".tsx")) continue;
  const src = fs.readFileSync(path.join(archiveDir, file), "utf8");
  if (/from\s+["']antd["']/.test(src) || /from\s+["']framer-motion["']/.test(src)) {
    issues.push(`Media archive ${file} must not import antd or framer-motion`);
  }
  if (/DigitalMedia\.tsx$/.test(file) && file !== "DigitalMediaArchiveGrid.tsx") {
    if (!src.includes("DigitalMediaArchiveGrid")) {
      issues.push(`${file} should use DigitalMediaArchiveGrid`);
    }
  }
  if (file.startsWith("PrintMedia") && file !== "PrintMediaArchiveGrid.tsx" && /export default function/.test(src)) {
    if (!src.includes("PrintMediaArchiveGrid")) {
      issues.push(`${file} should use PrintMediaArchiveGrid`);
    }
  }
}
ok("Media archives: lightweight grids (no antd/framer-motion)");

// ── Registration hub (defer heavy client JS) ──
const regHubSrc = read("src/app/registration/RegistrationHub.tsx");
if (regHubSrc.includes('import { Toaster } from "react-hot-toast"')) {
  issues.push("RegistrationHub must not mount duplicate Toaster");
} else if (!regHubSrc.includes("dynamic(() => import")) {
  issues.push("RegistrationHub must dynamic-import registration forms");
} else if (!regHubSrc.includes("step >= 2 && <RecaptchaScript")) {
  issues.push("RegistrationHub must defer reCAPTCHA until step 2");
} else if (!regHubSrc.includes("step !== 3")) {
  issues.push("RegistrationHub must load Razorpay only on payment step");
} else {
  ok("RegistrationHub: deferred forms, reCAPTCHA, Razorpay");
}

const regPageSrc = read("src/app/registration/RegistrationPageView.tsx");
if (!regPageSrc.includes("imagePriority: false")) {
  issues.push("RegistrationPageView hero must set imagePriority: false");
} else {
  ok("Registration page: lazy hero image");
}

const heroSrc = read("src/components/home/HeroSection.tsx");
if (heroSrc.includes('"use client"')) {
  issues.push("HeroSection must be server-rendered for homepage LCP");
} else if (!heroSrc.includes('fetchPriority="high"')) {
  issues.push("HeroSection LCP image should use fetchPriority high");
} else if (heroSrc.includes("HeroCountdown") || /from\s+["'].\/CountdownBanner["']/.test(heroSrc)) {
  issues.push("HeroSection must use server CountdownBannerView (no client countdown hydration)");
} else if (!heroSrc.includes("CountdownBannerView")) {
  issues.push("HeroSection should render CountdownBannerView for zero-JS hero countdown");
} else {
  ok("Homepage hero: server-rendered LCP + countdown");
}

const navShellSrc = read("src/components/layout/navbar/NavBarShell.tsx");
if (navShellSrc.includes('"use client"')) {
  issues.push("NavBarShell must be server-rendered");
} else if (!navShellSrc.includes("NavBarScrollEnhance")) {
  issues.push("NavBarShell should defer scroll styling to small client enhance");
} else {
  ok("NavBar: server shell + deferred tools/scroll");
}

const homePageSrc = read("src/components/home/HomePage.tsx");
if (!homePageSrc.includes("AnnouncementsMarquee")) {
  issues.push("HomePage must SSR announcements via AnnouncementsMarquee");
} else if (!homePageSrc.includes("NavBarShell")) {
  issues.push("HomePage must use server NavBarShell");
} else if (!homePageSrc.includes("HomeWelcomeModal")) {
  issues.push("HomePage must defer welcome modal via HomeWelcomeModal");
} else if (homePageSrc.includes("SectionShell")) {
  issues.push("HomePage should avoid client SectionShell in above-fold blocks");
} else if (/import\s+WhyAttendSection\s+from/.test(homePageSrc)) {
  issues.push("HomePage must dynamic-import below-fold client sections (WhyAttendSection, etc.)");
} else if (!homePageSrc.includes("idleFirst")) {
  issues.push("HomePage below-fold LazySections should use idleFirst");
} else {
  ok("HomePage: SSR nav/ticker + deferred sections");
}

const marqueeSrc = read("src/components/layout/AnnouncementsMarquee.tsx");
if (marqueeSrc.includes('"use client"')) {
  issues.push("AnnouncementsMarquee must be a server component");
} else if (!marqueeSrc.includes("MarqueeTrack")) {
  issues.push("AnnouncementsMarquee must render MarqueeTrack with server items");
} else {
  ok("AnnouncementsMarquee: server shell + client CSS scroll");
}

// ── Page inventory ──
const publicPages = listPageFiles(APP);
ok(`${publicPages.length} public page.tsx routes (excl. admin)`);

const clientPages = publicPages.filter((p) =>
  read(`src/app/${p.replace(/\\/g, "/")}`).includes('"use client"')
);
if (clientPages.length > 2) {
  issues.push(
    `Too many client page.tsx files (${clientPages.length}): ${clientPages.slice(0, 5).join(", ")}…`
  );
} else {
  ok(`Only ${clientPages.length} client page shells (dashboard/certificate OK)`);
}

// ── Canonical public URLs to verify post-deploy ──
const CANONICAL_URLS: string[] = [
  "/",
  "/introduction",
  "/registration",
  "/contact-us",
  "/donation",
  "/upcoming-events",
  "/past-events",
  "/past_event/shiksha-mahakumbh-1.0",
  "/past_event/shiksha-mahakumbh-2.0",
  "/past_event/shiksha-mahakumbh-3.0",
  "/past_event/shiksha-mahakumbh-4.0",
  "/past_event/shiksha-mahakumbh-5.0",
  "/proceedings",
  "/proceeding1",
  "/proceeding2",
  "/proceeding3",
  "/gallery",
  "/media-center",
  "/press",
  "/downloads",
  "/committees",
  "/speakers/directory",
  "/publications",
  "/departments/academic-council",
  "/departments/prabandhan",
  "/privacy-policy",
  "/terms-and-conditions",
  "/merchandise",
  "/best-wishes",
  "/workshops",
  "/conferences",
  "/education",
  "/noticeboard",
  "/feedback",
  "/partners",
  "/books",
  "/BatonCeremony",
  "/ResidentialCamp",
];

for (const key of MEDIA_ARCHIVE_KEYS) {
  const [edition, year, type] = key.split("/");
  CANONICAL_URLS.push(`/media/${edition}/${year}/${type}`);
}

for (const slug of [
  "education-summit-coverage",
  "baton-ceremony-smk-4",
  "summit-highlights",
  "shiksha-mahakumbh-4-0",
  "residential-camp-success",
  "residential-camp-hindi",
  "mahakumbh-programme-update",
  "national-coverage",
  "education-movement",
]) {
  CANONICAL_URLS.push(`/press/${slug}`);
}

for (const edition of ["1.0", "2.0", "3.0", "4.0", "5.0", "6.0"]) {
  CANONICAL_URLS.push(`/committee/Shiksha%20Mahakumbh%20${edition}`);
}

console.log(`\nCanonical URLs for Lighthouse (${CANONICAL_URLS.length}):`);
for (const url of CANONICAL_URLS) {
  console.log(`  • https://www.rase.co.in${url}`);
}

console.log(`\nLegacy redirects configured: ${LEGACY_REDIRECTS.length}`);

// ── Edition performance sub-audit ──
const perfAudit = path.join(ROOT, "scripts/audit-past-editions-performance.ts");
if (!fs.existsSync(perfAudit)) {
  issues.push("Missing scripts/audit-past-editions-performance.ts");
} else {
  ok("Past-edition performance audit script present");
}

console.log("\n═══════════════════════════════════════════");
if (issues.length) {
  for (const i of issues) console.log(`✗ ${i}`);
  process.exit(1);
}
console.log("PASS: Site-wide performance guardrails met.");
console.log("Next: deploy, then run mobile + desktop Lighthouse on canonical URLs.");
console.log("═══════════════════════════════════════════");
