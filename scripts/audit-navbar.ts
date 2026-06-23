/**
 * Audit header nav merge + mega menu helpers.
 * Run: npx tsx scripts/audit-navbar.ts
 */
import { NAV_MENUS } from "../src/constants/navigation";
import { cmsMenuToNav, isMegaMenuItem, mergeHeaderNavMenus } from "../src/lib/cms/nav-adapter";
import { resolveNavHref } from "../src/lib/security/safe-nav-url";

const issues: string[] = [];

console.log("═══════════════════════════════════════════");
console.log("  NAVBAR AUDIT");
console.log("═══════════════════════════════════════════\n");

const thinCms = [
  { path: "/", title: "Home" },
  { path: "/registration", title: "Registration" },
  { path: "/noticeboard", title: "Notice Board" },
  { path: "/downloads", title: "Downloads" },
];

const merged = mergeHeaderNavMenus(NAV_MENUS, thinCms);
if (merged.length < NAV_MENUS.length) {
  issues.push(`Thin CMS replaced nav: ${merged.length} < ${NAV_MENUS.length}`);
} else {
  console.log(`✓ CMS merge keeps full tree (${merged.length} items, base ${NAV_MENUS.length})`);
}

const titles = merged.map((m) => m.title);
for (const required of ["About", "Research", "Events", "Media", "Contact"]) {
  if (!titles.includes(required)) issues.push(`Missing ${required} after CMS merge`);
}
if (!issues.some((i) => i.includes("Missing"))) {
  console.log("✓ About, Research, Events, Media, Contact preserved");
}

const noticeTop = merged.some((m) => m.title === "Notice Board");
const eventsMenu = merged.find((m) => m.title === "Events");
const noticeInEvents = eventsMenu?.subMenu?.some((s) => s.path === "/noticeboard");
if (!noticeTop && !noticeInEvents) issues.push("Notice Board missing from nav");
else console.log("✓ Notice Board reachable (top-level or Events submenu)");

if (!isMegaMenuItem(merged.find((m) => m.title === "About")!)) {
  issues.push("About should be mega menu");
} else {
  console.log("✓ About mega menu detected by title");
}

if (!isMegaMenuItem(merged.find((m) => m.title === "Research")!)) {
  issues.push("Research should be mega menu");
} else {
  console.log("✓ Research mega menu detected by title");
}

const journal = NAV_MENUS.find((m) => m.title === "Research")?.subMenu?.find((s) =>
  s.path.includes("pub.dhe")
);
if (journal && !resolveNavHref(journal.path).external) {
  issues.push("Journal link should be external");
} else {
  console.log("✓ External journal link resolves safely");
}

const emptyCms = cmsMenuToNav({ id: "x", items: [] } as never);
if (emptyCms.length !== NAV_MENUS.length) issues.push("Empty CMS should return defaults");

console.log("\n═══════════════════════════════════════════");
if (issues.length) {
  for (const i of issues) console.log(`✗ ${i}`);
  process.exit(1);
}
console.log("PASS: Navbar merge and helpers look healthy.");
console.log("═══════════════════════════════════════════");
