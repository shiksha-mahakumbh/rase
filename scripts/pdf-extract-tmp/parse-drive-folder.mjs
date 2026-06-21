import fs from "fs";

const html = fs.readFileSync("drive-folder.html", "utf8");
const fileLinks = [...html.matchAll(/\/file\/d\/([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
const uniqueLinks = [...new Set(fileLinks)];
console.log("fileLinks", uniqueLinks);

const editionBlocks = [...html.matchAll(/Brochure Shiksha Mahakumbh ([0-9.]+)[^]*?data-id=\"([^\"]+)\"/g)];
for (const m of editionBlocks) {
  console.log("edition", m[1], "id", m[2]);
}

// Alternative: data-target="doc" data-id
const docIds = [...html.matchAll(/data-target=\"doc\"[^>]*data-id=\"([^\"]+)\"/g)].map((m) => m[1]);
console.log("docIds", [...new Set(docIds)]);
