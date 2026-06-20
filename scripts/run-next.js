/**
 * Run Next.js CLI with OneDrive trace fix preloaded in the child process.
 * Usage: node scripts/run-next.js dev | build | start ...
 */
const path = require("path");
const { spawn } = require("child_process");

const projectRoot = path.join(__dirname, "..");
const fixPath = path.join(__dirname, "next-onedrive-fix.js");
const nextArgs = process.argv.slice(2);

if (nextArgs.length === 0) {
  console.error("Usage: node scripts/run-next.js <next-command> [args...]");
  process.exit(1);
}

/** Large Next.js + TS projects often OOM during `next build` type-check on default ~512MB heap. */
const heapMb = nextArgs[0] === "build" ? 8192 : 4096;

const nodeOptions = [
  process.env.NODE_OPTIONS || "",
  `--max-old-space-size=${heapMb}`,
  `--require "${fixPath.replace(/\\/g, "/")}"`,
]
  .join(" ")
  .trim();

const child = spawn(process.execPath, [path.join(projectRoot, "node_modules", "next", "dist", "bin", "next"), ...nextArgs], {
  cwd: projectRoot,
  stdio: "inherit",
  shell: false,
  env: {
    ...process.env,
    NODE_OPTIONS: nodeOptions,
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});
