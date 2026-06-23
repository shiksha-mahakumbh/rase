import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "src/components/media/archive");

const configs = [
  {
    file: "PrintMediaShikshaMahaKumbh2024.tsx",
    fn: "PrintMediaShikshaMahaKumbh2024",
    title: "Shiksha Mahakumbh 4.0 — Print Media",
    description: "Newspaper clippings from Shiksha Mahakumbh 4.0 at Kurukshetra University, December 2024.",
  },
  {
    file: "PrintMediaShikshaMahaKumbh2023.tsx",
    fn: "PrintMediaShikshaMahaKumbh2023",
    title: "Shiksha Mahakumbh 1.0 — Print Media",
    description: "Print media coverage from Shiksha Mahakumbh 1.0 at NIT Jalandhar, June 2023.",
  },
  {
    file: "PrintMediaShikshaKumbh2024.tsx",
    fn: "PrintMediaShikshaKumbh2024",
    title: "Shiksha Kumbh 3.0 — Print Media",
    description: "Print media from Shiksha Kumbh 3.0 at NIT Srinagar, June 2024.",
  },
  {
    file: "PrintMediaShikshaKumbh2023.tsx",
    fn: "PrintMediaShikshaKumbh2023",
    title: "Shiksha Kumbh 2.0 — Print Media",
    description: "Print media from Shiksha Kumbh 2.0 at NIT Kurukshetra, December 2023.",
  },
];

for (const cfg of configs) {
  const src = fs.readFileSync(path.join(dir, cfg.file), "utf8");
  const imagesMatch = src.match(/const images(?::[^=]+)?\s*=\s*\[[\s\S]*?\n\];/);
  if (!imagesMatch) {
    console.error("no images:", cfg.file);
    process.exit(1);
  }
  const body = `"use client";

import PrintMediaArchiveGrid from "./PrintMediaArchiveGrid";

${imagesMatch[0].replace(/: ImageData\[\]/g, "")}

export default function ${cfg.fn}() {
  return (
    <PrintMediaArchiveGrid
      title=${JSON.stringify(cfg.title)}
      description=${JSON.stringify(cfg.description)}
      images={images.map((img) => ({ src: img.src, alt: img.src.split("/").pop() }))}
      initialCount={16}
    />
  );
}
`;
  fs.writeFileSync(path.join(dir, cfg.file), body);
  console.log("refactored", cfg.file);
}
