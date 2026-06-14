const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const nextDir = path.join(__dirname, "..", ".next");

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

function removeNextDir() {
  if (!fs.existsSync(nextDir)) {
    console.log(".next not found — nothing to clean");
    return true;
  }
  try {
    fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 8, retryDelay: 300 });
    console.log("Removed .next cache");
    return true;
  } catch (err) {
    // OneDrive often locks .next/trace — rename and delete on next run
    const stale = `${nextDir}.stale.${Date.now()}`;
    try {
      fs.renameSync(nextDir, stale);
      fs.rmSync(stale, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
      console.log("Removed .next cache (via rename fallback)");
      return true;
    } catch (renameErr) {
      console.error(
        "Could not remove .next — stop `next dev` / close Node processes, or pause OneDrive sync.\n",
        renameErr.message
      );
      return false;
    }
  }
}

if (process.argv.includes("--kill-node")) {
  killNodeOnWindows();
}

if (!removeNextDir()) {
  process.exit(1);
}
