import fs from "fs";
import path from "path";

const root = "src/app";

const legacyRedirects = [
  ["pastevent", "/past-events"],
  ["upcomingevent", "/upcoming-events"],
  ["ContactUs", "/contact-us"],
  ["Best_Wishes", "/best-wishes"],
  ["Wishes_Received", "/wishes-received"],
  ["committeepage", "/committees"],
  ["media/page.tsx", null], // handled separately — only redirect hub page
  ["Press_Release", "/press"],
  ["commingsoon", "/coming-soon"],
  ["Accomodation", "/accommodation"],
  ["VibhagRoute/AcademicCouncil24", "/departments/academic-council"],
  ["VibhagRoute/Prabandhan24", "/departments/prabandhan"],
  ["VibhagRoute/Prachar24", "/departments/prachar"],
  ["VibhagRoute/Sampark24", "/departments/sampark"],
  ["VibhagRoute/Vitt24", "/departments/vitt"],
  ["Press1", "/press/baton-ceremony-smk-4"],
  ["Press2", "/press/shiksha-mahakumbh-4-0"],
  ["Press3", "/press/residential-camp-success"],
  ["Press4", "/press/residential-camp-hindi"],
  ["Press5", "/press/national-coverage"],
  ["Press6", "/press/education-summit-coverage"],
  ["Press7", "/press/mahakumbh-programme-update"],
  ["Press8", "/press/education-movement"],
  ["Press9", "/press/summit-highlights"],
  ["shikshamahakumbh2024digitalmedia", "/media/shiksha-mahakumbh/2024/digital"],
  ["shikshamahakumbh2023digitalmedia", "/media/shiksha-mahakumbh/2023/digital"],
  ["shikshakumbh2024digitalmedia", "/media/shiksha-kumbh/2024/digital"],
  ["shikshakumbh2023digitalmedia", "/media/shiksha-kumbh/2023/digital"],
  ["printmediashikshamahakumbh2024", "/media/shiksha-mahakumbh/2024/print"],
  ["printmediashikshamahakumbh2023", "/media/shiksha-mahakumbh/2023/print"],
  ["printmediashikshakumbh2024", "/media/shiksha-kumbh/2024/print"],
  ["printmediashikshakumbh2023", "/media/shiksha-kumbh/2023/print"],
];

const pressMap = [
  ["baton-ceremony-smk-4", 1],
  ["shiksha-mahakumbh-4-0", 2],
  ["residential-camp-success", 3],
  ["residential-camp-hindi", 4],
  ["national-coverage", 5],
  ["education-summit-coverage", 6],
  ["mahakumbh-programme-update", 7],
  ["education-movement", 8],
  ["summit-highlights", 9],
];

const redirectStub = (dest) => `import { createLegacyRedirect } from "@/lib/routing/legacy-redirect-page";

export default createLegacyRedirect("${dest}");
`;

for (const [slug, num] of pressMap) {
  const dir = path.join(root, "press", slug);
  const srcPage = path.join(root, `Press${num}`, "page.tsx");
  const srcLayout = path.join(root, `Press${num}`, "layout.tsx");
  fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(srcPage) && !fs.existsSync(path.join(dir, "page.tsx"))) {
    fs.copyFileSync(srcPage, path.join(dir, "page.tsx"));
  }
  if (fs.existsSync(srcLayout) && !fs.existsSync(path.join(dir, "layout.tsx"))) {
    fs.copyFileSync(srcLayout, path.join(dir, "layout.tsx"));
  }
}

for (const [dir, dest] of legacyRedirects) {
  if (!dest) continue;
  const pagePath = path.join(root, dir, "page.tsx");
  if (fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, redirectStub(dest), "utf8");
  }
}

// Media hub only — not dynamic archive routes
const mediaHubPage = path.join(root, "media", "page.tsx");
if (fs.existsSync(mediaHubPage)) {
  fs.writeFileSync(mediaHubPage, redirectStub("/media-center"), "utf8");
}

// academicsouncil → departments
const acPage = path.join(root, "academiccouncil", "page.tsx");
fs.writeFileSync(acPage, redirectStub("/departments/academic-council"), "utf8");

console.log("P2 setup: press copies + legacy redirect stubs written");
