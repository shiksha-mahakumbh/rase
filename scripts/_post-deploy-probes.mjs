#!/usr/bin/env node
/** Post-deploy security and SEO probes for cutover verification. */
const BASES = [
  "https://www.shikshamahakumbh.com",
  "https://www.rase.co.in",
];

const probes = [];

async function probe(name, url, opts = {}) {
  try {
    const res = await fetch(url, { redirect: "follow", ...opts });
    const text = await res.text();
    probes.push({
      name,
      url,
      status: res.status,
      ok: res.ok,
      snippet: text.slice(0, 500),
    });
    return { res, text };
  } catch (e) {
    probes.push({ name, url, error: e.message });
    return { res: null, text: "" };
  }
}

for (const base of BASES) {
  const reg = await probe(
    `registration_no_auth@${new URL(base).host}`,
    `${base}/api/registration/SMK2026-000001`
  );
  if (reg.text) {
    const hasEmail = /"email"\s*:/.test(reg.text);
    const hasPhone = /"contactNumber"\s*:/.test(reg.text);
    probes.push({
      name: `pii_check@${new URL(base).host}`,
      hasEmail,
      hasPhone,
      status: reg.res?.status,
    });
  }

  await probe(`sitemap@${new URL(base).host}`, `${base}/sitemap.xml`);
  await probe(`robots@${new URL(base).host}`, `${base}/robots.txt`);
  await probe(`home_canonical@${new URL(base).host}`, `${base}/`);

  await probe(`webhook_unsigned@${new URL(base).host}`, `${base}/api/payments/razorpay-webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
}

const home = probes.find((p) => p.name.startsWith("home_canonical@www.shikshamahakumbh"));
if (home?.snippet) {
  const canonical = home.snippet.match(/rel="canonical"\s+href="([^"]+)"/i)?.[1];
  const og = home.snippet.match(/property="og:url"\s+content="([^"]+)"/i)?.[1];
  const jsonLd = home.snippet.match(/"url"\s*:\s*"([^"]+shiksha[^"]+)"/i)?.[1];
  probes.push({ name: "seo_extract_shikshamahakumbh", canonical, og, jsonLd });
}

const sitemap = probes.find((p) => p.name === "sitemap@www.shikshamahakumbh.com");
if (sitemap?.snippet) {
  const usesCom = /shikshamahakumbh\.com/.test(sitemap.snippet);
  const usesRase = /rase\.co\.in/.test(sitemap.snippet);
  probes.push({ name: "sitemap_domain_check", usesCom, usesRase });
}

console.log(JSON.stringify({ checkedAt: new Date().toISOString(), probes }, null, 2));
