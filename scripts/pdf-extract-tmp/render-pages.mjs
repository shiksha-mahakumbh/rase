import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfImgConvert from "pdf-img-convert";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const PDF_PATH = path.join(ROOT, "public", "abhiyanphotoframe.pdf");
const OUT_PAGES = path.join(ROOT, "public", "abhiyan-photo-frame", "pages");

fs.mkdirSync(OUT_PAGES, { recursive: true });

const output = await pdfImgConvert.convert(PDF_PATH, {
  width: 1200,
  page_numbers: Array.from({ length: 37 }, (_, i) => i + 1),
});

for (let i = 0; i < output.length; i++) {
  const fileName = `page-${String(i + 1).padStart(2, "0")}.jpg`;
  fs.writeFileSync(path.join(OUT_PAGES, fileName), output[i]);
  console.log(`Wrote ${fileName} (${Math.round(output[i].length / 1024)} KB)`);
}

console.log("Done", output.length, "pages");
