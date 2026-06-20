#!/usr/bin/env node
/**
 * Final repo audit — confirms Firebase is fully removed.
 * Usage: npm run audit:firebase-removal
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const IGNORE_DIRS = new Set(["node_modules", ".next", ".git", "docs"]);
const ALLOWLIST_SCRIPTS = new Set([
  "scripts/staging-security-check.mjs",
  "scripts/check-legacy-storage-urls.mjs",
  "scripts/firebase-removal-audit.mjs",
  "scripts/gcp-export-firestore.mjs",
  "scripts/gcp-export-storage.mjs",
  "scripts/gcp-shutdown-project.mjs",
]);

function walkSrc(dir, out = []) {
  const src = path.join(ROOT, "src");
  if (!fs.existsSync(src)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (IGNORE_DIRS.has(name)) continue;
      walkSrc(full, out);
    } else if (/\.(ts|tsx|js|jsx)$/.test(name)) out.push(full);
  }
  return out;
}

const srcHits = [];
for (const file of walkSrc(path.join(ROOT, "src"))) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const content = fs.readFileSync(file, "utf8");
  if (/from ["']firebase|firebase-admin|@\/lib\/firebase|@\/app\/firebase/.test(content)) {
    srcHits.push(rel);
  }
}

const scriptHits = [];
for (const name of fs.readdirSync(path.join(ROOT, "scripts"))) {
  const rel = `scripts/${name}`;
  if (ALLOWLIST_SCRIPTS.has(rel) || !/\.mjs$/.test(name)) continue;
  const content = fs.readFileSync(path.join(ROOT, "scripts", name), "utf8");
  if (/from ["']firebase|firebase-admin|firestore\.googleapis/.test(content)) {
    scriptHits.push(rel);
  }
}

const infra = ["firebase.json", ".firebaserc", "firestore.indexes.json", "firebase", "scripts/legacy"].map(
  (p) => ({ path: p, exists: fs.existsSync(path.join(ROOT, p)) })
);

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const npmFirebase = Boolean(
  pkg.dependencies?.firebase || pkg.dependencies?.["firebase-admin"]
);
const npmFirebaseDevOptional = Boolean(
  pkg.devDependencies?.firebase || pkg.devDependencies?.["firebase-admin"]
);

const nextConfig = fs.readFileSync(path.join(ROOT, "next.config.js"), "utf8");
const nextHasLegacyHost = /firebasestorage\.googleapis\.com/.test(nextConfig);

let legacyUrlCheck = { ok: null, error: null };
try {
  execSync("node scripts/check-legacy-storage-urls.mjs", { cwd: ROOT, stdio: "pipe" });
  legacyUrlCheck.ok = true;
} catch (e) {
  legacyUrlCheck.ok = false;
  legacyUrlCheck.error = e.stderr?.toString()?.slice(0, 200) || e.message;
}

const report = {
  checkedAt: new Date().toISOString(),
  verdict:
    srcHits.length === 0 &&
    scriptHits.length === 0 &&
    !infra.some((i) => i.exists) &&
    !npmFirebase &&
    !nextHasLegacyHost &&
    legacyUrlCheck.ok
      ? "PASS"
      : "FAIL",
  srcImportHits: srcHits,
  scriptImportHits: scriptHits,
  infra,
  npmFirebasePackage: npmFirebase,
  npmFirebaseDevOptional,
  nextConfigLegacyHost: nextHasLegacyHost,
  legacyUrlsInDb: legacyUrlCheck,
};

console.log(JSON.stringify(report, null, 2));
process.exit(report.verdict === "PASS" ? 0 : 1);
