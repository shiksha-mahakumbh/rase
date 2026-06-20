/**
 * OneDrive EPERM fix: redirect `.next/trace` writes to LOCALAPPDATA and
 * swallow lock errors so Ctrl+C does not crash the dev server.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const projectRoot = path.join(__dirname, "..");
const isOneDrive = projectRoot.replace(/\\/g, "/").includes("/OneDrive/");

if (!isOneDrive) {
  module.exports = {};
  return;
}

const traceTarget = path.join(
  process.env.LOCALAPPDATA || os.tmpdir(),
  "rase-co-in",
  "next-trace.log"
);

try {
  fs.mkdirSync(path.dirname(traceTarget), { recursive: true });
} catch {
  /* ignore */
}

const originalCreateWriteStream = fs.createWriteStream;

fs.createWriteStream = function patchedCreateWriteStream(file, options) {
  let target = file;
  const normalized = String(file).replace(/\\/g, "/");
  if (normalized.endsWith(".next/trace")) {
    target = traceTarget;
  }

  const stream = originalCreateWriteStream.call(fs, target, options);
  stream.on("error", (err) => {
    if (err && (err.code === "EPERM" || err.code === "EACCES")) {
      return;
    }
    console.warn("[next-onedrive-fix] trace write error:", err.message);
  });
  return stream;
};

module.exports = { traceTarget };
