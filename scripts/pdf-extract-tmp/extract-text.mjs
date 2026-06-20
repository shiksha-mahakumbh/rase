import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const PDF = path.join(ROOT, "public", "abhiyanphotoframe.pdf");
const OUT = path.join(ROOT, "tmp-pdf-full-extract.txt");

const data = new Uint8Array(fs.readFileSync(PDF));
const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

let full = "";
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const text = content.items.map((it) => it.str).join(" ");
  full += `\n\n-- PAGE ${i} of ${doc.numPages} --\n\n${text}\n`;
}

fs.writeFileSync(OUT, full, "utf8");
console.log("Wrote", OUT, "chars:", full.length);
