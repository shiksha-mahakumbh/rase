const fs = require("fs");
const path = require("path");
const pdfImgConvert = require("pdf-img-convert");

const ROOT = path.join(__dirname, "..", "..");
const PDF_PATH = path.join(ROOT, "public", "abhiyanphotoframe.pdf");
const OUT_PAGES = path.join(ROOT, "public", "abhiyan-photo-frame", "pages");

fs.mkdirSync(OUT_PAGES, { recursive: true });

(async () => {
  const output = await pdfImgConvert.convert(PDF_PATH, { width: 1200 });
  for (let i = 0; i < output.length; i++) {
    const fileName = `page-${String(i + 1).padStart(2, "0")}.jpg`;
    fs.writeFileSync(path.join(OUT_PAGES, fileName), output[i]);
    console.log(`Wrote ${fileName} (${Math.round(output[i].length / 1024)} KB)`);
  }
  console.log("Done", output.length, "pages");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
