import type { ContentLocale, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import {
  createPage,
  getPageBySlug,
  upsertPageSection,
  updatePage,
  publishPage,
} from "@/server/services/page.service";
import { upsertSeoForEntity, buildWebPageSchema } from "@/server/services/seo.service";
import { ServiceError } from "@/server/lib/errors";
import { purgeCmsContentCaches } from "@/server/lib/cms-cache-purge";

export const HOMEPAGE_SLUG = "home";
export const HOMEPAGE_SECTION_KEYS = [
  "hero",
  "stats",
  "counters",
  "featured_events",
  "featured_programs",
  "testimonials",
  "partners",
  "announcements",
  "gallery",
  "cta",
] as const;

export type HomepageSectionKey = (typeof HOMEPAGE_SECTION_KEYS)[number];

const DEFAULT_SECTION_TYPES: Record<HomepageSectionKey, string> = {
  hero: "hero",
  stats: "stats",
  counters: "counter",
  featured_events: "featured_events",
  featured_programs: "featured_programs",
  testimonials: "testimonial",
  partners: "partner",
  announcements: "announcement",
  gallery: "gallery",
  cta: "cta",
};

export async function getOrCreateHomepage(locale: ContentLocale = "en") {
  const existing = await prisma.page.findFirst({
    where: { slug: HOMEPAGE_SLUG, pageType: "homepage", locale, deletedAt: null },
    include: { sections: { orderBy: { sortOrder: "asc" } } },
  });

  if (existing) return existing;

  return createPage({
    title: "Homepage",
    slug: HOMEPAGE_SLUG,
    pageType: "homepage",
    locale,
    status: "draft",
    sections: HOMEPAGE_SECTION_KEYS.map((key, i) => ({
      sectionKey: key,
      sectionType: DEFAULT_SECTION_TYPES[key],
      title: key.replace(/_/g, " "),
      content: {},
      sortOrder: i,
    })),
    seo: {
      seoTitle: "Shiksha Mahakumbh Abhiyan",
      metaDescription: "International education conclave and holistic learning platform",
      canonicalUrl: "/",
    },
  });
}

export async function getPublicHomepage(locale: ContentLocale = "en") {
  const result = await getPageBySlug(HOMEPAGE_SLUG, locale);
  if (!result || result.page.pageType !== "homepage") return null;
  return result;
}

export async function updateHomepageSection(
  sectionKey: HomepageSectionKey,
  input: {
    title?: string;
    content?: Prisma.InputJsonValue;
    sortOrder?: number;
    isVisible?: boolean;
    locale?: ContentLocale;
  }
) {
  if (!HOMEPAGE_SECTION_KEYS.includes(sectionKey)) {
    throw new ServiceError("Invalid homepage section key", 400, "INVALID_SECTION");
  }

  const page = await getOrCreateHomepage(input.locale ?? "en");
  const section = await upsertPageSection(page.id, {
    sectionKey,
    sectionType: DEFAULT_SECTION_TYPES[sectionKey],
    title: input.title,
    content: input.content,
    sortOrder: input.sortOrder,
    isVisible: input.isVisible,
  });
  purgeCmsContentCaches({ locales: [input.locale ?? "en"], includeHome: true });
  return section;
}

export async function updateHomepageSections(
  sections: Array<{
    sectionKey: HomepageSectionKey;
    title?: string;
    content?: Prisma.InputJsonValue;
    sortOrder?: number;
    isVisible?: boolean;
  }>,
  locale: ContentLocale = "en"
) {
  const page = await getOrCreateHomepage(locale);
  const results = [];

  for (const section of sections) {
    results.push(
      await upsertPageSection(page.id, {
        sectionKey: section.sectionKey,
        sectionType: DEFAULT_SECTION_TYPES[section.sectionKey],
        title: section.title,
        content: section.content,
        sortOrder: section.sortOrder,
        isVisible: section.isVisible,
      })
    );
  }

  purgeCmsContentCaches({ locales: [locale], includeHome: true });

  return { pageId: page.id, sections: results };
}

export async function publishHomepage(locale: ContentLocale = "en", userId?: string) {
  const page = await getOrCreateHomepage(locale);
  const published = await publishPage(page.id, userId);

  await upsertSeoForEntity({
    entityType: "page",
    entityId: page.id,
    locale,
    seoTitle: "Shiksha Mahakumbh Abhiyan",
    canonicalUrl: "/",
    schemaJsonLd: buildWebPageSchema({
      title: "Shiksha Mahakumbh Abhiyan",
      url: "/",
    }),
    sitemapPriority: 1.0,
    sitemapChangefreq: "daily",
  });

  return published;
}

export async function updateHomepageMeta(
  data: {
    title?: string;
    excerpt?: string;
    seo?: {
      seoTitle?: string;
      metaDescription?: string;
      metaKeywords?: string[];
      canonicalUrl?: string;
      ogImageUrl?: string;
    };
  },
  locale: ContentLocale = "en",
  userId?: string
) {
  const page = await getOrCreateHomepage(locale);
  return updatePage(page.id, data, userId);
}
