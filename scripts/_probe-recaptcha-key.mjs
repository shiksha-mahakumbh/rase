#!/usr/bin/env node
/** Extract NEXT_PUBLIC_RECAPTCHA_SITE_KEY from production JS bundles */
const BASE = "https://www.shikshamahakumbh.com";
const html = await fetch(`${BASE}/registration`).then((r) => r.text());
const chunks = [...html.matchAll(/\/_next\/static\/chunks\/[^"']+\.js/g)].map((m) => m[0]);
const localKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "(not in env)";

console.log("Local .env site key prefix:", String(localKey).slice(0, 12) + "...");

let found = null;
for (const chunk of chunks.slice(0, 30)) {
  try {
    const js = await fetch(BASE + chunk).then((r) => r.text());
    const keys = js.match(/6L[a-zA-Z0-9_-]{38,40}/g);
    if (keys?.length) {
      found = [...new Set(keys)];
      console.log("Found in", chunk, found);
    }
  } catch {
    /* skip */
  }
}

if (!found) {
  // try main app layout scripts
  const allScripts = [...html.matchAll(/src="(\/_next\/static\/[^"]+\.js)"/g)].map((m) => m[1]);
  for (const chunk of allScripts.slice(0, 40)) {
    try {
      const js = await fetch(BASE + chunk).then((r) => r.text());
      if (js.includes("recaptcha") || js.includes("RECAPTCHA")) {
        const keys = js.match(/6L[a-zA-Z0-9_-]{38,40}/g);
        if (keys) console.log("recaptcha chunk", chunk, [...new Set(keys)]);
      }
    } catch {
      /* skip */
    }
  }
}
