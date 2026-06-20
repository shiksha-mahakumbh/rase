#!/usr/bin/env node
/**
 * One-time Firestore export → JSON files (cold archive before GCP delete).
 *
 * Prerequisites:
 *   npm i -D firebase-admin
 *   FIREBASE_SERVICE_ACCOUNT_JSON in env, or path in FIREBASE_SA_PATH
 *
 * Usage:
 *   node scripts/gcp-export-firestore.mjs
 *   node scripts/gcp-export-firestore.mjs --out=./exports/gcp-firestore
 *   node scripts/gcp-export-firestore.mjs --collections=registrations,audit_logs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

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

const outArg = process.argv.find((a) => a.startsWith("--out="));
const collectionsArg = process.argv.find((a) => a.startsWith("--collections="));
const outDir = path.resolve(outArg?.split("=")[1] ?? "./exports/gcp-firestore");

const DEFAULT_COLLECTIONS = [
  "registrations",
  "registrationCounters",
  "conclave_registrations",
  "delegate_registrations",
  "RegestrationNGOsm24",
  "RegestrationVolsm24",
  "ParticipantRegsm24",
  "AbstractSubmissionDataSM24",
  "FullLengthSubmissionDataSM24",
  "BestPractices",
  "talent",
  "Accommodation2025",
  "organiserregistration",
  "SchoolProjectFormdata",
  "heiprojectformdata",
  "paymentRecords",
  "audit_logs",
  "events",
  "wishesReceived",
  "keynoteSpeakers",
];

const collections = collectionsArg
  ? collectionsArg.split("=")[1].split(",").map((s) => s.trim()).filter(Boolean)
  : DEFAULT_COLLECTIONS;

function loadServiceAccount() {
  let raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw && process.env.FIREBASE_SA_PATH) {
    raw = fs.readFileSync(path.resolve(process.env.FIREBASE_SA_PATH), "utf8");
  }
  if (!raw) {
    throw new Error(
      "Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SA_PATH (create key in GCP Console → IAM → Service Accounts)"
    );
  }
  return JSON.parse(raw);
}

function serializeValue(value) {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = serializeValue(v);
    return out;
  }
  return value;
}

async function exportCollection(db, name) {
  const snap = await db.collection(name).get();
  const rows = snap.docs.map((doc) => ({
    id: doc.id,
    ...serializeValue(doc.data()),
  }));
  const filePath = path.join(outDir, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(rows, null, 2));
  return { collection: name, count: rows.length, file: filePath };
}

async function main() {
  let appMod;
  let firestoreMod;
  try {
    appMod = await import("firebase-admin/app");
    firestoreMod = await import("firebase-admin/firestore");
  } catch {
    console.error(
      "Missing firebase-admin. Install once:\n  npm i -D firebase-admin\n  node scripts/gcp-export-firestore.mjs"
    );
    process.exit(1);
  }

  const { initializeApp, cert, getApps } = appMod;
  const { getFirestore } = firestoreMod;

  const serviceAccount = loadServiceAccount();
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
      storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
    });
  }

  const db = getFirestore(getApps()[0], "default");
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Exporting ${collections.length} collections → ${outDir}\n`);

  const manifest = {
    exportedAt: new Date().toISOString(),
    projectId: serviceAccount.project_id,
    database: "default",
    collections: {},
  };

  for (const name of collections) {
    try {
      const result = await exportCollection(db, name);
      manifest.collections[name] = { count: result.count, file: path.basename(result.file) };
      console.log(`  ${name}: ${result.count} docs`);
    } catch (e) {
      manifest.collections[name] = { count: 0, error: e.message ?? String(e) };
      console.warn(`  ${name}: SKIP — ${e.message ?? e}`);
    }
  }

  const manifestPath = path.join(outDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nWrote ${manifestPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
