/**
 * Standalone PDF extractor (uses isolated pdfjs-dist@4.8.69 + canvas@2.11.2).
 * Run from repo root: node scripts/pdf-extract-tmp/extract.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createCanvas } from "canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const PDF_PATH = path.join(ROOT, "public", "abhiyanphotoframe.pdf");
const OUT_PAGES = path.join(ROOT, "public", "abhiyan-photo-frame", "pages");
const OUT_ASSETS = path.join(ROOT, "public", "abhiyan-photo-frame", "assets");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "abhiyan-photo-frame-manifest.json");

const PAGE_SCALE = 1.25;
const JPEG_QUALITY = 0.82;

class NodeCanvasFactory {
  create(width, height) {
    const canvas = createCanvas(width, height);
    return { canvas, context: canvas.getContext("2d") };
  }
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }
  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function renderPages(doc) {
  const factory = new NodeCanvasFactory();
  const pages = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: PAGE_SCALE });
    const canvasAndContext = factory.create(
      Math.ceil(viewport.width),
      Math.ceil(viewport.height)
    );
    const { canvas, context } = canvasAndContext;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: context,
      viewport,
      canvasFactory: factory,
    }).promise;

    const fileName = `page-${String(i).padStart(2, "0")}.jpg`;
    const outPath = path.join(OUT_PAGES, fileName);
    const buffer = canvas.toBuffer("image/jpeg", { quality: JPEG_QUALITY });
    fs.writeFileSync(outPath, buffer);
    factory.destroy(canvasAndContext);

    pages.push({
      page: i,
      file: `/abhiyan-photo-frame/pages/${fileName}`,
      width: canvas.width,
      height: canvas.height,
      bytes: buffer.length,
    });
    console.log(`Rendered page ${i}/${doc.numPages} (${(buffer.length / 1024).toFixed(0)} KB)`);
  }
  return pages;
}

async function extractEmbeddedImages(doc) {
  const assets = [];
  let globalIndex = 0;

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const ops = await page.getOperatorList();
    const objs = page.objs;

    for (let j = 0; j < ops.fnArray.length; j++) {
      if (ops.fnArray[j] !== pdfjs.OPS.paintImageXObject) continue;
      const imgName = ops.argsArray[j][0];
      if (!imgName || assets.some((a) => a.key === `${i}-${imgName}`)) continue;

      try {
        const img = await objs.get(imgName);
        if (!img?.data || !img.width || !img.height) continue;

        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(img.width, img.height);
        imageData.data.set(img.data);
        ctx.putImageData(imageData, 0, 0);

        globalIndex += 1;
        const fileName = `p${String(i).padStart(2, "0")}-img-${String(globalIndex).padStart(3, "0")}.png`;
        const outPath = path.join(OUT_ASSETS, fileName);
        const buffer = canvas.toBuffer("image/png");
        if (buffer.length < 2048) continue;

        fs.writeFileSync(outPath, buffer);
        assets.push({
          key: `${i}-${imgName}`,
          page: i,
          file: `/abhiyan-photo-frame/assets/${fileName}`,
          width: img.width,
          height: img.height,
          bytes: buffer.length,
        });
      } catch {
        // skip
      }
    }
  }

  console.log(`Extracted ${assets.length} embedded images`);
  return assets;
}

async function main() {
  ensureDir(OUT_PAGES);
  ensureDir(OUT_ASSETS);

  const data = new Uint8Array(fs.readFileSync(PDF_PATH));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  console.log(`PDF pages: ${doc.numPages}`);

  const assets = await extractEmbeddedImages(doc);
  let pages = [];
  try {
    pages = await renderPages(doc);
  } catch (err) {
    console.warn("Page render failed, using embedded assets only:", err.message);
  }

  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourcePdf: "/abhiyanphotoframe.pdf",
        pageCount: doc.numPages,
        pages,
        assets,
      },
      null,
      2
    )
  );
  console.log("Done:", MANIFEST_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
