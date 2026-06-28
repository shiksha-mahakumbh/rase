import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDonationReceiptHtml, sampleDonationReceiptData } from "../src/lib/receipt/donation-receipt";
import { SITE_URL } from "../src/config/site";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../public/donation-receipt-preview.html");

const html = buildDonationReceiptHtml(sampleDonationReceiptData(), SITE_URL, {
  autoPrint: false,
  embedLogos: true,
});

fs.writeFileSync(outPath, html, "utf8");
console.log("Wrote", outPath);
