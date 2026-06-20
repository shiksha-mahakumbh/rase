#!/usr/bin/env node
/**
 * Attempt GCP project shutdown after export (requires Owner on project).
 *
 * Usage:
 *   FIREBASE_SA_PATH=... node scripts/gcp-shutdown-project.mjs --dry-run
 *   FIREBASE_SA_PATH=... node scripts/gcp-shutdown-project.mjs --confirm
 *
 * If API delete fails, follow docs/GCP_CONSOLE_WALKTHROUGH.md Phase 7–8 manually.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DRY_RUN = !process.argv.includes("--confirm");
const PROJECT_ID = process.env.GCP_PROJECT_ID || "shiksha-mahakumbh-abhiyan";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

Object.assign(
  process.env,
  loadEnvFile(path.join(ROOT, ".env")),
  loadEnvFile(path.join(ROOT, ".env.local"))
);

function loadServiceAccountPath() {
  if (process.env.FIREBASE_SA_PATH) return path.resolve(process.env.FIREBASE_SA_PATH);
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return null;
  const fallback = path.join(
    process.env.USERPROFILE || "",
    "Downloads",
    "shiksha-mahakumbh-abhiyan-firebase-adminsdk-fbsvc-99720e9ed8.json"
  );
  if (fs.existsSync(fallback)) return fallback;
  throw new Error("Set FIREBASE_SA_PATH to service account JSON");
}

async function getAccessToken(credentials) {
  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  return client.getAccessToken().then((t) => t.token);
}

async function deleteProject(token) {
  const url = `https://cloudresourcemanager.googleapis.com/v1/projects/${PROJECT_ID}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function main() {
  console.log(DRY_RUN ? "Mode: DRY-RUN (pass --confirm to delete)\n" : "Mode: CONFIRM — scheduling project delete\n");

  const saPath = loadServiceAccountPath();
  const credentials = JSON.parse(fs.readFileSync(saPath, "utf8"));
  console.log(`Project: ${PROJECT_ID}`);
  console.log(`Service account: ${credentials.client_email}`);

  const exportManifest = path.join(ROOT, "exports", "gcp-firestore", "manifest.json");
  if (!fs.existsSync(exportManifest)) {
    console.warn("\nWarning: exports/gcp-firestore/manifest.json not found — run export:gcp-firestore first.");
  } else {
    const manifest = JSON.parse(fs.readFileSync(exportManifest, "utf8"));
    const totalDocs = Object.values(manifest.collections || {}).reduce(
      (n, c) => n + (c.count || 0),
      0
    );
    console.log(`\nExport verified: ${totalDocs} total Firestore docs in manifest (${manifest.exportedAt})`);
  }

  if (DRY_RUN) {
    console.log("\nDry-run complete. To schedule deletion:");
    console.log(`  $env:FIREBASE_SA_PATH="${saPath}"`);
    console.log("  node scripts/gcp-shutdown-project.mjs --confirm");
    console.log("\nOr use Console: docs/GCP_CONSOLE_WALKTHROUGH.md Phase 8");
    return;
  }

  const token = await getAccessToken(credentials);
  const result = await deleteProject(token);

  if (result.status === 200 || result.status === 204) {
    console.log("\nProject scheduled for deletion (30-day grace period).");
    console.log(JSON.stringify(result.body, null, 2));
    return;
  }

  console.error("\nAPI delete failed — use Google Cloud Console manually:");
  console.error(`  https://console.cloud.google.com/iam-admin/settings?project=${PROJECT_ID}`);
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
