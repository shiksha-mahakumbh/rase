import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateDonationReceiptPdfBuffer } from "../src/lib/receipt/donation-receipt-pdf";
import { sampleDonationReceiptData } from "../src/lib/receipt/donation-receipt";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../public/donation-receipt-preview.pdf");

async function main() {
  const pdf = await generateDonationReceiptPdfBuffer(sampleDonationReceiptData());
  fs.writeFileSync(outPath, pdf);
  console.log("Wrote", outPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
