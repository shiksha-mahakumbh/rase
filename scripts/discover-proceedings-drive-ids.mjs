#!/usr/bin/env node
/** Scan public Drive folders for Proceeding*.pdf file IDs. */
const folders = [
  ["vol1-smk2", "1tKbSQtOUq7ji2s0-5hueAqTQlal9ScpJ"],
  ["vol2-smk1", "1Xu4WfCeWLQp037EJn5Q0ULmREtnLplwq"],
  ["vol3-smk3", "1SgwPcXC3xRR7V3hAtKJSzeggBB9Xpwnk"],
  ["brochures", "1ZmE0eSM4yGF2Ep58lB7TInop4df4MBMH"],
  ["publications?", "1BXb4AWj4xV9KjDMyN6uviFOlM8f99GOU"],
];

function extractProceedingIds(html) {
  const out = [];
  for (const m of html.matchAll(/href="https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/[^"]*"[^>]*>([^<]*Proceeding[^<]*)/gi)) {
    out.push({ id: m[1], name: m[2].trim() });
  }
  for (const m of html.matchAll(/Proceeding(\d)\.pdf/gi)) {
    out.push({ name: m[0] });
  }
  return out;
}

for (const [label, id] of folders) {
  const url = `https://drive.google.com/embeddedfolderview?id=${id}#list`;
  const html = await fetch(url).then((r) => r.text());
  const lower = html.toLowerCase();
  console.log(`\n=== ${label} (${id}) ===`);
  console.log("proceeding1:", lower.includes("proceeding1"));
  console.log("proceeding2:", lower.includes("proceeding2"));
  console.log("proceeding3:", lower.includes("proceeding3"));
  const hits = extractProceedingIds(html);
  if (hits.length) console.log("hits:", hits);
}
