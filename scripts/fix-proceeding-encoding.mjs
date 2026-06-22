import fs from "fs";

const path = "src/content/proceedings/proceeding1-data.ts";
let text = fs.readFileSync(path, "utf8");

const replacements = [
  ["\u00e2\u0080\u0093", "\u2013"],
  ["\u00e2\u0080\u0094", "\u2014"],
  ["\u00e2\u0080\u0099", "\u2019"],
  ["\u00e2\u0080\u0098", "\u2018"],
  ["\u00e2\u0080\u009c", "\u201c"],
  ["\u00e2\u0080\u009d", "\u201d"],
  ["\u00e2\u0080\u00a6", "\u2026"],
];

for (const [from, to] of replacements) {
  text = text.split(from).join(to);
}

text = text.replace(/\u00e2\u20ac[\u201c\u201d]/g, "\u2013");
text = text.replace(/\u00e2\u20ac[\u2018\u2019]/g, "'");

fs.writeFileSync(path, text);
const remaining = (text.match(/\u00e2/g) || []).length;
console.log(`Fixed proceeding1-data.ts (${remaining} mojibake bytes remaining)`);
