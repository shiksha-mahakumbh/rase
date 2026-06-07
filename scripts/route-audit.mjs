import fs from "fs";
import path from "path";

const appDir = "src/app";
const routes = [];

function walk(dir, segments = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith("_")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, [...segments, e.name]);
    } else if (e.name === "page.tsx") {
      const segs = segments.filter((s) => !s.startsWith("("));
      const route =
        segs.length === 0
          ? "/"
          : "/" + segs.join("/").replace(/\[locale\]/g, "[locale]").replace(/\[id\]/g, "[id]");
      routes.push({ route, file: full.replace(/\\/g, "/") });
    }
  }
}
walk(appDir);

const linkPattern = /(?:href|path|destination|source)\s*[=:]\s*["'](\/[^"'#?]+)["']/g;
const linked = new Set(["/"]);

function scanDir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name);
    if (e.isDirectory() && !["node_modules", ".next"].includes(e.name)) scanDir(full);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) {
      const content = fs.readFileSync(full, "utf8");
      let m;
      while ((m = linkPattern.exec(content)) !== null) {
        let p = m[1].split("?")[0].split("#")[0];
        if (!p.startsWith("http") && !/\.\w{2,4}$/.test(p)) {
          linked.add(p.replace(/\/$/, "") || "/");
        }
      }
    }
  }
}
scanDir("src");

const sitemap = fs.readFileSync("src/app/sitemap.ts", "utf8");
const sitemapPaths = new Set();
for (const m of sitemap.matchAll(/"([^"]+)"/g)) {
  const val = m[1];
  if (val.length < 80 && !val.includes(" ")) {
    sitemapPaths.add(val === "" ? "/" : "/" + val);
  }
}

const protectedPrefixes = [
  "/admin",
  "/AllData",
  "/participantregistrationdatadekh",
  "/volunteerdatadekh",
  "/volunteerregistrationdatadekh",
  "/ngoregistrationdatadekh",
  "/abstractdatadekh",
  "/fulllengthdatadekh",
  "/fulllengthpaperdatadekh",
  "/organiserdatadekh",
  "/schooldata",
  "/Talentdata",
  "/Conclavedata",
  "/Bestpracticedata",
  "/accomodationdata",
  "/DelegateForm",
  "/heiprojectregistrationdata",
  "/noticeboarddata",
  "/addkeynotespeaker",
  "/addvcdirector",
  "/addwishesreceived",
  "/abstractdatadekhsm24",
  "/fulllengthdatadekhsm24",
];

function hasMetadata(file) {
  let dir = path.dirname(file);
  while (dir.startsWith("src/app")) {
    if (fs.existsSync(path.join(dir, "layout.tsx"))) {
      const layout = fs.readFileSync(path.join(dir, "layout.tsx"), "utf8");
      if (/metadata|createPageMetadata|PUBLIC_PAGE_META|generateMetadata/.test(layout))
        return true;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return false;
}

function isLinked(norm) {
  if (linked.has(norm)) return true;
  for (const l of linked) {
    if (norm.startsWith(l + "/") || l === norm) return true;
  }
  return false;
}

function inSitemap(norm) {
  const key = norm === "/" ? "/" : norm;
  const noSlash = key === "/" ? "" : key.slice(1);
  return sitemapPaths.has(key) || sitemapPaths.has("/" + noSlash) || sitemapPaths.has(noSlash);
}

const apiRoutes = [];
function walkApi(dir, segments = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkApi(full, [...segments, e.name]);
    else if (e.name === "route.ts") {
      apiRoutes.push("/api/" + segments.join("/"));
    }
  }
}
if (fs.existsSync("src/app/api")) walkApi("src/app/api");

const results = routes.map((r) => {
  const norm = r.route === "/" ? "/" : r.route.replace(/\/$/, "");
  const isProtected = protectedPrefixes.some((p) => norm === p || norm.startsWith(p + "/"));
  const isDynamic = norm.includes("[");
  return {
    route: norm,
    file: r.file,
    linked: isLinked(norm),
    sitemap: inSitemap(norm),
    metadata: hasMetadata(r.file),
    protected: isProtected,
    dynamic: isDynamic,
  };
});

const unlinked = results.filter((r) => !r.linked && !r.protected && !r.dynamic);
const notSitemap = results.filter((r) => !r.sitemap && !r.protected && !r.dynamic);

const out = { total: results.length, api: apiRoutes, unlinked: unlinked.map((r) => r.route), notSitemap: notSitemap.map((r) => r.route), routes: results };
fs.writeFileSync("scripts/route-audit-data.json", JSON.stringify(out, null, 2));
console.log("Wrote scripts/route-audit-data.json", out.total, "routes");
