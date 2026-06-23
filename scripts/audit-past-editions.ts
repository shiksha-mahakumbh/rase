/**
 * Audit SMK 1.0–5.0 past edition detail pages.
 * Run: npx tsx scripts/audit-past-editions.ts
 */
import fs from "node:fs";
import path from "node:path";
import {
  PAST_EDITIONS,
  getAdjacentEditions,
  getEditionByHref,
} from "../src/data/past-editions";
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
import { getCuratedLinksForPath } from "../src/lib/knowledge-graph/site-cleanup";
import { createPastEditionPageMetadata } from "../src/lib/seo/past-edition-metadata";

const ROOT = path.resolve(import.meta.dirname ?? __dirname, "..");
const issues: string[] = [];

const EDITIONS = [
  { path: SMK_1_0_PATH, content: SMK_1_0_CONTENT },
  { path: SMK_2_0_PATH, content: SMK_2_0_CONTENT },
  { path: SMK_3_0_PATH, content: SMK_3_0_CONTENT },
  { path: SMK_4_0_PATH, content: SMK_4_0_CONTENT },
  { path: SMK_5_0_PATH, content: SMK_5_0_CONTENT },
] as const;

console.log("═══════════════════════════════════════════");
console.log("  PAST EDITIONS AUDIT (SMK 1.0–5.0)");
console.log("═══════════════════════════════════════════\n");

if (PAST_EDITIONS.length !== 5) {
  issues.push(`Expected 5 PAST_EDITIONS records, got ${PAST_EDITIONS.length}`);
} else {
  console.log("✓ Five canonical edition records in past-editions.ts");
}

const pageSrc = fs.readFileSync(
  path.join(ROOT, "src/components/past-editions/editions/PastEditionPage.tsx"),
  "utf8"
);
if (pageSrc.includes('"use client"')) {
  issues.push("PastEditionPage should be a server component");
} else {
  console.log("✓ PastEditionPage is a server component");
}
if (!pageSrc.includes("showCta={false}")) {
  issues.push("PastEditionPage must disable mid-page registration CTA");
} else {
  console.log("✓ Mid-page CTA disabled on edition pages");
}
if (!pageSrc.includes("editionPath={path}")) {
  issues.push("PastEditionPage must pass edition path for server related links");
} else {
  console.log("✓ Edition path passed for server related links");
}

const jsonLdSrc = fs.readFileSync(
  path.join(ROOT, "src/components/past-editions/PastEditionJsonLd.tsx"),
  "utf8"
);
if (jsonLdSrc.includes("EventScheduled")) {
  issues.push("Past events should not use EventScheduled JSON-LD status");
} else {
  console.log("✓ JSON-LD omits incorrect EventScheduled status");
}

for (const { path: editionPath, content } of EDITIONS) {
  const edition = getEditionByHref(editionPath);
  if (!edition) {
    issues.push(`Missing PAST_EDITIONS record for ${editionPath}`);
    continue;
  }

  const layoutPath = path.join(
    ROOT,
    "src/app/past_event",
    editionPath.replace("/past_event/", ""),
    "layout.tsx"
  );
  if (!fs.existsSync(layoutPath)) {
    issues.push(`Missing layout: ${layoutPath}`);
  }
  if (!fs.existsSync(path.join(ROOT, "src/app/past_event", editionPath.replace("/past_event/", ""), "page.tsx"))) {
    issues.push(`Missing page: ${editionPath}`);
  }

  const curated = getCuratedLinksForPath(editionPath, 4);
  if (curated.length < 4) {
    issues.push(`${editionPath}: only ${curated.length} curated related links`);
  }

  const meta = createPastEditionPageMetadata(editionPath);
  const ogImage = meta.openGraph?.images?.[0];
  if (ogImage && typeof ogImage === "object" && "url" in ogImage) {
    const url = String(ogImage.url);
    if (!edition.imageSrc || !url.includes(edition.imageSrc.replace(/^\//, ""))) {
      if (!edition.imageSrc) issues.push(`${editionPath}: missing imageSrc for OG`);
    }
  }

  if (!content.galleryImages?.length) {
    issues.push(`${editionPath}: no gallery images configured`);
  }

  const { prev, next } = getAdjacentEditions(content.editionNumber);
  if (content.editionNumber === "1.0" && prev) issues.push("SMK 1.0 should not have prev edition");
  if (content.editionNumber === "5.0" && next) issues.push("SMK 5.0 should not have next edition");
  if (content.editionNumber === "2.0" && (!prev || !next)) {
    issues.push("SMK 2.0 should have prev and next edition navigation");
  }
}

console.log("✓ All five routes have layouts, content hubs, and curated links");
console.log("✓ Edition prev/next navigation data wired");

if (pageSrc.includes("relatedPath={path}")) {
  issues.push("PastEditionPage should not use client relatedPath in PublicPageShell");
} else {
  console.log("✓ Edition page avoids client-side related links shell");
}

const layoutSrc = fs.readFileSync(
  path.join(ROOT, "src/components/layouts/PublicPageLayout.tsx"),
  "utf8"
);
if (layoutSrc.includes('"use client"')) {
  issues.push("PublicPageLayout should be a server component");
} else {
  console.log("✓ PublicPageLayout is server-rendered");
}

const gallerySrc = fs.readFileSync(
  path.join(ROOT, "src/components/past-editions/editions/EditionGallery.tsx"),
  "utf8"
);
if (gallerySrc.includes('"use client"')) {
  issues.push("EditionGallery should be server-rendered for LCP");
} else {
  console.log("✓ EditionGallery is server-rendered");
}

const perfAudit = path.join(ROOT, "scripts/audit-past-editions-performance.ts");
if (!fs.existsSync(perfAudit)) {
  issues.push("Missing scripts/audit-past-editions-performance.ts");
} else {
  console.log("✓ Mobile performance audit script present");
}

const showcaseSrc = fs.readFileSync(
  path.join(ROOT, "src/components/past-editions/editions/PastEditionDetailShowcase.tsx"),
  "utf8"
);
for (const name of ["BreadcrumbNav", "EditionPrevNext", "EditionGallery", "RelatedContentSection"]) {
  if (!showcaseSrc.includes(name)) issues.push(`PastEditionDetailShowcase missing ${name}`);
}
if (!issues.some((i) => i.includes("PastEditionDetailShowcase"))) {
  console.log("✓ Detail showcase includes breadcrumbs, prev/next, and gallery");
}

console.log("\n═══════════════════════════════════════════");
if (issues.length) {
  for (const i of issues) console.log(`✗ ${i}`);
  process.exit(1);
}
console.log("PASS: Past edition pages look healthy.");
console.log("═══════════════════════════════════════════");
