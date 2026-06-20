/**
 * One-time splitter: AcademicCouncil24.tsx → academic/pages/*.tsx
 * @deprecated Completed — src/app/component/ removed. Pages live under src/components/vibhag/.
 * Run: node scripts/split-academic-council.mjs
 */
import fs from "fs";
import path from "path";

const srcPath = path.join(
  process.cwd(),
  "src/components/vibhag/AcademicCouncil24.tsx"
);
const outDir = path.join(
  process.cwd(),
  "src/components/vibhag/academic/pages"
);

const content = fs.readFileSync(srcPath, "utf8");
const lines = content.split("\n");

const pageNames = [
  "ConferencePage",
  "ConclavePage",
  "AwardsPage",
  "OlympiadPage",
  "ExhibitionPage",
  "ProjectsPage",
  "BestPracticesPage",
  "PatrikaPage",
  "CulturalPage",
];

function findLine(prefix) {
  return lines.findIndex((l) => l.startsWith(prefix));
}

const imports = `"use client";

import {
  ACPage,
  ACHero,
  ACSection,
  ACCard,
  ACGlassPanel,
  ACObjectiveCard,
  ACTimelineStep,
  ACContactBlock,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { tracks } from "../tracks-data";
import OverviewPage from "../AcademicCouncilOverview";
import { OpenBestPracticesSection } from "../OpenBestPracticesSection";

`;

fs.mkdirSync(outDir, { recursive: true });

const starts = pageNames.map((name) => ({
  name,
  start: findLine(`function ${name}()`),
}));

const dashboardStart = findLine("const pageMap");

for (let i = 0; i < starts.length; i++) {
  const { name, start } = starts[i];
  const end =
    i + 1 < starts.length ? starts[i + 1].start : dashboardStart;
  if (start < 0) continue;

  let body = lines.slice(start, end).join("\n");
  body = body.replace(/^function /, "export default function ");
  const file = `${imports}\n${body}\n`;
  fs.writeFileSync(path.join(outDir, `${name}.tsx`), file);
  console.log(`Wrote ${name}.tsx (${end - start} lines)`);
}

// tracks-data.ts
const tracksStart = lines.findIndex((l) => l.trim() === "const tracks = [");
const tracksEnd = lines.findIndex(
  (l, i) => i > tracksStart && l.trim() === "];"
);
if (tracksStart >= 0 && tracksEnd > tracksStart) {
  const tracksBlock = lines.slice(tracksStart, tracksEnd + 1).join("\n");
  fs.writeFileSync(
    path.join(process.cwd(), "src/components/vibhag/academic/tracks-data.ts"),
    `${tracksBlock}\n\nexport { tracks };\n`
  );
  console.log("Wrote tracks-data.ts");
}

console.log("Done. Update AcademicCouncil24.tsx manually to use imports from academic/pages/");
