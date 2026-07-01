import { revalidatePath, revalidateTag } from "next/cache";
import type { ContentLocale } from "@prisma/client";

const CMS_LOCALES: ContentLocale[] = ["en", "hi"];

/** Invalidate ISR + unstable_cache tags after CMS content changes. */
export function purgeCmsContentCaches(options?: {
  locales?: ContentLocale[];
  slug?: string;
  includeHome?: boolean;
}) {
  const locales = options?.locales ?? CMS_LOCALES;

  revalidatePath("/", "layout");

  if (options?.includeHome !== false) {
    revalidatePath("/");
    revalidatePath("/hi");
  }

  if (options?.slug) {
    const slug = options.slug.replace(/^\//, "");
    revalidatePath(`/${slug}`);
    revalidatePath(`/hi/${slug}`);
    revalidatePath(`/press/${slug}`);
  }

  for (const locale of locales) {
    revalidateTag(`cms-page-data-${locale}`);
    revalidateTag(`cms-home-shell-${locale}`);
    revalidateTag(`cms-homepage-${locale}`);
    revalidateTag(`cms-chrome-data-${locale}`);
  }
}

export function purgeNoticesCaches(locales?: ContentLocale[]) {
  revalidatePath("/noticeboard");
  purgeCmsContentCaches({ locales });
}

export function purgeCmsGlobalSiteCaches() {
  purgeCmsContentCaches();
  revalidatePath("/noticeboard");
  revalidatePath("/downloads");
  revalidatePath("/contact-us");
  revalidatePath("/faq");
}

export function purgeFaqCaches(locale: ContentLocale = "en") {
  revalidatePath("/faq");
  purgeCmsContentCaches({ locales: [locale] });
}

export function purgeGalleryCaches(locale: ContentLocale = "en") {
  revalidatePath("/gallery");
  purgeCmsContentCaches({ locales: [locale] });
}

export function purgeDownloadCaches() {
  revalidatePath("/downloads");
  purgeCmsContentCaches();
}
