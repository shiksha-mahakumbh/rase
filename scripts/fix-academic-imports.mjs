import fs from "fs";
import path from "path";

const pagesDir = "src/app/component/Vibhag/academic/pages";

const pageImports = {
  AwardsPage: ["awardCategories"],
  OlympiadPage: [
    "olympiadCategories",
    "olympiadObjectives",
    "examFeatures",
    "participationSteps",
    "olympiadBenefits",
  ],
  ExhibitionPage: [
    "exhibitionSegments",
    "exhibitionParticipants",
    "exhibitionObjectives",
    "exhibitionBenefits",
  ],
  ProjectsPage: ["projectThemes", "projectBenefits"],
  BestPracticesPage: [
    "bestPracticeCategories",
    "submissionRequirements",
    "evaluationCriteria",
    "recognitionBenefits",
  ],
  PatrikaPage: [
    "patrikaSections",
    "patrikaThemes",
    "submissionFormats",
    "patrikaBenefits",
  ],
  CulturalPage: [
    "culturalHighlights",
    "participationGroups",
    "culturalObjectives",
    "culturalRecognitionBenefits",
  ],
  ConclavePage: ["conclaves"],
  ConferencePage: [],
};

const allDataNames = new Set(
  Object.values(pageImports).flat()
);

function stripTrailingConsts(source) {
  const marker = source.search(/\n\nconst \w+ =/);
  if (marker === -1) return source;
  const before = source.slice(0, marker);
  if (before.trimEnd().endsWith("}")) {
    return before.trimEnd() + "\n";
  }
  return source;
}

for (const [page, names] of Object.entries(pageImports)) {
  const filePath = path.join(pagesDir, `${page}.tsx`);
  let src = fs.readFileSync(filePath, "utf8");
  src = stripTrailingConsts(src);

  if (names.length) {
    const importLine = `import { ${names.join(", ")} } from "../academic-content-data";\n`;
    if (!src.includes("academic-content-data")) {
      src = src.replace(
        /import \{ OpenBestPracticesSection \}[^\n]+\n\n/,
        (m) => m + importLine
      );
      if (!src.includes("academic-content-data")) {
        src = src.replace(
          /from "\.\.\/AcademicCouncilUI";\n/,
          (m) => m + importLine
        );
      }
    }
  }

  fs.writeFileSync(filePath, src);
  console.log("fixed", page);
}

// Remove orphan trailing blocks from ConferencePage only
const conf = path.join(pagesDir, "ConferencePage.tsx");
let c = fs.readFileSync(conf, "utf8");
c = stripTrailingConsts(c);
fs.writeFileSync(conf, c);

console.log("done");
