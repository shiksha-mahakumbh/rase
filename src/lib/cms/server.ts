import type { ContentLocale } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { getPublicHomepage } from "@/server/services/homepage.service";
import { getSeoForEntity } from "@/server/services/seo.service";
import { listPublicNotices } from "@/server/services/notice.service";
import { getPublicSiteConfig } from "@/server/services/site-settings.service";
import { getMenuByType } from "@/server/services/menu.service";
import { listActiveAnnouncementBars } from "@/server/services/announcement-bar.service";
import { listPublicDownloads } from "@/server/services/download.service";
import { getPageBySlug, listPublicArticles } from "@/server/services/page.service";
import { listPublicFaqs } from "@/server/services/faq.service";
import type {
  CmsAnnouncementBar,
  CmsDownload,
  CmsHomepage,
  CmsMenu,
  CmsMenuItem,
  CmsNotice,
  CmsArticleCard,
  CmsFaqItem,
  CmsLoadedPage,
  CmsPageData,
  CmsSiteSettings,
} from "./types";
import { resolvePublicNotices, resolveWidgetNotices } from "@/data/default-notices";
import { resolveAnnouncementBars } from "@/data/default-announcements";

function mapNotice(n: {
  id: string;
  title: string;
  slug: string;
  description: string;
  priority: number;
  isPinned: boolean;
  publishAt: Date | null;
  expireAt: Date | null;
  category: { name: string; slug: string } | null;
  attachments: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
  }>;
}): CmsNotice {
  return {
    id: n.id,
    title: n.title,
    slug: n.slug,
    description: n.description,
    priority: n.priority,
    isPinned: n.isPinned,
    publishAt: n.publishAt?.toISOString() ?? null,
    expireAt: n.expireAt?.toISOString() ?? null,
    category: n.category,
    attachments: n.attachments,
  };
}

function mapMenu(menu: {
  id: string;
  name: string;
  slug: string;
  items: Array<{
    id: string;
    label: string;
    url: string;
    isExternal: boolean;
    openInNewTab: boolean;
    icon: string | null;
    sortOrder: number;
    children?: Array<{
      id: string;
      label: string;
      url: string;
      isExternal: boolean;
      openInNewTab: boolean;
      icon: string | null;
      sortOrder: number;
    }>;
  }>;
}): CmsMenu {
  const mapItem = (item: (typeof menu.items)[0]): CmsMenuItem => ({
    id: item.id,
    label: item.label,
    url: item.url,
    isExternal: item.isExternal,
    openInNewTab: item.openInNewTab,
    icon: item.icon,
    sortOrder: item.sortOrder,
    children: item.children?.map((c) => ({
      id: c.id,
      label: c.label,
      url: c.url,
      isExternal: c.isExternal,
      openInNewTab: c.openInNewTab,
      icon: c.icon,
      sortOrder: c.sortOrder,
    })),
  });

  return {
    id: menu.id,
    name: menu.name,
    slug: menu.slug,
    items: menu.items.map(mapItem),
  };
}

export async function loadCmsHomepage(locale: ContentLocale = "en"): Promise<CmsHomepage | null> {
  return unstable_cache(
    async () => {
      try {
        const result = await getPublicHomepage(locale);
        if (!result) return null;
        return {
          page: {
            id: result.page.id,
            title: result.page.title,
            slug: result.page.slug,
            excerpt: result.page.excerpt,
            content: result.page.content,
          },
          sections: result.page.sections.map((s) => ({
            sectionKey: s.sectionKey,
            sectionType: s.sectionType,
            title: s.title,
            content: (s.content as Record<string, unknown>) ?? {},
            sortOrder: s.sortOrder,
            isVisible: s.isVisible,
          })),
          seo: result.seo
            ? {
                seoTitle: result.seo.seoTitle,
                metaDescription: result.seo.metaDescription,
                ogTitle: result.seo.ogTitle,
                ogDescription: result.seo.ogDescription,
                ogImageUrl: result.seo.ogImageUrl,
                canonicalUrl: result.seo.canonicalUrl,
                schemaJsonLd: result.seo.schemaJsonLd,
              }
            : null,
        };
      } catch {
        return null;
      }
    },
    ["cms-homepage", locale],
    { revalidate: 3600, tags: [`cms-homepage-${locale}`] }
  )();
}

export async function loadCmsNotices(
  limit = 50,
  locale: ContentLocale = "en"
): Promise<CmsNotice[]> {
  try {
    const { items } = await listPublicNotices({ limit, locale });
    return resolvePublicNotices(items.map(mapNotice), locale).slice(0, limit);
  } catch {
    return resolvePublicNotices([], locale).slice(0, limit);
  }
}

export async function loadCmsWidgetNotices(
  locale: ContentLocale = "en"
): Promise<CmsNotice[]> {
  try {
    const { items } = await listPublicNotices({ widget: true, limit: 5, locale });
    const mapped = items.map(mapNotice);
    if (mapped.length > 0) return mapped;
    const { items: all } = await listPublicNotices({ limit: 5, locale });
    return resolveWidgetNotices([], all.map(mapNotice), locale, 5);
  } catch {
    return resolveWidgetNotices([], [], locale, 5);
  }
}

export async function loadCmsSettings(
  locale: ContentLocale = "en"
): Promise<CmsSiteSettings | null> {
  try {
    const s = await getPublicSiteConfig(locale);
    return {
      ...s,
      socialLinks: (s.socialLinks as Record<string, string>) ?? {},
    };
  } catch {
    return null;
  }
}

export async function loadCmsHeaderMenu(
  locale: ContentLocale = "en"
): Promise<CmsMenu | null> {
  try {
    const menu = await getMenuByType("header", locale);
    return menu ? mapMenu(menu) : null;
  } catch {
    return null;
  }
}

export async function loadCmsFooterMenu(
  locale: ContentLocale = "en"
): Promise<CmsMenu | null> {
  try {
    const menu = await getMenuByType("footer", locale);
    return menu ? mapMenu(menu) : null;
  } catch {
    return null;
  }
}

export async function loadCmsAnnouncementBars(
  locale: ContentLocale = "en"
): Promise<CmsAnnouncementBar[]> {
  try {
    const bars = await listActiveAnnouncementBars(locale);
    const mapped = bars.map((b) => ({
      id: b.id,
      title: b.title,
      message: b.message,
      barType: b.barType,
      colorTheme: b.colorTheme,
      ctaLabel: b.ctaLabel,
      ctaUrl: b.ctaUrl,
      isDismissible: b.isDismissible,
    }));
    return resolveAnnouncementBars(mapped, locale);
  } catch {
    return resolveAnnouncementBars([], locale);
  }
}

export async function loadCmsDownloads(): Promise<CmsDownload[]> {
  try {
    const { items } = await listPublicDownloads({ limit: 100 });
    return items.map((d) => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      description: d.description,
      category: d.category,
      downloadType: d.downloadType,
      tags: d.tags,
      downloadCount: d.downloadCount,
      fileUrl: d.fileUrl,
      expiresAt: d.expiresAt?.toISOString() ?? null,
    }));
  } catch {
    return [];
  }
}

export async function loadCmsFeaturedFaqs(
  locale: ContentLocale = "en"
): Promise<CmsFaqItem[]> {
  try {
    const { featured } = await listPublicFaqs(locale);
    return featured.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category?.name ?? null,
      isFeatured: faq.isFeatured,
    }));
  } catch {
    return [];
  }
}

async function loadCmsPageDataUncached(locale: ContentLocale = "en"): Promise<CmsPageData> {
  const [
    homepage,
    notices,
    widgetNotices,
    settings,
    headerMenu,
    footerMenu,
    announcementBars,
    featuredFaqs,
  ] = await Promise.all([
    loadCmsHomepage(locale),
    loadCmsNotices(50, locale),
    loadCmsWidgetNotices(locale),
    loadCmsSettings(locale),
    loadCmsHeaderMenu(locale),
    loadCmsFooterMenu(locale),
    loadCmsAnnouncementBars(locale),
    loadCmsFeaturedFaqs(locale),
  ]);

  return {
    homepage,
    notices,
    widgetNotices,
    settings,
    headerMenu,
    footerMenu,
    announcementBars,
    featuredFaqs,
  };
}

/** Cached shell data — avoids hundreds of duplicate Prisma calls during `next build`. */
export async function loadCmsPageData(locale: ContentLocale = "en"): Promise<CmsPageData> {
  return unstable_cache(() => loadCmsPageDataUncached(locale), ["cms-page-data", locale], {
    revalidate: 3600,
    tags: [`cms-page-data-${locale}`],
  })();
}

export async function loadRouteSeo(routeKey: string, locale: ContentLocale = "en") {
  return unstable_cache(
    async () => {
      try {
        const seo = await getSeoForEntity("route", routeKey, locale);
        if (!seo) return null;
        return {
          seoTitle: seo.seoTitle,
          metaDescription: seo.metaDescription,
          ogTitle: seo.ogTitle,
          ogDescription: seo.ogDescription,
          ogImageUrl: seo.ogImageUrl,
          canonicalUrl: seo.canonicalUrl,
          robots: seo.robots,
        };
      } catch {
        return null;
      }
    },
    ["cms-route-seo", routeKey, locale],
    { revalidate: 3600, tags: [`cms-route-seo-${routeKey}-${locale}`] }
  )();
}

export async function loadDefaultOgImage(locale: ContentLocale = "en"): Promise<string | null> {
  const settings = await loadCmsSettings(locale);
  return settings?.logoUrl ?? null;
}

export async function loadCmsPageBySlug(
  slug: string,
  locale: ContentLocale = "en"
): Promise<CmsLoadedPage | null> {
  try {
    const result = await getPageBySlug(slug, locale);
    if (!result) return null;

    const { page, seo } = result;
    return {
      page: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        locale: page.locale,
        excerpt: page.excerpt,
        content: page.content,
        publishedAt: page.publishedAt?.toISOString() ?? null,
        sections: page.sections.map((s) => ({
          sectionKey: s.sectionKey,
          sectionType: s.sectionType,
          title: s.title,
          content: (s.content as Record<string, unknown>) ?? {},
          sortOrder: s.sortOrder,
          isVisible: s.isVisible,
        })),
      },
      seo: seo
        ? {
            seoTitle: seo.seoTitle,
            metaDescription: seo.metaDescription,
            ogTitle: seo.ogTitle,
            ogDescription: seo.ogDescription,
            ogImageUrl: seo.ogImageUrl,
            canonicalUrl: seo.canonicalUrl,
            robots: seo.robots,
          }
        : null,
    };
  } catch {
    return null;
  }
}

export async function loadCmsArticles(
  locale?: ContentLocale,
  limit = 12
): Promise<CmsArticleCard[]> {
  try {
    const items = await listPublicArticles({ locale, limit });
    return items.map((page) => {
      const articleSection = page.sections.find((s) => s.sectionKey === "article");
      const content = (articleSection?.content as Record<string, unknown>) ?? {};
      const heroImage =
        typeof content.heroImage === "string" ? content.heroImage : null;

      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        locale: page.locale,
        excerpt: page.excerpt,
        heroImage,
        href: `/press/${page.slug}`,
      };
    });
  } catch {
    return [];
  }
}

export { getSection, sectionItems, sectionField } from "./utils";
