#!/usr/bin/env node
/**
 * Audit public/ folder size and orphan count (CI guard).
 * Usage: node scripts/public-asset-audit.mjs [--max-mb 250]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const maxMbArg = process.argv.find((a) => a.startsWith("--max-mb="));
const MAX_MB = maxMbArg ? Number(maxMbArg.split("=")[1]) : 250;

const DELETE_DIRS = ["conference", path.join("2024K", "2024M")];
const ALWAYS_KEEP = new Set(["/ads.txt", "/next.svg", "/vercel.svg"]);
const DYNAMIC_KEEP = [{ prefix: "/sm25printmedia/", from: 1, to: 85, ext: ".jpg" }];

const exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".md", ".css", ".html"];
const src = [];
function walkSrc(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name);
    if (e.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(e.name)) continue;
      walkSrc(full);
    } else if (exts.some((x) => e.name.endsWith(x))) {
      src.push(fs.readFileSync(full, "utf8"));
    }
  }
}
for (const p of ["src", "scripts", "docs", path.join(ROOT, "next.config.js")]) {
  if (!fs.existsSync(p)) continue;
  if (fs.statSync(p).isFile()) src.push(fs.readFileSync(p, "utf8"));
  else walkSrc(p);
}
const blob = src.join("\n");

function isReferenced(rel) {
  if (ALWAYS_KEEP.has(rel)) return true;
  for (const { prefix, from, to, ext } of DYNAMIC_KEEP) {
    if (!rel.startsWith(prefix) || !rel.endsWith(ext)) continue;
    const n = Number(rel.slice(prefix.length, -ext.length));
    if (n >= from && n <= to) return true;
  }
  return blob.includes(rel) || blob.includes(encodeURI(rel));
}

const files = [];
function walkPublic(d, p = "") {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const rel = `/${path.posix.join(p, e.name)}`;
    const full = path.join(d, e.name);
    if (e.isDirectory()) walkPublic(full, path.posix.join(p, e.name));
    else files.push({ rel, bytes: fs.statSync(full).size });
  }
}
walkPublic(PUBLIC);

const totalMb = files.reduce((s, f) => s + f.bytes, 0) / 1024 / 1024;
const orphans = files.filter((f) => !isReferenced(f.rel));
const orphanMb = orphans.reduce((s, f) => s + f.bytes, 0) / 1024 / 1024;

const forbiddenDirs = DELETE_DIRS.filter((d) => fs.existsSync(path.join(PUBLIC, d)));

const report = {
  files: files.length,
  totalMB: Math.round(totalMb * 10) / 10,
  orphans: orphans.length,
  orphanMB: Math.round(orphanMb * 10) / 10,
  forbiddenDirs,
  maxMB: MAX_MB,
};

console.log(JSON.stringify(report, null, 2));

let failed = false;
if (totalMb > MAX_MB) {
  console.error(`FAIL: public/ is ${report.totalMB} MB (limit ${MAX_MB} MB)`);
  failed = true;
}
if (orphans.length > 0) {
  console.error(`WARN: ${orphans.length} unreferenced files (${report.orphanMB} MB)`);
  orphans.slice(0, 10).forEach((f) => console.error("  -", f.rel));
}
if (forbiddenDirs.length > 0) {
  console.error(`FAIL: forbidden dirs present: ${forbiddenDirs.join(", ")}`);
  failed = true;
}

process.exit(failed ? 1 : 0);
