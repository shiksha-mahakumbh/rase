import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const sources = {
  campaign: path.join(root, "public/receipt/hindi-campaign.png"),
  thanks: path.join(root, "public/receipt/hindi-thanks-block.png"),
};

const outFile = path.join(root, "src/lib/receipt/donation-receipt-hindi-assets.ts");

function toBase64(file) {
  return fs.readFileSync(file).toString("base64");
}

const campaign = toBase64(sources.campaign);
const thanks = toBase64(sources.thanks);

const contents = `/** Auto-generated — run: node scripts/embed-donation-receipt-hindi-assets.mjs */
export const HINDI_CAMPAIGN_PNG_BASE64 = ${JSON.stringify(campaign)};
export const HINDI_THANKS_PNG_BASE64 = ${JSON.stringify(thanks)};
`;

fs.writeFileSync(outFile, contents, "utf8");
console.log("Wrote", outFile);
