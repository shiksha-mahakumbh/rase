const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectRoot = path.join(__dirname, "..");
const nextDir = path.join(projectRoot, ".next");
const externalCache = path.join(
  process.env.LOCALAPPDATA || require("os").tmpdir(),
  "cursor-next-cache",
  path.basename(projectRoot),
  ".next"
);

function killNodeOnWindows() {
  if (process.platform !== "win32") return;
  try {
    execSync(
      'powershell -NoProfile -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"',
      { stdio: "ignore" }
    );
  } catch {
    /* no node processes */
  }
}

function removeDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Skip (not found): ${dirPath}`);
    return true;
  }
  try {
    fs.rmSync(dirPath, { recursive: true, force: true, maxRetries: 8, retryDelay: 300 });
    console.log(`Removed: ${dirPath}`);
    return true;
  } catch (err) {
    const stale = `${dirPath}.stale.${Date.now()}`;
    try {
      fs.renameSync(dirPath, stale);
      fs.rmSync(stale, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
      console.log(`Removed (via rename): ${dirPath}`);
      return true;
    } catch (renameErr) {
      console.error(`Could not remove ${dirPath} — stop \`next dev\` or pause OneDrive sync.\n`, renameErr.message);
      return false;
    }
  }
}

function removeJunction(linkPath) {
  if (!fs.existsSync(linkPath)) return;
  try {
    const real = fs.realpathSync.native(linkPath);
    if (path.normalize(real).toLowerCase() !== path.normalize(linkPath).toLowerCase()) {
      execSync(`cmd /c rmdir "${linkPath}"`, { stdio: "ignore" });
      console.log(`Removed junction: ${linkPath}`);
    }
  } catch {
    /* ignore */
  }
}

if (process.argv.includes("--kill-node")) {
  killNodeOnWindows();
}

removeJunction(nextDir);
const ok = [nextDir, externalCache].map(removeDir);
if (ok.some((v) => !v)) {
  process.exit(1);
}

if (projectRoot.replace(/\\/g, "/").includes("/OneDrive/")) {
  console.log(
    "\nOneDrive tip: if you see EPERM on .next/trace, pause OneDrive sync for this folder while running dev/build.\n"
  );
}
