import fs from "fs";
import path from "path";

const pressDir = "src/app/press";
for (const e of fs.readdirSync(pressDir, { withFileTypes: true })) {
  if (!e.isDirectory()) continue;
  const f = path.join(pressDir, e.name, "page.tsx");
  if (!fs.existsSync(f)) continue;
  let c = fs.readFileSync(f, "utf8");
  c = c.replace(/\.\.\/component\//g, "@/app/component/");
  fs.writeFileSync(f, c);
}
console.log("Fixed press import paths");
