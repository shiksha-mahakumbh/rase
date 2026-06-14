/**
 * Set ADMIN_BOOTSTRAP_EMAILS on Vercel Production.
 * Usage: node scripts/_set-vercel-admin-bootstrap.mjs
 */
import { spawnSync } from "node:child_process";

const VALUE = "shikshamahakumbh23@gmail.com,interns.dhe@gmail.com";

const result = spawnSync(
  "npx",
  ["vercel", "env", "add", "ADMIN_BOOTSTRAP_EMAILS", "production", "--force"],
  {
    input: VALUE,
    encoding: "utf8",
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  }
);

if (result.status !== 0) {
  console.error("Failed:", result.stderr || result.stdout);
  process.exit(1);
}

console.log("Set ADMIN_BOOTSTRAP_EMAILS on Vercel Production");
console.log("Emails:", VALUE.split(",").join(", "));
