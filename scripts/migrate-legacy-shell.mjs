import fs from "fs";
import path from "path";

const HERO_BY_DIR = {
  proceedings: { eyebrow: "Publications", title: "Proceedings", subtitle: "Peer-reviewed volumes from Shiksha Mahakumbh editions." },
  proceeding1: { eyebrow: "Publications", title: "Proceedings Volume I", subtitle: "Research outcomes from Shiksha Mahakumbh." },
  proceeding2: { eyebrow: "Publications", title: "Proceedings Volume II", subtitle: "Research outcomes from Shiksha Mahakumbh." },
  proceeding3: { eyebrow: "Publications", title: "Proceedings Volume III", subtitle: "Research outcomes from Shiksha Mahakumbh." },
  journals: { eyebrow: "Publications", title: "Journals", subtitle: "Academic journals affiliated with the national education movement." },
  books: { eyebrow: "Publications", title: "Books", subtitle: "Published works from Shiksha Mahakumbh programmes." },
  paper: { eyebrow: "Research", title: "Paper Submission", subtitle: "Submit research papers for Shiksha Mahakumbh." },
  fulllengthpaper: { eyebrow: "Research", title: "Full-Length Paper", subtitle: "Submit full-length research papers." },
  keynotespeakers: { eyebrow: "Programmes", title: "Keynote Speakers", subtitle: "Distinguished speakers at Shiksha Mahakumbh summits." },
  donation: { eyebrow: "Support", title: "Donation", subtitle: "Support the national education movement." },
  feedback: { eyebrow: "Community", title: "Feedback", subtitle: "Share your experience with Shiksha Mahakumbh programmes." },
  ResidentialCamp: { eyebrow: "Programmes", title: "Residential Camp", subtitle: "Residential training programmes at Shiksha Mahakumbh." },
  BatonCeremony: { eyebrow: "Events", title: "Baton Ceremony", subtitle: "Ceremonial launch of Shiksha Mahakumbh editions." },
  schoolprojectdisplaysubmission: { eyebrow: "Registration", title: "School Project Display", subtitle: "Submit school project displays for exhibition." },
  heiprojectdisplaysubmission: { eyebrow: "Registration", title: "HEI Project Display", subtitle: "Submit higher-education project displays." },
};

const SKIP = new Set([
  "admin", "AllData", "api", "component", "[locale]",
  "press", "gallery", "videos", "conclave", "abstract", "accommodation",
  "coming-soon", "TalkShow", "Topics", "shikshamahakumbh", "shikshakumbh",
  "upcoming-events", "contact-us", "glimpses",
]);

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (!SKIP.has(ent.name) && !ent.name.startsWith("_")) walk(p, files);
    } else if (ent.name === "page.tsx") files.push(p);
  }
  return files;
}

const root = "src/app";
for (const file of walk(root)) {
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("CompanyInfo")) continue;

  const parts = file.split(path.sep);
  const dirName = parts[parts.length - 2];
  const hero = HERO_BY_DIR[dirName];
  if (!hero) continue;

  const isClient = src.includes('"use client"') || src.includes("'use client'");
  const clientLine = isClient ? '"use client";\n\n' : "";

  const contentMatch = src.match(
    /<CompanyInfo\s*\/?>[\s\S]*?<NavBar\s*\/?>[\s\S]*?(?:<div[^>]*>[\s\S]*?)?([\s\S]*?)<Footer/
  );
  if (!contentMatch) continue;

  let inner = contentMatch[1]
    .replace(/<div className="flex flex-col[^"]*"[\s\S]*?<div className="w-full sm:w-1\/5[^"]*">\s*<\/div>/g, "")
    .replace(/<div className="w-full sm:w-1\/5[^"]*">\s*<\/div>/g, "")
    .replace(/<div className="w-full sm:w-3\/5[^"]*">/g, "")
    .replace(/<div className="md:w-1\/6"><\/div>/g, "")
    .replace(/<div className="md:w-4\/6">/g, "")
    .trim();

  const heroJson = JSON.stringify(hero, null, 2).replace(/"([^"]+)":/g, "$1:");

  const newSrc = `${clientLine}import PublicPageShell from "@/components/layouts/PublicPageShell";

const PAGE_HERO = ${JSON.stringify(hero, null, 2)} as const;

${src.includes("export default") ? src.match(/(const|function)[\s\S]*export default[\s\S]*?\{[\s\S]*?\n\}/)?.[0] ? "" : ""}`;

  // Simpler: replace shell only
  const imports = `${clientLine}import PublicPageShell from "@/components/layouts/PublicPageShell";\n`;
  src = src.replace(/import CompanyInfo[^\n]+\n/g, "");
  src = src.replace(/import NavBar[^\n]+\n/g, "");
  src = src.replace(/import Footer[^\n]+\n/g, "");
  if (!src.includes("PublicPageShell")) {
    src = src.replace(/^(?:"use client";\s*\n)?/m, imports);
  }

  src = src.replace(
    /return\s*\(\s*<div className=['"]bg-white[^'"]*['"]>[\s\S]*?<CompanyInfo\s*\/?>[\s\S]*?<NavBar\s*\/?>[\s\S]*?<Footer\s*\/?>[\s\S]*?<\/div>\s*\)/,
    `return (
    <PublicPageShell hero={PAGE_HERO}>
      ${inner.replace(/<\/div>\s*<\/div>/g, "").trim()}
    </PublicPageShell>
  )`
  );

  if (!src.includes("PAGE_HERO")) {
    src = src.replace(
      imports,
      `${imports}\nconst PAGE_HERO = ${JSON.stringify(hero)} as const;\n\n`
    );
  }

  fs.writeFileSync(file, src);
  console.log("Migrated", file);
}
