/**
 * Production build — typecheck once in a single Node process, then Next compile.
 * Avoids OOM during Next's "Linting and checking validity of types" phase on 8GB machines.
 */
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

const projectRoot = path.join(__dirname, "..");
const tscBin = path.join(projectRoot, "node_modules", "typescript", "bin", "tsc");

function totalRamMb() {
  return Math.floor(os.totalmem() / 1024 / 1024);
}

function tscHeapMb() {
  const total = totalRamMb();
  return String(Math.min(4096, Math.max(2048, total - 3072)));
}

function run(label, command, args, extraEnv = {}) {
  console.log(`\n> ${label}\n`);
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`System RAM: ~${totalRamMb()} MB — using split typecheck + compile build`);

run("Compress public gallery assets", process.execPath, [
  path.join(__dirname, "compress-edition-gallery-images.mjs"),
]);

run("Public asset audit", process.execPath, [
  path.join(__dirname, "public-asset-audit.mjs"),
]);

run("TypeScript check", process.execPath, [
  `--max-old-space-size=${tscHeapMb()}`,
  tscBin,
  "--noEmit",
]);

run("Next.js production build", process.execPath, [
  path.join(__dirname, "run-next.js"),
  "build",
], {
  SKIP_NEXT_STATIC_CHECKS: "1",
});
