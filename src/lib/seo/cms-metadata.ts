import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/config/site";
import type { CmsHomepage } from "@/lib/cms/types";
import { hreflangForPath } from "@/lib/seo/hreflang";

export type CmsSeoFields = {
  seoTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
};

export function metadataFromCmsSeo(
  seo: CmsSeoFields | null | undefined,
  fallback: {
    title: string;
    description: string;
    path?: string;
    ogImageUrl?: string | null;
  }
): Metadata {
  const title = seo?.seoTitle ?? seo?.ogTitle ?? fallback.title;
  const description = seo?.metaDescription ?? seo?.ogDescription ?? fallback.description;
  const path = seo?.canonicalUrl ?? fallback.path ?? "/";
  const canonicalPath = path.startsWith("http")
    ? new URL(path).pathname
    : path;
  const url = path.startsWith("http") ? path : `${SITE_URL}${path}`;
  const image = seo?.ogImageUrl ?? fallback.ogImageUrl ?? DEFAULT_OG_IMAGE;
  const hreflang = hreflangForPath(canonicalPath);
  const noIndex = seo?.robots?.includes("noindex") ?? false;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
      ...(hreflang ? { languages: hreflang } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      images: [image],
    },
  };
}
