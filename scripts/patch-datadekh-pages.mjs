#!/usr/bin/env node
/**
 * One-off helper: patch legacy *datadekh pages to use admin API instead of Firestore.
 * Safe to re-run; skips files already migrated.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const PAGE_TYPES = {
  "src/app/volunteerdatadekh/page.tsx": "Volunteer",
  "src/app/volunteerregistrationdatadekh/page.tsx": "Volunteer",
  "src/app/ngoregistrationdatadekh/page.tsx": "NGO",
  "src/app/participantregistrationdatadekh/page.tsx": "Delegate Registration",
  "src/app/Bestpracticedata/page.tsx": "Best Practices",
  "src/app/Talentdata/page.tsx": "Talent",
  "src/app/abstractdatadekh/page.tsx": "Abstract Submission",
  "src/app/abstractdatadekhsm24/page.tsx": "Abstract Submission",
  "src/app/fulllengthpaperdatadekh/page.tsx": "Paper Submission",
  "src/app/fulllengthdatadekhsm24/page.tsx": "Paper Submission",
  "src/app/fulllengthdatadekh/page.tsx": "Paper Submission",
  "src/app/accomodationdata/page.tsx": "Accommodation",
  "src/app/schooldata/page.tsx": "School Program",
  "src/app/heiprojectregistrationdata/page.tsx": "Projects",
  "src/app/organiserdatadekh/page.tsx": "Organiser",
  "src/app/DelegateForm/page.tsx": "Paper Submission",
};

for (const [rel, regType] of Object.entries(PAGE_TYPES)) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) {
    console.warn("skip missing", rel);
    continue;
  }
  let src = fs.readFileSync(filePath, "utf8");
  if (src.includes("useAdminRegistrationData")) {
    console.log("already migrated", rel);
    continue;
  }
  if (!src.includes("firebase/firestore") && !src.includes("@/app/firebase")) {
    console.log("no firebase import", rel);
    continue;
  }

  src = src.replace(
    /import \{ db[^}]*\} from ["']@\/app\/firebase["'];?\r?\n/g,
    ""
  );
  src = src.replace(
    /import \{ collection, getDocs[^}]*\} from ["']firebase\/firestore["'];?\r?\n/g,
    ""
  );
  src = src.replace(
    /import \{ initializeApp[^}]*\} from ["']firebase\/app["'];?\r?\n/g,
    ""
  );
  src = src.replace(
    /import \{ getFirestore[^}]*\} from ["']firebase\/firestore["'];?\r?\n/g,
    ""
  );
  src = src.replace(
    /import \{ firebaseConfig[^}]*\} from ["'][^"']*firebase[^"']*["'];?\r?\n/g,
    ""
  );
  src = src.replace(
    /import \{ ref, getDownloadURL[^}]*\} from ["']firebase\/storage["'];?\r?\n/g,
    ""
  );
  src = src.replace(
    /import \{ db, storage \} from ["']@\/app\/firebase["'];?[^\n]*\n/g,
    ""
  );
  src = src.replace(
    /const app = initializeApp\(firebaseConfig\);[\s\S]*?const firestore = getFirestoreFromApp\(app\);?\r?\n/g,
    ""
  );

  if (!src.includes("useAdminRegistrationData")) {
    const reactImport = src.match(/^import React[^;]+;/m)?.[0] ?? 'import React, { useEffect, useState } from "react";';
    if (!reactImport.includes("useEffect")) {
      src = src.replace(
        /^import React[^;]+;/m,
        'import React, { useEffect, useState } from "react";'
      );
    }
    src = src.replace(
      /^(import React[^\n]+\n)/m,
      `$1import { useAdminRegistrationData, rowToLegacyRecord } from "@/lib/legacy/useAdminRegistrationData";\n`
    );
  }

  const fetchBlock =
    /useEffect\(\(\) => \{[\s\S]*?fetchData\(\);[\s\S]*?\}, \[\]\);/m;
  const replacement = `const { rows, loading: dataLoading } = useAdminRegistrationData("${regType}");

  useEffect(() => {
    if (dataLoading) return;
    const dataList = rows.map((row, index) => ({
      ...(rowToLegacyRecord(row) as Record<string, unknown>),
      serial: index + 1,
    }));
    setFormDataList(dataList as typeof formDataList);
    setEmailsSent(Array(dataList.length).fill(false));
  }, [rows, dataLoading]);`;

  if (fetchBlock.test(src)) {
    src = src.replace(fetchBlock, replacement);
  } else {
    console.warn("could not patch useEffect in", rel);
    continue;
  }

  fs.writeFileSync(filePath, src);
  console.log("patched", rel);
}
