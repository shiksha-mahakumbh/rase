const res = await fetch("https://www.shikshamahakumbh.com/");
const t = await res.text();
const canonical = t.match(/rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
const og = t.match(/property="og:url"[^>]+content="([^"]+)"/i)?.[1];
const ldBlocks = [...t.matchAll(/application\/ld\+json[^>]*>([\s\S]*?)<\/script/gi)].map((m) => m[1]);
const jsonLdUrls = [];
for (const block of ldBlocks) {
  try {
    const parsed = JSON.parse(block);
    const s = JSON.stringify(parsed);
    for (const m of s.matchAll(/https:\/\/[^"\\]+/g)) {
      if (m[0].includes("shiksha") || m[0].includes("rase")) jsonLdUrls.push(m[0]);
    }
  } catch {
    /* ignore */
  }
}
console.log(
  JSON.stringify(
    {
      canonical,
      og,
      jsonLdUrls: [...new Set(jsonLdUrls)],
      hasRaseInHtml: /rase\.co\.in/.test(t),
      hasComInHtml: /shikshamahakumbh\.com/.test(t),
    },
    null,
    2
  )
);
