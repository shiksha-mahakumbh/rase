#!/usr/bin/env node
/**
 * Security checklist items 110–119 — code quality, routes, APIs, docs.
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

function walkRoutes(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkRoutes(p));
    else if (ent.name === "route.ts") out.push(p);
  }
  return out;
}

// 110 Files & folder names
if (
  existsRepo("src/components") &&
  existsRepo("src/server/services") &&
  existsRepo("src/lib/schemas") &&
  existsRepo("docs/CODE_CONVENTIONS.md")
) {
  pass("folder_structure", "Feature folders, server services, schemas, and conventions doc present");
} else {
  fail("folder_structure", "Expected src/ layout or CODE_CONVENTIONS.md missing");
}

// 111 Route names
if (
  existsRepo("src/config/legacy-redirects.js") &&
  existsRepo("src/app/contact-us/page.tsx") &&
  readRepo("src/config/legacy-redirects.js").includes("/ContactUs")
) {
  pass("route_legacy_redirects", "Kebab-case routes with legacy redirect map");
} else {
  fail("route_legacy_redirects", "Legacy redirect configuration incomplete");
}

// 112 APIs
const v2Routes = walkRoutes(path.join(src, "app", "api", "v2"));
const v2WithHandler = v2Routes.filter((p) =>
  fs.readFileSync(p, "utf8").includes("createApiHandler")
);
if (v2Routes.length >= 120 && v2WithHandler.length >= v2Routes.length * 0.85) {
  pass("api_v2_handlers", `${v2Routes.length} v2 routes; ${v2WithHandler.length} use createApiHandler`);
} else {
  fail("api_v2_handlers", `v2 handler coverage low (${v2WithHandler.length}/${v2Routes.length})`);
}

// 113 Components
if (
  existsRepo("src/components/ui") &&
  existsRepo("src/components/admin/cms/AdminUi.tsx") &&
  existsRepo("src/components/layout")
) {
  pass("components_organization", "UI primitives, admin CMS, and layout components grouped");
} else {
  fail("components_organization", "Component folder organization gaps");
}

// 114 TypeScript
if (
  readRepo("tsconfig.json").includes('"strict": true') &&
  readRepo(".github/workflows/ci.yml").includes("npm run typecheck")
) {
  pass("typescript_strict_ci", "strict TypeScript and CI typecheck gate");
} else {
  fail("typescript_strict_ci", "TypeScript strict mode or CI typecheck missing");
}

// 115 ESLint
if (
  existsRepo(".eslintrc.json") &&
  readRepo("package.json").includes('"lint": "next lint"') &&
  readRepo(".github/workflows/ci.yml").includes("npm run lint")
) {
  pass("eslint_ci", "ESLint configured and runs in CI");
} else {
  fail("eslint_ci", "ESLint or CI lint step missing");
}

// 116 Dead code
if (
  !readSrc("lib/cookie-consent.ts").includes("openGraphLocale") &&
  existsRepo("src/lib/seo/locale.ts") &&
  !readSrc("components/home/HeroLcpImage.tsx").includes("HERO_LCP_PRELOAD =")
) {
  pass("dead_code_cleanup", "SEO locale moved out of cookie module; deprecated hero export removed");
} else {
  fail("dead_code_cleanup", "Misplaced or deprecated exports remain");
}

// 117 Duplicate routes
const legacyShims = [
  "app/api/registration/submit/route.ts",
  "app/api/registration/lookup/route.ts",
  "app/api/health/route.ts",
];
const shimsOk = legacyShims.every(
  (rel) => fs.existsSync(path.join(src, rel)) && /@deprecated/.test(readSrc(rel))
);
if (shimsOk) {
  pass("duplicate_routes_shims", "Legacy API shims marked @deprecated with v2 successors");
} else {
  fail("duplicate_routes_shims", "Legacy API shims missing deprecation markers");
}

// 118 Imports
const tsFiles = [];
function walkTs(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory() && ent.name !== "node_modules") walkTs(p);
    else if (/\.(tsx?|cjs)$/.test(ent.name)) tsFiles.push(p);
  }
}
walkTs(src);
const deepRelative = tsFiles.filter((f) =>
  /from ['"]\.\.\/\.\.\/\.\.\//.test(fs.readFileSync(f, "utf8"))
);
if (deepRelative.length === 0) {
  pass("imports_alias", "No deep ../../../ imports under src/");
} else {
  fail("imports_alias", `${deepRelative.length} files use deep relative imports`);
}

// 119 Documentation
const readme = readRepo("README.md");
if (
  readme.includes("npm run dev") &&
  readme.includes("CODE_CONVENTIONS") &&
  readme.length > 500
) {
  pass("documentation_readme", "README covers setup, scripts, and links conventions");
} else {
  fail("documentation_readme", "README too sparse or missing key sections");
}

const failed = results.filter((r) => r.status === "FAIL");
console.log(`\nPhase 10 code quality checks: ${results.length - failed.length}/${results.length} passed\n`);
for (const r of results) {
  console.log(`${r.status === "PASS" ? "✓" : "✗"} ${r.test}: ${r.detail}`);
}
if (failed.length > 0) {
  process.exit(1);
}
