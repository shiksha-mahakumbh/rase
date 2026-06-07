import fs from "fs";
import path from "path";

const imgRe = /<img[\s\S]*?icons8\.com[\s\S]*?\/>/g;

for (let n = 1; n <= 9; n++) {
  const file = path.join("src/app", `Press${n}`, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes("icons8.com")) continue;
  if (!s.includes("WhatsAppIcon")) {
    s = s.replace(
      /import NavBar/,
      'import WhatsAppIcon from "@/components/common/WhatsAppIcon";\nimport NavBar'
    );
  }
  s = s.replace(imgRe, "<WhatsAppIcon />");
  fs.writeFileSync(file, s);
  console.log("updated", file);
}
