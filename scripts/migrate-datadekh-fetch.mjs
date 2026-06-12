#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src/app");

const pages = [
  { file: "Bestpracticedata/page.tsx", type: "Best Practices", setter: "setFormDataList" },
  { file: "ngoregistrationdatadekh/page.tsx", type: "NGO", setter: "setFormDataList" },
  { file: "volunteerdatadekh/page.tsx", type: "Volunteer", setter: "setFormDataList" },
  { file: "volunteerregistrationdatadekh/page.tsx", type: "Volunteer", setter: "setFormDataList" },
  { file: "Talentdata/page.tsx", type: "Talent", setter: "setFormDataList" },
  { file: "accomodationdata/page.tsx", type: "Accommodation", setter: "setFormDataList" },
  { file: "participantregistrationdatadekh/page.tsx", type: "School Program", setter: "setFormDataList" },
  { file: "schooldata/page.tsx", type: "School Program", setter: "setFormDataList" },
  { file: "heiprojectregistrationdata/page.tsx", type: "Exhibition", setter: "setFormDataList" },
  { file: "abstractdatadekh/page.tsx", type: "Abstract Submission", setter: "setFormDataList" },
  { file: "abstractdatadekhsm24/page.tsx", type: "Abstract Submission", setter: "setFormDataList" },
  { file: "fulllengthdatadekh/page.tsx", type: "Paper Submission", setter: "setFormDataList" },
  { file: "fulllengthdatadekhsm24/page.tsx", type: "Paper Submission", setter: "setFormDataList" },
  { file: "fulllengthpaperdatadekh/page.tsx", type: "Paper Submission", setter: "setFormDataList" },
  { file: "DelegateForm/page.tsx", type: "Paper Submission", setter: "setFormDataList" },
  { file: "organiserdatadekh/page.tsx", type: "Volunteer", setter: "setRegistrations" },
];

for (const { file, type, setter } of pages) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, "utf8");
  content = content
    .replace(/^import.*firebase.*\n/gim, "")
    .replace(/^import.*@\/app\/firebase.*\n/gim, "")
    .replace(/^import.*\.\.\/firebase.*\n/gim, "")
    .replace(/^import.*firebase\/firestore.*\n/gim, "")
    .replace(/^import.*firebase\/storage.*\n/gim, "")
    .replace(/^import.*firebase\/app.*\n/gim, "")
    .replace(/const app = initializeApp\(firebaseConfig\);[\s\S]*?;\n/g, "")
    .replace(/const firestore = getFirestoreFromApp\(app\);[\s\S]*?;\n/g, "");

  if (!content.includes("legacy-registration-fetch")) {
    content = content.replace(
      /^(["']use client["'];\n)/,
      `$1import { fetchGatewayRegistrations, mergedRegistrationFields } from "@/lib/admin/legacy-registration-fetch";\n`
    );
  }

  const effect = `useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await fetchGatewayRegistrations("${type}");
        const fetchedData = items.map((item, index) => ({
          ...mergedRegistrationFields(item),
          serial: index + 1,
        }));
        ${setter}(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);`;

  content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/, effect);
  fs.writeFileSync(filePath, content);
  console.log("updated", file);
}
