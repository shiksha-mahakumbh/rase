/**
 * Compress edition gallery sources for mobile performance.
 * Run: node scripts/compress-edition-gallery-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");
const MAX_WIDTH = 1200;
const WEBP_QUALITY = 78;
const MAX_OUTPUT_KB = 180;

const JOBS = [
  { input: "2023K/k2.JPG", output: "2023K/k2.webp" },
  { input: "2023K/b1.JPG", output: "2023K/b1.webp" },
  { input: "2023M/k3.jpeg", output: "2023M/k3-opt.webp" },
  { input: "2023M/k6.jpeg", output: "2023M/k6-opt.webp" },
  { input: "sm24printmedia/1.jpg", output: "sm24printmedia/1-lcp.webp" },
  { input: "sm24printmedia/10.jpg", output: "sm24printmedia/10-opt.webp" },
  { input: "sm24printmedia/20.jpg", output: "sm24printmedia/20-opt.webp" },
  { input: "sm25printmedia/1.jpg", output: "sm25printmedia/1-lcp.webp" },
  { input: "sm25printmedia/12.jpg", output: "sm25printmedia/12-opt.webp" },
  { input: "sk24printmedia/10.jpg", output: "sk24printmedia/10-opt.webp" },
  { input: "sm25printmedia/24.jpg", output: "sm25printmedia/24-opt.webp" },
  { input: "sm25printmedia/36.jpg", output: "sm25printmedia/36-opt.webp" },
  { input: "sm25printmedia/48.jpg", output: "sm25printmedia/48-opt.webp" },
  { input: "sm24printmedia/30.jpg", output: "sm24printmedia/30-opt.webp" },
  { input: "sm24printmedia/40.jpg", output: "sm24printmedia/40-opt.webp" },
  { input: "sk24printmedia/18.jpg", output: "sk24printmedia/18-opt.webp" },
];

async function compressOne({ input, output }) {
  const inPath = path.join(PUBLIC, input);
  const outPath = path.join(PUBLIC, output);

  if (!fs.existsSync(inPath)) {
    console.log(`⊘ skip missing ${input}`);
    return;
  }

  let quality = WEBP_QUALITY;
  let buffer;

  for (let attempt = 0; attempt < 4; attempt++) {
    buffer = await sharp(inPath)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toBuffer();

    if (buffer.length <= MAX_OUTPUT_KB * 1024 || quality <= 52) break;
    quality -= 8;
  }

  fs.writeFileSync(outPath, buffer);
  const inKb = Math.round(fs.statSync(inPath).size / 1024);
  const outKb = Math.round(buffer.length / 1024);
  console.log(`✓ ${input} (${inKb} KB) → ${output} (${outKb} KB, q=${quality})`);
}

async function main() {
  console.log("Compressing edition gallery assets…\n");
  for (const job of JOBS) {
    await compressOne(job);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
