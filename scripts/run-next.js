/**
 * Run Next.js CLI with OneDrive trace fix preloaded in the child process.
 * Usage: node scripts/run-next.js dev | build | start ...
 */
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const projectRoot = path.join(__dirname, "..");
const fixPath = path.join(__dirname, "next-onedrive-fix.js");
const nextArgs = process.argv.slice(2);

if (nextArgs.length === 0) {
  console.error("Usage: node scripts/run-next.js <next-command> [args...]");
  process.exit(1);
}

function heapMbFor(command) {
  const totalMb = Math.floor(os.totalmem() / 1024 / 1024);
  const reserve = command === "build" ? 3072 : 2048;
  const budget = Math.max(2048, Math.min(6144, totalMb - reserve));
  if (command === "build" && process.env.SKIP_NEXT_STATIC_CHECKS === "1") {
    return Math.min(4096, budget);
  }
  return budget;
}

const heapMb = heapMbFor(nextArgs[0]);

const nodeOptions = [
  process.env.NODE_OPTIONS || "",
  `--max-old-space-size=${heapMb}`,
  `--require=${fixPath.replace(/\\/g, "/")}`,
]
  .filter(Boolean)
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
