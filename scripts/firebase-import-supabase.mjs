#!/usr/bin/env node
/**
 * Import Firebase JSON exports into Supabase Postgres via Prisma.
 * Requires DATABASE_URL and export files from firebase-export.mjs.
 *
 * Usage: npm run firebase:import -- --in=./exports/firebase
 * Idempotent-ish: skips rows when registrationId already exists.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const inArg = process.argv.find((a) => a.startsWith("--in="));
const inDir = path.resolve(inArg?.split("=")[1] ?? "./exports/firebase");

const prisma = new PrismaClient();

const COLLECTION_TYPE_MAP = {
  registrations: "Legacy_Other",
  conclave_registrations: "Conclave",
  delegate_registrations: "Delegate",
  RegestrationNGOsm24: "NGO",
  RegestrationVolsm24: "Volunteer",
  ParticipantRegsm24: "Delegate",
  AbstractSubmissionDataSM24: "Legacy_Other",
  FullLengthSubmissionDataSM24: "Legacy_Other",
  BestPractices: "Best_Practices",
  talent: "Talent",
  Accommodation2025: "Accommodation",
  organiserregistration: "Legacy_Other",
  SchoolProjectFormdata: "Participant",
  heiprojectformdata: "Exhibition",
};

function pickEmail(data) {
  const email = data.email ?? data.CorrespondingAuthorEmail ?? data.Email;
  return email ? String(email).trim().toLowerCase() : null;
}

function pickName(data) {
  return String(
    data.fullName ?? data.name ?? data.CorrespondingAuthorName ?? data.keyPerson ?? "Unknown"
  ).trim();
}

async function importCollection(fileName, registrationType) {
  const filePath = path.join(inDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn("skip missing", fileName);
    return { imported: 0, skipped: 0 };
  }

  const rows = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    const registrationId =
      row.registrationId ??
      row.registration_id ??
      `LEGACY-${fileName.replace(".json", "")}-${row.id}`;

    const exists = await prisma.registration.findFirst({
      where: { registrationId },
      select: { id: true },
    });
    if (exists) {
      skipped++;
      continue;
    }

    const email = pickEmail(row);
    if (!email) {
      skipped++;
      continue;
    }

    await prisma.registration.create({
      data: {
        registrationId,
        registrationType,
        fullName: pickName(row),
        email,
        contactNumber: String(row.contactNumber ?? row.PhoneNumber ?? row.phone ?? ""),
        institution: String(row.institution ?? row.institutionName ?? row.schoolName ?? "N/A"),
        designation: String(row.designation ?? "N/A"),
        address: String(row.address ?? "N/A"),
        country: "India",
        gender: "Other",
        vidyaBharti: "Non_Vidya_Bharti",
        accommodationRequired: "No",
        paymentStatus: "Not_Required",
        registrationStatus: "Submitted",
        accommodationStatus: "Not_Required",
        metadata: row,
      },
    });
    imported++;
  }

  return { imported, skipped };
}

async function main() {
  if (!fs.existsSync(inDir)) {
    throw new Error(`Import directory not found: ${inDir}`);
  }

  const summary = {};
  for (const [collection, type] of Object.entries(COLLECTION_TYPE_MAP)) {
    const file = `${collection}.json`;
    summary[collection] = await importCollection(file, type);
    console.log(collection, summary[collection]);
  }

  fs.writeFileSync(
    path.join(inDir, "import-summary.json"),
    JSON.stringify({ importedAt: new Date().toISOString(), summary }, null, 2)
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
