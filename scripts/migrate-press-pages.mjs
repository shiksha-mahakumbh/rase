import fs from "fs";
import path from "path";

const pressDir = "src/app/press";
const skip = new Set(["baton-ceremony-smk-4", "page.tsx"]);

const entries = fs.readdirSync(pressDir, { withFileTypes: true });
const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

for (const dir of dirs) {
  if (skip.has(dir)) continue;
  const file = path.join(pressDir, dir, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("CompanyInfo")) continue;

  const canonicalMatch = src.match(
    /RelatedContentSectionClient path="([^"]+)"/
  );
  const canonicalPath = canonicalMatch?.[1] ?? `/press/${dir}`;

  const pressCompMatch = src.match(/import Press(\d+) from/);
  const pressComp = pressCompMatch
    ? `Press${pressCompMatch[1]}`
    : src.match(/import Press(\d+) from "@\/app\/component\/Press(\d+)"/)
      ? `Press${src.match(/import Press(\d+)/)[1]}`
      : "Press5";

  const shareUrlMatch = src.match(/getPressShareUrl\((\d+)\)/);
  const shareNum = shareUrlMatch?.[1] ?? "1";

  const shareTextMatch = src.match(
    /const shareText = encodeURIComponent\(\s*([\s\S]*?)\s*\);/
  );
  const shareTextPlain = shareTextMatch
    ? `const shareTextPlain = ${shareTextMatch[1].trim()};`
    : 'const shareTextPlain = "Shiksha Mahakumbh Press Release";';

  const shareImageMatch = src.match(/const shareImage\s*=\s*([^;]+);/);
  const shareImageLine = shareImageMatch
    ? `const shareImage = ${shareImageMatch[1].trim()};`
    : 'const shareImage = "/2024M/press1.jpg";';

  const dataMatch = src.match(/(<Press\d+ data=\{data\} \/>)/);
  const pressUsage = dataMatch?.[1] ?? `<${pressComp} data={data} />`;

  src = src.replace(
    /"use client";\s*import React from "react";\s*import CompanyInfo[\s\S]*?import \{ getPressShareUrl \} from "@\/lib\/seo\/pressShare";\s*/,
    `"use client";\nimport React from "react";\nimport ${pressComp} from "@/app/component/${pressComp}";\nimport WhatsAppIcon from "@/components/common/WhatsAppIcon";\nimport PressArticleShell from "@/components/press/PressArticleShell";\nimport { getPressShareUrl } from "@/lib/seo/pressShare";\n\n`
  );

  src = src.replace(
    /const shareUrl = getPressShareUrl\(\d+\);\s*const shareText = encodeURIComponent\([\s\S]*?\);\s*const shareImage[^;]+;/,
    `const shareUrl = getPressShareUrl(${shareNum});\n${shareTextPlain}\n${shareImageLine}`
  );

  src = src.replace(
    /export default function Home\(\) \{[\s\S]*$/,
    `export default function PressArticlePage() {
  return (
    <PressArticleShell
      title={data.title}
      canonicalPath="${canonicalPath}"
      shareUrl={shareUrl}
      shareText={shareTextPlain}
      shareImage={shareImage}
    >
      ${pressUsage}
    </PressArticleShell>
  );
}
`
  );

  fs.writeFileSync(file, src);
  console.log("Migrated", file);
}
