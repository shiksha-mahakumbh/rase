import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "src/components/media/archive");

const files = [
  { file: "ShikshaMahaKumbh2023DigitalMedia.tsx", title: "Shiksha Mahakumbh 1.0 — Digital Media" },
  { file: "ShikshaKumbh2023DigitalMedia.tsx", title: "Shiksha Kumbh 2.0 — Digital Media" },
  { file: "ShikshaMahaKumbh2024DigitalMedia.tsx", title: "Shiksha Mahakumbh 4.0 — Digital Media" },
  { file: "ShikshaKumbh2024DigitalMedia.tsx", dual: true },
];

for (const cfg of files) {
  const filePath = path.join(dir, cfg.file);
  const src = fs.readFileSync(filePath, "utf8");
  const fnName = cfg.file.replace(".tsx", "");

  const mediaMatch = src.match(/const media[\s\S]*?\n\s*\];/);
  if (!mediaMatch) {
    console.error("no media array:", cfg.file);
    process.exit(1);
  }

  let body = `"use client";\n\nimport DigitalMediaArchiveGrid from "./DigitalMediaArchiveGrid";\n\n${mediaMatch[0]}\n`;

  if (cfg.dual) {
    const media2Match = src.match(/const media2[\s\S]*?\n\s*\];/);
    if (!media2Match) {
      console.error("no media2 array:", cfg.file);
      process.exit(1);
    }
    body += `\n${media2Match[0]}\n`;
    body += `
export default function ${fnName}() {
  return (
    <DigitalMediaArchiveGrid
      sections={[
        { title: "RASE 2024 — Digital Media Day 1", items: media },
        { title: "RASE 2024 — Digital Media Day 2", items: media2 },
      ]}
    />
  );
}
`;
  } else {
    body += `
export default function ${fnName}() {
  return (
    <DigitalMediaArchiveGrid
      sections={[{ title: ${JSON.stringify(cfg.title)}, items: media }]}
    />
  );
}
`;
  }

  fs.writeFileSync(filePath, body);
  console.log("refactored", cfg.file);
}
