#!/usr/bin/env node
/**
 * Upload Proceeding1–3.pdf to GitHub Releases CDN (off-repo, ~79 MB).
 *
 * Usage:
 *   node scripts/upload-proceedings-github-release.mjs
 *   node scripts/upload-proceedings-github-release.mjs --dry-run
 *   node scripts/upload-proceedings-github-release.mjs --tag proceedings-cdn-v2
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  PROCEEDINGS_CDN_FILES,
  PROCEEDINGS_CDN_RELEASE,
  proceedingsCdnUrl,
} from "../src/config/proceedings-pdf-cdn.cjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const dryRun = process.argv.includes("--dry-run");
const tagArg = process.argv.find((a) => a.startsWith("--tag="));
const tag = tagArg ? tagArg.split("=")[1] : PROCEEDINGS_CDN_RELEASE;

const FILES = Object.entries(PROCEEDINGS_CDN_FILES).map(([vol, filename]) => ({
  vol,
  local: path.join(ROOT, "public", filename),
  filename,
}));

function main() {
  for (const { local, filename } of FILES) {
    if (!fs.existsSync(local)) {
      console.error(`Missing ${path.relative(ROOT, local)} — restore from release or git history`);
      process.exit(1);
    }
    const mb = (fs.statSync(local).size / 1024 / 1024).toFixed(1);
    console.log(`Found ${filename} (${mb} MB)`);
  }

  const assetArgs = FILES.flatMap(({ local, filename }) => [`${local}#${filename}`]);

  if (dryRun) {
    console.log(`[dry-run] gh release create ${tag} with ${FILES.length} assets`);
    for (const { filename } of FILES) {
      console.log(`  → ${proceedingsCdnUrl(filename)}`);
    }
    return;
  }

  const view = spawnSync("gh", ["release", "view", tag], { encoding: "utf8" });
  const exists = view.status === 0;

  const args = exists
    ? ["release", "upload", tag, ...assetArgs]
    : [
        "release",
        "create",
        tag,
        "--title",
        "Proceedings PDF CDN (Proceeding1-3)",
        "--notes",
        "Off-repo CDN for conference proceedings PDFs. Used by rase.co.in download links and legacy /Proceeding*.pdf redirects.",
        ...assetArgs,
      ];

  console.log(`Running: gh ${args.join(" ")}`);
  const result = spawnSync("gh", args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);

  console.log("\nProceedings CDN URLs:");
  for (const { vol, filename } of FILES) {
    console.log(`  ${vol}: ${proceedingsCdnUrl(filename)}`);
  }
}

main();
