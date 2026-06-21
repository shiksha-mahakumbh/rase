import fs from "fs";

const html = fs.readFileSync("drive-folder.html", "utf8");
const ids = [...html.matchAll(/\b(1[a-zA-Z0-9_-]{20,50})\b/g)].map((m) => m[1]);
const counts = {};
for (const id of ids) counts[id] = (counts[id] || 0) + 1;
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log("top ids", sorted.slice(0, 30));

// Look for Brochure near ids in __initData
const idx = html.indexOf("Brochure Shiksha Mahakumbh 1.0");
console.log("context 1.0", html.slice(Math.max(0, idx - 200), idx + 400));
