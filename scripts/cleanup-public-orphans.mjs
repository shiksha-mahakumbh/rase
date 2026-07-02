#!/usr/bin/env node
/**
 * Remove unreferenced public/ assets.
 * Usage: node scripts/cleanup-public-orphans.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DRY_RUN = process.argv.includes("--dry-run");

/** Entire subtrees with zero code references (audit-verified). */
const DELETE_DIRS = ["conference", path.join("2024K", "2024M")];

const ALWAYS_KEEP = new Set(["/next.svg", "/vercel.svg"]);

const DYNAMIC_KEEP = [
  { prefix: "/sm25printmedia/", from: 1, to: 85, ext: ".jpg" },
];

const exts = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".md", ".css", ".html"];
const src = [];

function walkSrc(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name);
    if (e.isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(e.name)) continue;
      if (e.name === "tmp-public-orphans.json") continue;
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
  if (blob.includes(rel)) return true;
  if (blob.includes(encodeURI(rel))) return true;
  return false;
}

function relFromFull(full) {
  return `/${path.relative(PUBLIC, full).replace(/\\/g, "/")}`;
}

function rmDirRecursive(dir) {
  if (!fs.existsSync(dir)) return 0;
  let bytes = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) bytes += rmDirRecursive(full);
    else bytes += fs.statSync(full).size;
  }
  if (!DRY_RUN) fs.rmSync(dir, { recursive: true, force: true });
  return bytes;
}

let deleted = 0;
let deletedBytes = 0;

const files = [];
function walkPublic(d, p = "") {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const rel = `/${path.posix.join(p, e.name)}`;
    const full = path.join(d, e.name);
    if (e.isDirectory()) walkPublic(full, path.posix.join(p, e.name));
    else files.push({ rel, full, bytes: fs.statSync(full).size });
  }
}

for (const dir of DELETE_DIRS) {
  const full = path.join(PUBLIC, dir);
  const b = rmDirRecursive(full);
  deletedBytes += b;
  console.log(DRY_RUN ? `[dry-run] would remove dir` : `removed dir`, dir, `${Math.round(b / 1024 / 1024 * 10) / 10} MB`);
}

walkPublic(PUBLIC);

for (const f of files) {
  if (!fs.existsSync(f.full)) continue;
  if (isReferenced(f.rel)) continue;
  deleted++;
  deletedBytes += f.bytes;
  if (DRY_RUN) console.log("would delete", f.rel);
  else fs.unlinkSync(f.full);
}

if (!DRY_RUN) {
  function pruneEmptyDirs(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) pruneEmptyDirs(path.join(dir, e.name));
    }
    if (dir !== PUBLIC && fs.readdirSync(dir).length === 0) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        /* OneDrive may lock empty dirs briefly */
      }
    }
  }
  pruneEmptyDirs(PUBLIC);
}

const remainFiles = [];
function walkRemain(d, p = "") {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const rel = `/${path.posix.join(p, e.name)}`;
    const full = path.join(d, e.name);
    if (e.isDirectory()) walkRemain(full, path.posix.join(p, e.name));
    else remainFiles.push({ bytes: fs.statSync(full).size });
  }
}
walkRemain(PUBLIC);
const remaining = {
  files: remainFiles.length,
  mb: Math.round((remainFiles.reduce((s, f) => s + f.bytes, 0) / 1024 / 1024) * 10) / 10,
};

console.log(
  JSON.stringify(
    {
      mode: DRY_RUN ? "dry-run" : "delete",
      deletedFiles: deleted,
      deletedMB: Math.round((deletedBytes / 1024 / 1024) * 10) / 10,
      remaining,
    },
    null,
    2
  )
);
