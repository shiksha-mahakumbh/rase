#!/usr/bin/env node
/**
 * Seed registrationCounters/smk2026 for server-authoritative ID generation.
 * Usage: node scripts/seed-firestore-counter.mjs
 *
 * Requires FIREBASE_SERVICE_ACCOUNT_JSON in environment or .env.local
 */
import fs from "node:fs";
import path from "node:path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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

const env = {
  ...loadEnvFile(path.resolve(".env")),
  ...loadEnvFile(path.resolve(".env.local")),
  ...process.env,
};

const raw = env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw?.trim()) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");
  process.exit(1);
}

const serviceAccount = JSON.parse(raw);
const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });

const db = getFirestore(app);
const counterRef = db.collection("registrationCounters").doc("smk2026");

const existing = await counterRef.get();
const current = existing.exists
  ? Number(existing.data()?.lastNumber ?? existing.data()?.currentNumber ?? 0)
  : 0;

await counterRef.set(
  {
    lastNumber: current,
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true }
);

console.log(
  JSON.stringify(
    {
      ok: true,
      path: "registrationCounters/smk2026",
      lastNumber: current,
      note: existing.exists
        ? "Counter preserved (merge)"
        : "Counter initialized",
    },
    null,
    2
  )
);
