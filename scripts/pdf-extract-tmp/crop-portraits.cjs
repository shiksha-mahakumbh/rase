/**
 * Crop speaker/advisor portraits from rendered PDF page JPGs (1200×848).
 * Embedded PNG extraction is unreliable; page renders are the source of truth.
 */
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

const ROOT = path.join(__dirname, "..", "..");
const PAGES = path.join(ROOT, "public", "abhiyan-photo-frame", "pages");
const OUT = path.join(ROOT, "public", "abhiyan-photo-frame", "portraits");

/** @type {{ slug: string; page: number; x: number; y: number; w: number; h: number }[]} */
const CROPS = [
  { slug: "patron-raunija", page: 4, x: 395, y: 195, w: 410, h: 430 },
  { slug: "advisor-raghunandan", page: 5, x: 500, y: 248, w: 172, h: 180 },
  { slug: "speaker-raghunandan-1", page: 11, x: 323, y: 148, w: 172, h: 172 },
  { slug: "speaker-deshraj-1", page: 11, x: 773, y: 340, w: 172, h: 172 },
  { slug: "speaker-pawan-singh", page: 12, x: 436, y: 152, w: 158, h: 158 },
  { slug: "speaker-deshraj-2", page: 13, x: 98, y: 148, w: 172, h: 172 },
  { slug: "speaker-raman-reddy", page: 13, x: 44, y: 338, w: 168, h: 168 },
  { slug: "speaker-nagarajan", page: 14, x: 620, y: 148, w: 172, h: 172 },
  { slug: "speaker-deepti", page: 14, x: 998, y: 148, w: 172, h: 172 },
  { slug: "speaker-somnath", page: 15, x: 968, y: 430, w: 165, h: 155 },
];

async function cropOne({ slug, page, x, y, w, h }) {
  const src = path.join(PAGES, `page-${String(page).padStart(2, "0")}.jpg`);
  const img = await loadImage(src);
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
  const outPath = path.join(OUT, `${slug}.jpg`);
  fs.writeFileSync(outPath, canvas.toBuffer("image/jpeg", { quality: 0.92 }));
  return `/abhiyan-photo-frame/portraits/${slug}.jpg`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const crop of CROPS) {
    const file = await cropOne(crop);
    console.log("Cropped", crop.slug, "->", file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
