#!/usr/bin/env node
/**
 * postinstall: generate Prisma client; tolerate OneDrive EPERM on local Windows paths.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function runGenerate(cwd) {
  return spawnSync(npx, ["prisma", "generate"], {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
}

let result = runGenerate(root);
if (result.status === 0) process.exit(0);

const clientPath = path.join(root, "node_modules", ".prisma", "client");
if (fs.existsSync(clientPath)) {
  console.warn("[prisma] generate failed but existing client found — continuing install");
  process.exit(0);
}

console.warn(
  "[prisma] generate failed (common on OneDrive paths). Run: npm run db:generate:safe"
);
process.exit(0);
