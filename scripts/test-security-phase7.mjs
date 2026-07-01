#!/usr/bin/env node
/**
 * Security checklist items 91–98 — Mobile, PWA, offline, WCAG, keyboard, ARIA, browsers.
 */
import fs from "node:fs";
import path from "node:path";

const repo = path.resolve(".");
const src = path.join(repo, "src");
const results = [];

function pass(name, detail) {
  results.push({ test: name, status: "PASS", detail });
}
function fail(name, detail) {
  results.push({ test: name, status: "FAIL", detail });
}

function readSrc(rel) {
  return fs.readFileSync(path.join(src, rel), "utf8");
}

function readRepo(rel) {
  return fs.readFileSync(path.join(repo, rel), "utf8");
}

function existsRepo(rel) {
  return fs.existsSync(path.join(repo, rel));
}

// 91 Mobile optimization
if (
  readSrc("app/layout.tsx").includes("width: \"device-width\"") &&
  readSrc("components/layout/navbar/NavBarMobileMenu.tsx").includes("mobile-nav-drawer")
) {
  pass("mobile_viewport_drawer", "Viewport meta and mobile navigation drawer present");
} else {
  fail("mobile_viewport_drawer", "Mobile viewport or drawer missing");
}

if (
  readSrc("components/home/FloatingActionButton.tsx").includes("safe-area-inset-bottom") &&
  readSrc("components/home/StickyRegisterBar.tsx").includes("safe-area-inset-bottom")
) {
  pass("mobile_safe_area", "Sticky bars and FAB respect iOS safe-area insets");
} else {
  fail("mobile_safe_area", "Safe-area padding missing on mobile chrome");
}

// 92 Responsive design
if (
  readSrc("components/layout/navbar/NavBarMobileMenu.tsx").includes("min-h-11") &&
  readSrc("components/admin/cms/AdminUi.tsx").includes("min-h-[44px]")
) {
  pass("responsive_touch_targets", "Mobile quick links and admin buttons meet 44px targets");
} else {
  fail("responsive_touch_targets", "Touch target sizing gaps remain");
}

// 93 PWA
if (
  existsRepo("public/manifest.webmanifest") &&
  readSrc("app/layout.tsx").includes('manifest: "/manifest.webmanifest"')
) {
  pass("pwa_manifest", "Web app manifest linked from root layout");
} else {
  fail("pwa_manifest", "PWA manifest missing or not wired");
}

if (
  existsRepo("public/sw.js") &&
  readSrc("components/pwa/ServiceWorkerRegister.tsx").includes('register("/sw.js")')
) {
  pass("pwa_service_worker", "Service worker registered in client chrome");
} else {
  fail("pwa_service_worker", "Service worker registration missing");
}

// 94 Offline support
if (
  existsRepo("src/app/offline/page.tsx") &&
  readRepo("public/sw.js").includes('caches.match("/offline")')
) {
  pass("offline_fallback", "Offline page and navigation fallback cached");
} else {
  fail("offline_fallback", "Offline support incomplete");
}

// 95 WCAG
if (
  readSrc("app/layout.tsx").includes("#main-content") &&
  readRepo("src/app/globals.css").includes("prefers-reduced-motion")
) {
  pass("wcag_skip_reduced_motion", "Skip link and reduced-motion styles present");
} else {
  fail("wcag_skip_reduced_motion", "WCAG baseline patterns missing");
}

if (
  readSrc("lib/announcement-bar-theme.ts").includes("text-white/90") &&
  readSrc("components/layout/Footer.tsx").includes("text-white/70")
) {
  pass("wcag_contrast_fixes", "Announcement and footer copy use improved contrast");
} else {
  fail("wcag_contrast_fixes", "Contrast fixes incomplete");
}

// 96 Keyboard navigation
if (
  readSrc("components/layout/navbar/NavBarMobileMenu.tsx").includes("handleTab") &&
  readSrc("components/layout/navbar/NavBarMobileMenu.tsx").includes("menuButtonRef")
) {
  pass("keyboard_mobile_drawer_trap", "Mobile drawer traps focus and restores menu button");
} else {
  fail("keyboard_mobile_drawer_trap", "Mobile drawer keyboard trap missing");
}

if (readSrc("components/ui/PremiumModal.tsx").includes("previouslyFocused?.focus()")) {
  pass("keyboard_modal_focus_restore", "PremiumModal restores focus on close");
} else {
  fail("keyboard_modal_focus_restore", "Modal focus restore missing");
}

// 97 ARIA
if (
  readSrc("components/ui/SpeakerCard.tsx").includes("Portrait of") &&
  readSrc("components/ui/EventCard.tsx").includes("${title} event")
) {
  pass("aria_image_alt", "Speaker and event cards expose descriptive alt text");
} else {
  fail("aria_image_alt", "Decorative-only alt text remains on cards");
}

if (
  readSrc("components/admin/RegistrationTable.tsx").includes("Select all registrations") &&
  readSrc("components/press/PressShowcase.tsx").includes("aria-controls=\"press-tabpanel\"")
) {
  pass("aria_tabs_tables", "Admin select-all label and press tab ARIA wired");
} else {
  fail("aria_tabs_tables", "ARIA gaps on tables or tabs");
}

// 98 Browser compatibility
if (
  readRepo("package.json").includes("chrome >= 92") &&
  readRepo("package.json").includes("safari >= 15.4")
) {
  pass("browser_targets", "browserslist targets modern evergreen browsers");
} else {
  fail("browser_targets", "browserslist targets missing or outdated");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(`\nPhase 7 mobile & accessibility checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const r of results) {
  console.log(`${r.status === "PASS" ? "✓" : "✗"} ${r.test}: ${r.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
