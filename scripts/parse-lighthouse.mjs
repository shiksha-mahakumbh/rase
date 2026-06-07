import fs from "fs";
import path from "path";

const dir = process.cwd();
const files = fs.readdirSync(dir).filter((f) => f.startsWith("lighthouse-") && f.endsWith(".json"));

for (const file of files) {
  const r = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const name = file.replace("lighthouse-", "").replace(".json", "");
  const scores = Object.fromEntries(
    Object.entries(r.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)])
  );
  const a = r.audits;
  console.log(
    name,
    `perf=${scores.performance}`,
    `a11y=${scores.accessibility}`,
    `bp=${scores["best-practices"]}`,
    `seo=${scores.seo}`,
    `LCP=${a["largest-contentful-paint"]?.displayValue ?? "n/a"}`,
    `CLS=${a["cumulative-layout-shift"]?.displayValue ?? "n/a"}`
  );
}
