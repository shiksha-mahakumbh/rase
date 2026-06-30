#!/usr/bin/env node
/**
 * Generate @prisma/client from a temp directory (OneDrive EPERM workaround).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const work = path.join(tmpdir(), "rase-prisma-gen");

function run(cmd, args, cwd, label) {
  console.log(`\n=== ${label} ===`);
  const r = spawnSync(cmd, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });

copyDir(path.join(root, "prisma"), path.join(work, "prisma"));
fs.copyFileSync(path.join(root, "prisma.config.mjs"), path.join(work, "prisma.config.mjs"));
fs.copyFileSync(path.join(root, "package.json"), path.join(work, "package.json"));

run("npm", ["install", "prisma@6.19.3", "@prisma/client@6.19.3", "--no-save"], work, "install prisma in temp");
run(npx, ["prisma", "generate"], work, "prisma generate in temp");

const srcClient = path.join(work, "node_modules", ".prisma");
const destClient = path.join(root, "node_modules", ".prisma");
const srcPkg = path.join(work, "node_modules", "@prisma", "client");
const destPkg = path.join(root, "node_modules", "@prisma", "client");

fs.rmSync(destClient, { recursive: true, force: true });
fs.rmSync(destPkg, { recursive: true, force: true });
copyDir(srcClient, destClient);
copyDir(srcPkg, destPkg);

console.log("\n[ok] Prisma client copied to project node_modules");
