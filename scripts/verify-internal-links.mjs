import fs from "fs";
import path from "path";

const appDir = "src/app";
const routes = new Set();

function walk(dir, segments = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith("_")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith("[")) {
        const pattern = [...segments, e.name].join("/");
        routes.add("/" + pattern.replace(/\[|\]/g, ""));
        walk(full, [...segments, e.name]);
      } else {
        walk(full, [...segments, e.name]);
      }
    } else if (e.name === "page.tsx") {
      const segs = segments.filter((s) => !s.startsWith("("));
      routes.add(segs.length === 0 ? "/" : "/" + segs.join("/"));
    }
  }
}
walk(appDir);

/** Dynamic media archive routes */
const mediaKeys = [
  "shiksha-mahakumbh/2024/digital",
  "shiksha-mahakumbh/2023/digital",
  "shiksha-kumbh/2024/digital",
  "shiksha-kumbh/2023/digital",
  "shiksha-mahakumbh/2024/print",
  "shiksha-mahakumbh/2023/print",
  "shiksha-kumbh/2024/print",
  "shiksha-kumbh/2023/print",
];
for (const k of mediaKeys) routes.add("/media/" + k);

const linkRe = /(?:href|path|link|destination)\s*[=:]\s*["'](\/[^"'#?]+)["']/g;
const found = new Map();
const skipFiles = new Set(["src/config/legacy-redirects.js"]);

function scanDir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name);
    if (e.isDirectory() && !["node_modules", ".next"].includes(e.name)) scanDir(full);
    else if (/\.(tsx?|jsx?|mjs)$/.test(e.name)) {
      const rel = full.replace(/\\/g, "/");
      if (skipFiles.has(rel)) continue;
      const content = fs.readFileSync(full, "utf8");
      let m;
      while ((m = linkRe.exec(content)) !== null) {
        const p = m[1].split("?")[0].split("#")[0].replace(/\/$/, "") || "/";
        if (!p.startsWith("http") && !/\.\w{2,4}$/.test(p) && !p.includes("[")) {
          if (!found.has(p)) found.set(p, []);
          found.get(p).push(rel);
        }
      }
    }
  }
}
scanDir("src");

function routeExists(link) {
  if (routes.has(link)) return true;
  if (link.startsWith("/media/") && mediaKeys.some((k) => link === "/media/" + k)) return true;
  return false;
}

const broken = [];
for (const [link, sources] of found) {
  if (!routeExists(link)) broken.push({ link, sources: [...new Set(sources)] });
}

broken.sort((a, b) => a.link.localeCompare(b.link));
const out = { totalLinks: found.size, brokenCount: broken.length, broken };
fs.writeFileSync("scripts/link-verify-result.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
process.exit(broken.length > 0 ? 1 : 0);
