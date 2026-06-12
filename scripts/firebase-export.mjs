#!/usr/bin/env node
/**
 * Export Firestore collections to JSON for one-time migration.
 * Requires firebase-admin (devDependency) and FIREBASE_SERVICE_ACCOUNT_JSON.
 *
 * Usage: npm run firebase:export -- --out=./exports/firebase
 * Do NOT run against production without explicit approval.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return out;
}

Object.assign(
  process.env,
  loadEnvFile(path.resolve(".env")),
  loadEnvFile(path.resolve(".env.local"))
);

const outArg = process.argv.find((a) => a.startsWith("--out="));
const outDir = path.resolve(outArg?.split("=")[1] ?? "./exports/firebase");

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is required for export");
  }
  return JSON.parse(raw);
}

async function main() {
  let appMod;
  let firestoreMod;
  try {
    appMod = await import("firebase-admin/app");
    firestoreMod = await import("firebase-admin/firestore");
  } catch {
    console.error(
      "firebase-admin is not installed. Add it temporarily: npm i -D firebase-admin"
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
    });
  }

  const db = getFirestore(getApps()[0], "default");
  fs.mkdirSync(outDir, { recursive: true });

  const collections = [
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
    "events",
    "wishesReceived",
    "keynoteSpeakers",
  ];

  const manifest = { exportedAt: new Date().toISOString(), collections: {} };

  for (const name of collections) {
    const snap = await db.collection(name).get();
    const docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const file = path.join(outDir, `${name}.json`);
    fs.writeFileSync(file, JSON.stringify(docs, null, 2));
    manifest.collections[name] = { count: docs.length, file: path.basename(file) };
    console.log(`exported ${name}: ${docs.length} docs`);
  }

  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("export complete:", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
