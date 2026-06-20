/**
 * Seed full press article content into CMS (Page + PageSection + SeoMetadata).
 * Usage: node scripts/seed-press-cms.mjs [--publish]
 *
 * Prerequisite: node scripts/extract-press-content.mjs (regenerates src/data/press-articles.json)
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const publish = process.argv.includes("--publish");

const jsonPath = path.join(process.cwd(), "src/data/press-articles.json");
if (!fs.existsSync(jsonPath)) {
  console.error("Missing src/data/press-articles.json — run: node scripts/extract-press-content.mjs");
  process.exit(1);
}

const PRESS_ARTICLES = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

async function upsertPressArticle(article) {
  const now = publish ? new Date() : null;
  const page = await prisma.page.upsert({
    where: { slug_locale: { slug: article.slug, locale: "en" } },
    create: {
      title: article.title,
      slug: article.slug,
      locale: "en",
      pageType: "article",
      excerpt: article.excerpt,
      status: publish ? "published" : "draft",
      publishAt: now,
      publishedAt: now,
    },
    update: {
      title: article.title,
      excerpt: article.excerpt,
      pageType: "article",
      ...(publish
        ? { status: "published", publishAt: now, publishedAt: now }
        : {}),
    },
  });

  await prisma.pageSection.upsert({
    where: { pageId_sectionKey: { pageId: page.id, sectionKey: "article" } },
    create: {
      pageId: page.id,
      sectionKey: "article",
      sectionType: "content",
      content: {
        heroImage: article.heroImage,
        pressNumber: article.pressNumber,
        shareText: article.shareText,
        sections: article.sections,
      },
    },
    update: {
      content: {
        heroImage: article.heroImage,
        pressNumber: article.pressNumber,
        shareText: article.shareText,
        sections: article.sections,
      },
    },
  });

  await prisma.seoMetadata.upsert({
    where: {
      entityType_entityId_locale: {
        entityType: "page",
        entityId: page.id,
        locale: "en",
      },
    },
    create: {
      entityType: "page",
      entityId: page.id,
      locale: "en",
      seoTitle: article.title,
      metaDescription: article.excerpt,
      canonicalUrl: `/press/${article.slug}`,
      ogImageUrl: article.heroImage,
    },
    update: {
      seoTitle: article.title,
      metaDescription: article.excerpt,
      canonicalUrl: `/press/${article.slug}`,
      ogImageUrl: article.heroImage,
    },
  });

  return page;
}

async function main() {
  console.log(`Seeding ${PRESS_ARTICLES.length} press articles (publish=${publish})…`);
  for (const article of PRESS_ARTICLES) {
    await upsertPressArticle(article);
    console.log(`  ✓ ${article.slug}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
