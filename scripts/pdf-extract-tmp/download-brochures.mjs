/**
 * Download brochures from public Google Drive folder and extract text.
 * Run: node scripts/pdf-extract-tmp/download-brochures.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "brochures");
const TEXT_DIR = path.join(__dirname, "brochure-text");

/** Parsed from public folder HTML (data-id per edition). */
const BROCHURES = [
  { edition: "1.0", id: "1lFkiHPlIKFcD1FYILU984a0_4uWYZLWb", size: "413 KB" },
  { edition: "2.0", id: "1gwRa6BlsSmIUfK0KnY9NSRp3L7tTRIz7", size: "4 MB" },
  { edition: "3.0", id: "1Kz8A4jpUz-4cw_k750vmpxP2hBCC-yoz", size: "956 KB" },
  { edition: "4.0", id: "19273esr2lk-XzQk-sC4UKaJeIZxvLlXC", size: "3.1 MB" },
  { edition: "5.0", id: "1Lgc0sAN79gu0qN1m9dgYr264er_DY0LO", size: "11.1 MB" },
  { edition: "6.0", id: "1rokyd0hY6w_ekdk3jFvIYwkd-lDh_VYN", size: "28.6 MB" },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function downloadFile(id, dest) {
  const urls = [
    `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download&confirm=t`,
    `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}&confirm=t`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000) continue;
      if (buf.slice(0, 15).toString("utf8").includes("<!DOCTYPE")) continue;
      fs.writeFileSync(dest, buf);
      return buf.length;
    } catch {
      /* try next */
    }
  }
  throw new Error(`Download failed for ${id}`);
}

async function extractText(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  let full = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((it) => it.str).join(" ");
    full += `\n\n-- PAGE ${i} of ${doc.numPages} --\n\n${text}\n`;
  }
  return { pages: doc.numPages, text: full };
}

ensureDir(OUT_DIR);
ensureDir(TEXT_DIR);

const summary = [];

for (const b of BROCHURES) {
  const pdfPath = path.join(OUT_DIR, `brochure-smk-${b.edition.replace(".", "-")}.pdf`);
  const txtPath = path.join(TEXT_DIR, `brochure-smk-${b.edition.replace(".", "-")}.txt`);
  process.stdout.write(`Downloading edition ${b.edition} (${b.size})... `);
  try {
    const bytes = await downloadFile(b.id, pdfPath);
    process.stdout.write(`${(bytes / 1024).toFixed(0)} KB... `);
    const { pages, text } = await extractText(pdfPath);
    fs.writeFileSync(txtPath, text, "utf8");
    summary.push({ edition: b.edition, pages, chars: text.length, ok: true });
    console.log(`OK (${pages} pages, ${text.length} chars)`);
  } catch (err) {
    summary.push({ edition: b.edition, ok: false, error: String(err.message || err) });
    console.log(`FAIL: ${err.message || err}`);
  }
}

fs.writeFileSync(path.join(TEXT_DIR, "_summary.json"), JSON.stringify(summary, null, 2));
console.log("\nDone.", summary);
