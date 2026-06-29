#!/usr/bin/env node
/**
 * Purge large deleted paths from entire git history (requires force-push after).
 * Usage: node scripts/purge-git-history-blobs.mjs [--dry-run]
 */
import { spawnSync } from "node:child_process";

const dryRun = process.argv.includes("--dry-run");

const PATHS = [
  "public/abhiyanphotoframe.pdf",
  "public/Proceeding1.pdf",
  "public/Proceeding2.pdf",
  "public/Proceeding3.pdf",
  "public/conference",
  "public/2024K/2024M",
  "public/abhiyan-photo-frame",
  "docs/lighthouse",
  "scripts/pdf-extract-tmp",
  "build-output.txt",
];

const rmCmd = `git rm -rf --cached --ignore-unmatch ${PATHS.join(" ")}`;

function run(cmd, label) {
  console.log(`\n=== ${label} ===\n${cmd}\n`);
  if (dryRun) return 0;
  const r = spawnSync(cmd, { shell: true, stdio: "inherit" });
  return r.status ?? 1;
}

console.log(dryRun ? "DRY RUN" : "APPLY — rewriting all refs");
console.log("Paths:", PATHS.join(", "));

let code = run(
  `git filter-branch --force --index-filter "${rmCmd}" --prune-empty --tag-name-filter cat -- --all`,
  "filter-branch"
);
if (code !== 0) process.exit(code);

code = run("git reflog expire --expire=now --all", "expire reflog");
if (code !== 0) process.exit(code);

code = run("git gc --prune=now --aggressive", "gc aggressive");
if (code !== 0) process.exit(code);

console.log("\nDone. Verify with: git count-objects -vH");
console.log("Then: git push origin main --force-with-lease");
console.log("     git push origin --force --tags");
