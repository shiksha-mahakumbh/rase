import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/receipt");
fs.mkdirSync(outDir, { recursive: true });

const campaignHtml = `<!DOCTYPE html><html lang="hi"><head><meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@700&display=swap" rel="stylesheet"/>
<style>body{margin:0;padding:8px 12px;background:transparent}
.c{font-family:"Noto Sans Devanagari",sans-serif;font-size:18px;font-weight:700;color:#B45309;white-space:nowrap}
</style></head><body><div class="c">शिक्षा महाकुंभ अभियान</div></body></html>`;

const thanksHtml = `<!DOCTYPE html><html lang="hi"><head><meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet"/>
<style>
body{margin:0;padding:12px 16px;background:#FFFBF5;font-family:"Noto Sans Devanagari",sans-serif;color:#0B1F3B}
h2{margin:0 0 8px;font-size:16px;font-weight:700;text-align:center}
p{margin:0 0 6px;font-size:12.5px;line-height:1.65;text-align:center;color:#1E293B}
</style></head><body>
<h2>हार्दिक धन्यवाद</h2>
<p>आपके उदार योगदान से शिक्षा महाकुंभ अभियान के अंतर्गत समग्र शिक्षा के पवित्र कार्यों को नई ऊर्जा और संसाधन मिलेंगे।</p>
<p>आपका सहयोग युवाओं एवं शिक्षा जगत के लिए एक अमूल्य उपहार है — हम आपके प्रति सदैव कृतज्ञ रहेंगे।</p>
</body></html>`;

const { chromium } = await import("playwright");
const browser = await chromium.launch({ headless: true });

async function capture(html, selector, outFile, width) {
  const page = await browser.newPage({ viewport: { width, height: 200 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  const el = await page.$(selector);
  if (!el) throw new Error(`Missing selector ${selector}`);
  await el.screenshot({ path: outFile, omitBackground: true });
  await page.close();
}

await capture(
  campaignHtml,
  ".c",
  path.join(outDir, "hindi-campaign.png"),
  420
);
await capture(
  thanksHtml,
  "body",
  path.join(outDir, "hindi-thanks-block.png"),
  620
);

await browser.close();
console.log("Wrote Hindi receipt PNG assets to", outDir);
