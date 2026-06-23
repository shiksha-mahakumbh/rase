/**
 * Mobile performance audit for SMK 1.0–5.0 past edition pages.
 * Run: npx tsx scripts/audit-past-editions-performance.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  SMK_1_0_CONTENT,
  SMK_1_0_PATH,
} from "../src/data/editions/shiksha-mahakumbh-1.0-hub";
import {
  SMK_2_0_CONTENT,
  SMK_2_0_PATH,
} from "../src/data/editions/shiksha-mahakumbh-2.0-hub";
import {
  SMK_3_0_CONTENT,
  SMK_3_0_PATH,
} from "../src/data/editions/shiksha-mahakumbh-3.0-hub";
import {
  SMK_4_0_CONTENT,
  SMK_4_0_PATH,
} from "../src/data/editions/shiksha-mahakumbh-4.0-hub";
import {
  SMK_5_0_CONTENT,
  SMK_5_0_PATH,
} from "../src/data/editions/shiksha-mahakumbh-5.0-hub";
import { editionPageHero } from "../src/data/past-editions";

const ROOT = path.resolve(import.meta.dirname ?? __dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const MAX_GALLERY_FILE_KB = 500;
const MAX_LCP_FILE_KB = 200;
const MAX_GALLERY_COUNT = 6;
const issues: string[] = [];

const EDITIONS = [
  { path: SMK_1_0_PATH, content: SMK_1_0_CONTENT },
  { path: SMK_2_0_PATH, content: SMK_2_0_CONTENT },
  { path: SMK_3_0_PATH, content: SMK_3_0_CONTENT },
  { path: SMK_4_0_PATH, content: SMK_4_0_CONTENT },
  { path: SMK_5_0_PATH, content: SMK_5_0_CONTENT },
] as const;

function fileSizeKb(relativePath: string): number | null {
  const filePath = path.join(PUBLIC, relativePath.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) return null;
  return Math.round(fs.statSync(filePath).size / 1024);
}

console.log("═══════════════════════════════════════════");
console.log("  PAST EDITIONS — MOBILE PERFORMANCE AUDIT");
console.log("═══════════════════════════════════════════\n");

const layoutSrc = fs.readFileSync(
  path.join(ROOT, "src/components/layouts/PublicPageLayout.tsx"),
  "utf8"
);
if (layoutSrc.includes('"use client"')) {
  issues.push("PublicPageLayout should be a server component");
} else if (layoutSrc.includes("RelatedContentSectionClient")) {
  issues.push("PublicPageLayout should use server RelatedContentSection");
} else {
  console.log("✓ PublicPageLayout is server-rendered with server related links");
}

const shellSrc = fs.readFileSync(
  path.join(ROOT, "src/components/layouts/PublicPageShell.tsx"),
  "utf8"
);
if (shellSrc.includes('"use client"')) {
  issues.push("PublicPageShell must re-export server PublicPageLayout");
} else {
  console.log("✓ PublicPageShell re-exports server layout");
}

const gallerySrc = fs.readFileSync(
  path.join(ROOT, "src/components/past-editions/editions/EditionGallery.tsx"),
  "utf8"
);
if (gallerySrc.includes('"use client"')) {
  issues.push("EditionGallery must be a server component (no use client)");
} else {
  console.log("✓ EditionGallery is server-rendered");
}
if (gallerySrc.includes("react-slick") || gallerySrc.includes("EventImageSlider")) {
  issues.push("EditionGallery must not import react-slick / EventImageSlider");
} else {
  console.log("✓ Edition gallery uses CSS scroll-snap (no slick)");
}

const stripSrc = fs.readFileSync(
  path.join(ROOT, "src/components/past-editions/editions/EditionGalleryStrip.tsx"),
  "utf8"
);
if (stripSrc.includes('"use client"')) {
  issues.push("EditionGalleryStrip should be server-rendered");
} else {
  console.log("✓ EditionGalleryStrip is server-rendered with lazy images");
}

const pageSrc = fs.readFileSync(
  path.join(ROOT, "src/components/past-editions/editions/PastEditionPage.tsx"),
  "utf8"
);
if (pageSrc.includes("relatedPath=")) {
  issues.push("PastEditionPage should use server RelatedContentSection, not client relatedPath");
} else {
  console.log("✓ Related links rendered server-side in showcase");
}

for (const { path: editionPath, content } of EDITIONS) {
  const hero = editionPageHero(editionPath);
  if (hero.imageSrc) {
    issues.push(`${editionPath}: edition hero must not load a second LCP image`);
  }

  const images = content.galleryImages ?? [];
  if (!images.length) {
    issues.push(`${editionPath}: no gallery images`);
    continue;
  }
  if (images.length > MAX_GALLERY_COUNT) {
    issues.push(`${editionPath}: ${images.length} gallery images (max ${MAX_GALLERY_COUNT})`);
  }

  const lcpKb = fileSizeKb(images[0]);
  if (lcpKb === null) {
    issues.push(`${editionPath}: LCP image missing on disk: ${images[0]}`);
  } else if (lcpKb > MAX_LCP_FILE_KB) {
    issues.push(`${editionPath}: LCP image ${images[0]} is ${lcpKb} KB (max ${MAX_LCP_FILE_KB})`);
  } else {
    console.log(`✓ ${editionPath} LCP ${images[0]} (${lcpKb} KB)`);
  }

  for (const src of images.slice(1)) {
    const kb = fileSizeKb(src);
    if (kb === null) {
      issues.push(`${editionPath}: missing gallery file ${src}`);
    } else if (kb > MAX_GALLERY_FILE_KB) {
      issues.push(`${editionPath}: ${src} is ${kb} KB (max ${MAX_GALLERY_FILE_KB})`);
    }
  }
}

console.log("\n═══════════════════════════════════════════");
if (issues.length) {
  for (const i of issues) console.log(`✗ ${i}`);
  process.exit(1);
}
console.log("PASS: Past edition pages meet mobile performance guardrails.");
console.log("═══════════════════════════════════════════");
