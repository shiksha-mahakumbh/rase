const fs = require("fs");
const path = require("path");

const nextDir = path.join(__dirname, "..", ".next");

if (fs.existsSync(nextDir)) {
  try {
    fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    console.log("Removed .next cache");
  } catch (err) {
    console.error(
      "Could not remove .next — stop `next dev` / close other Node processes, then run again.\n",
      err.message
    );
    process.exit(1);
  }
} else {
  console.log(".next not found — nothing to clean");
}
