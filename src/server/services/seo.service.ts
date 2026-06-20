import type { ContentLocale, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { SITE_URL } from "@/config/site";

const SITE_NAME = "Shiksha Mahakumbh Abhiyan";
const ORG_NAME = "Department of Holistic Education (DHE)";

/** Prisma maps entity_id to Postgres UUID — skip lookup for non-UUID keys (e.g. route slugs). */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type SeoInput = {
  entityType: string;
  entityId: string;
  locale?: ContentLocale;
  seoTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImageUrl?: string;
  schemaJsonLd?: Prisma.InputJsonValue;
  hreflangAlternates?: Prisma.InputJsonValue;
  sitemapInclude?: boolean;
  sitemapPriority?: number;
  sitemapChangefreq?: string;
};

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      SITE_URL,
      "https://www.dhe.org.in",
    ],
  };
}

export function buildEventSchema(input: {
  name: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url?: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    location: input.location
      ? { "@type": "Place", name: input.location }
      : undefined,
    url: input.url ?? SITE_URL,
    description: input.description,
    organizer: { "@type": "Organization", name: ORG_NAME },
  };
}

export function buildFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function buildNewsArticleSchema(input: {
  headline: string;
  datePublished: string;
  author?: string;
  image?: string;
  url: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: input.headline,
    datePublished: input.datePublished,
    author: input.author ? { "@type": "Person", name: input.author } : undefined,
    image: input.image,
    url: input.url.startsWith("http") ? input.url : `${SITE_URL}${input.url}`,
    description: input.description,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function buildWebPageSchema(input: {
  title: string;
  description?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: input.url.startsWith("http") ? input.url : `${SITE_URL}${input.url}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}

function defaultSchemaForEntity(
  entityType: string,
  input: { seoTitle?: string; metaDescription?: string; canonicalUrl?: string }
) {
  if (entityType === "page") {
    return buildWebPageSchema({
      title: input.seoTitle ?? SITE_NAME,
      description: input.metaDescription,
      url: input.canonicalUrl ?? "/",
    });
  }
  return buildOrganizationSchema();
}

export async function upsertSeoForEntity(input: SeoInput) {
  const locale = input.locale ?? "en";
  const canonical = input.canonicalUrl ?? `/${input.entityType}/${input.entityId}`;
  const schema =
    input.schemaJsonLd ??
    defaultSchemaForEntity(input.entityType, {
      seoTitle: input.seoTitle,
      metaDescription: input.metaDescription,
      canonicalUrl: canonical,
    });

  return prisma.seoMetadata.upsert({
    where: {
      entityType_entityId_locale: {
        entityType: input.entityType,
        entityId: input.entityId,
        locale,
      },
    },
    create: {
      entityType: input.entityType,
      entityId: input.entityId,
      locale,
      seoTitle: input.seoTitle ?? null,
      metaDescription: input.metaDescription ?? null,
      metaKeywords: input.metaKeywords ?? [],
      canonicalUrl: canonical,
      robots: input.robots ?? "index,follow",
      ogTitle: input.ogTitle ?? input.seoTitle ?? null,
      ogDescription: input.ogDescription ?? input.metaDescription ?? null,
      ogImageUrl: input.ogImageUrl ?? null,
      twitterCard: input.twitterCard ?? "summary_large_image",
      twitterTitle: input.twitterTitle ?? input.seoTitle ?? null,
      twitterDescription: input.twitterDescription ?? input.metaDescription ?? null,
      twitterImageUrl: input.twitterImageUrl ?? input.ogImageUrl ?? null,
      schemaJsonLd: schema as Prisma.InputJsonValue,
      hreflangAlternates: input.hreflangAlternates ?? [],
      sitemapInclude: input.sitemapInclude ?? true,
      sitemapPriority: input.sitemapPriority ?? null,
      sitemapChangefreq: input.sitemapChangefreq ?? "weekly",
    },
    update: {
      seoTitle: input.seoTitle,
      metaDescription: input.metaDescription,
      metaKeywords: input.metaKeywords,
      canonicalUrl: input.canonicalUrl,
      robots: input.robots,
      ogTitle: input.ogTitle,
      ogDescription: input.ogDescription,
      ogImageUrl: input.ogImageUrl,
      twitterCard: input.twitterCard,
      twitterTitle: input.twitterTitle,
      twitterDescription: input.twitterDescription,
      twitterImageUrl: input.twitterImageUrl,
      schemaJsonLd: input.schemaJsonLd ? (input.schemaJsonLd as Prisma.InputJsonValue) : undefined,
      hreflangAlternates: input.hreflangAlternates,
      sitemapInclude: input.sitemapInclude,
      sitemapPriority: input.sitemapPriority,
      sitemapChangefreq: input.sitemapChangefreq,
    },
  });
}

export async function getSeoForEntity(
  entityType: string,
  entityId: string,
  locale: ContentLocale = "en"
) {
  if (!UUID_RE.test(entityId)) {
    return null;
  }

  return prisma.seoMetadata.findUnique({
    where: { entityType_entityId_locale: { entityType, entityId, locale } },
  });
}

export async function getSitemapEntries(locale?: ContentLocale) {
  const where: Prisma.SeoMetadataWhereInput = {
    sitemapInclude: true,
    robots: { contains: "index" },
    ...(locale ? { locale } : {}),
  };

  const entries = await prisma.seoMetadata.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });

  return entries.map((e) => ({
    url: e.canonicalUrl?.startsWith("http")
      ? e.canonicalUrl
      : `${SITE_URL}${e.canonicalUrl ?? "/"}`,
    lastModified: e.updatedAt,
    changeFrequency: (e.sitemapChangefreq ?? "weekly") as
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never",
    priority: e.sitemapPriority ? Number(e.sitemapPriority) : 0.5,
    locale: e.locale,
    hreflangAlternates: e.hreflangAlternates,
  }));
}

export async function generateSitemapIndex() {
  const locales: ContentLocale[] = ["en", "hi"];
  const allEntries = await Promise.all(locales.map((l) => getSitemapEntries(l)));
  const merged = allEntries.flat();

  const pages = await prisma.page.findMany({
    where: { status: "published", deletedAt: null },
    select: { slug: true, locale: true, updatedAt: true },
  });

  for (const p of pages) {
    const hasSeo = merged.some(
      (e) => e.url.includes(`/${p.slug}`) && e.locale === p.locale
    );
    if (!hasSeo) {
      merged.push({
        url: `${SITE_URL}/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
        locale: p.locale,
        hreflangAlternates: [],
      });
    }
  }

  const staticRoutes = [
    { path: "/noticeboard", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/downloads", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  for (const route of staticRoutes) {
    if (!merged.some((e) => e.url === `${SITE_URL}${route.path}`)) {
      merged.push({
        url: `${SITE_URL}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        locale: "en",
        hreflangAlternates: [],
      });
    }
  }

  const notices = await prisma.notice.findMany({
    where: { status: "published", deletedAt: null },
    select: { slug: true, locale: true, updatedAt: true },
    take: 500,
  });

  for (const n of notices) {
    const url = `${SITE_URL}/noticeboard#${n.slug}`;
    if (!merged.some((e) => e.url === url)) {
      merged.push({
        url,
        lastModified: n.updatedAt,
        changeFrequency: "weekly",
        priority: 0.5,
        locale: n.locale,
        hreflangAlternates: [],
      });
    }
  }

  return merged;
}

export async function getRobotsConfig() {
  const noindex = await prisma.seoMetadata.count({
    where: { robots: { contains: "noindex" } },
  });
  return {
    allow: "/",
    disallow: ["/admin", "/api/"],
    sitemap: `${SITE_URL}/sitemap.xml`,
    cmsNoindexEntities: noindex,
  };
}

export function resolveOpenGraphImage(seo: {
  ogImageUrl?: string | null;
  twitterImageUrl?: string | null;
}) {
  return (
    seo.ogImageUrl ??
    seo.twitterImageUrl ??
    `${SITE_URL}/og-default.jpg`
  );
}

export async function deleteSeoForEntity(entityType: string, entityId: string) {
  return prisma.seoMetadata.deleteMany({ where: { entityType, entityId } });
}
