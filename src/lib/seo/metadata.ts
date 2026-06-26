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
  ogImages?: { url: string; alt?: string; width?: number; height?: number }[];
  locale?: "en_IN" | "hi_IN";
}): Metadata {
  const path = options.path ?? "/";
  const url = `${SITE_URL}${path}`;
  const hreflang = hreflangForPath(path);
  const openGraphImages =
    options.ogImages && options.ogImages.length > 0
      ? options.ogImages.map((img) => ({
          url: img.url,
          width: img.width ?? 1200,
          height: img.height ?? 630,
          alt: img.alt ?? options.title,
        }))
      : [{ url: options.ogImageUrl ?? DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: options.title }];
  const twitterImages = openGraphImages.map((img) => img.url);

  return {
    title: options.title,
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
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: twitterImages,
    },
  };
}
