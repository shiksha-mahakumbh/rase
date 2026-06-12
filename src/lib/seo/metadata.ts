import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/config/site";
import { hreflangForPath } from "@/lib/seo/hreflang";

export function createPageMetadata(options: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImageUrl?: string;
  locale?: "en_IN" | "hi_IN";
}): Metadata {
  const path = options.path ?? "/";
  const url = `${SITE_URL}${path}`;
  const image = options.ogImageUrl ?? DEFAULT_OG_IMAGE;
  const hreflang = hreflangForPath(path);

  return {
    title: `${options.title} | ${SITE_NAME}`,
    description: options.description,
    keywords: options.keywords,
    alternates: {
      canonical: url,
      ...(hreflang ? { languages: hreflang } : {}),
    },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: options.title,
      description: options.description,
      url,
      siteName: SITE_NAME,
      locale: options.locale ?? "en_IN",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: options.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: [image],
    },
  };
}
