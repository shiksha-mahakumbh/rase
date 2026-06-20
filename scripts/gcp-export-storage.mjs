#!/usr/bin/env node
/**
 * One-time Firebase Storage inventory (+ optional download) before GCP delete.
 *
 * Prerequisites:
 *   npm i -D firebase-admin
 *   FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SA_PATH
 *
 * Usage:
 *   node scripts/gcp-export-storage.mjs                    # manifest only
 *   node scripts/gcp-export-storage.mjs --download           # manifest + files
 *   node scripts/gcp-export-storage.mjs --out=./exports/gcp-storage
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOWNLOAD = process.argv.includes("--download");
const outArg = process.argv.find((a) => a.startsWith("--out="));
const outDir = path.resolve(outArg?.split("=")[1] ?? "./exports/gcp-storage");

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

function loadServiceAccount() {
  let raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw && process.env.FIREBASE_SA_PATH) {
    raw = fs.readFileSync(path.resolve(process.env.FIREBASE_SA_PATH), "utf8");
  }
  if (!raw) {
    throw new Error("Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SA_PATH");
  }
  return JSON.parse(raw);
}

async function listAllFiles(bucket, prefix = "") {
  const [files, , apiResponse] = await bucket.getFiles({
    prefix: prefix || undefined,
    autoPaginate: false,
    maxResults: 1000,
  });

  let all = [...files];
  let pageToken = apiResponse?.nextPageToken;

  while (pageToken) {
    const [nextFiles, , nextResponse] = await bucket.getFiles({
      prefix: prefix || undefined,
      autoPaginate: false,
      maxResults: 1000,
      pageToken,
    });
    all = all.concat(nextFiles);
    pageToken = nextResponse?.nextPageToken;
  }

  return all;
}

async function main() {
  let appMod;
  try {
    appMod = await import("firebase-admin/app");
    await import("firebase-admin/storage");
  } catch {
    console.error("Missing firebase-admin. Run: npm i -D firebase-admin");
    process.exit(1);
  }

  const { initializeApp, cert, getApps } = appMod;
  const { getStorage } = await import("firebase-admin/storage");

  const serviceAccount = loadServiceAccount();
  const bucketCandidates = [
    `${serviceAccount.project_id}.appspot.com`,
    `${serviceAccount.project_id}.firebasestorage.app`,
  ];
  if (process.env.FIREBASE_STORAGE_BUCKET) {
    bucketCandidates.unshift(process.env.FIREBASE_STORAGE_BUCKET);
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  }

  const storage = getStorage();
  let bucket = null;
  let bucketName = null;
  for (const name of bucketCandidates) {
    try {
      const candidate = storage.bucket(name);
      const [exists] = await candidate.exists();
      if (exists) {
        bucket = candidate;
        bucketName = name;
        break;
      }
    } catch {
      /* try next */
    }
  }

  if (!bucket) {
    const manifest = {
      exportedAt: new Date().toISOString(),
      bucket: null,
      note: "No Storage bucket found (tried: " + bucketCandidates.join(", ") + ")",
      files: [],
    };
    fs.mkdirSync(outDir, { recursive: true });
    const manifestPath = path.join(outDir, "storage-manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log("No Storage bucket found — wrote empty manifest:", manifestPath);
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Listing Storage bucket: ${bucketName}`);
  const files = await listAllFiles(bucket);
  console.log(`Found ${files.length} objects`);

  const manifest = {
    exportedAt: new Date().toISOString(),
    bucket: bucketName,
    download: DOWNLOAD,
    files: [],
  };

  for (const file of files) {
    const [metadata] = await file.getMetadata();
    const entry = {
      name: file.name,
      size: Number(metadata.size ?? 0),
      contentType: metadata.contentType ?? null,
      updated: metadata.updated ?? null,
    };

    if (DOWNLOAD) {
      const safePath = path.join(outDir, "files", file.name.replace(/\.\./g, "_"));
      fs.mkdirSync(path.dirname(safePath), { recursive: true });
      await file.download({ destination: safePath });
      entry.localPath = path.relative(outDir, safePath);
    }

    manifest.files.push(entry);
  }

  const manifestPath = path.join(outDir, "storage-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${manifestPath} (${manifest.files.length} files)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
