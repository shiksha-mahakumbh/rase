#!/usr/bin/env node
const base = (process.argv[2] || "https://www.rase.co.in").replace(/\/$/, "");
const pages = ["/", "/press", "/media-center", "/registration"];

for (const path of pages) {
  const res = await fetch(`${base}${path}`);
  const html = await res.text();
  const canon = html.match(/rel="canonical" href="([^"]+)"/);
  const og = html.match(/property="og:url" content="([^"]+)"/);
  console.log(
    JSON.stringify({
      path,
      status: res.status,
      canonical: canon?.[1] ?? null,
      ogUrl: og?.[1] ?? null,
      usesSiteUrl: (canon?.[1] ?? "").startsWith("https://www.rase.co.in"),
    })
  );
}
