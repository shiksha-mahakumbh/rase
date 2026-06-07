/**
 * Summarizes Next.js build output — route First Load JS sizes.
 * Run after: npm run build
 */
import fs from "node:fs";
import path from "node:path";

const buildDir = path.resolve(process.cwd(), ".next");
const manifestPath = path.join(buildDir, "app-build-manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.error("Run `npm run build` first — app-build-manifest.json not found.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const pages = manifest.pages ?? {};

const rows = Object.entries(pages)
  .map(([route, files]) => ({
    route: route || "/",
    chunks: files.length,
  }))
  .sort((a, b) => b.chunks - a.chunks);

console.log(JSON.stringify({
  totalRoutes: rows.length,
  topChunkRoutes: rows.slice(0, 15),
  note: "See build stdout for First Load JS per route (kB).",
}, null, 2));
