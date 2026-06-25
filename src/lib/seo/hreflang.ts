import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";

/** Routes with both English and Hindi equivalents */
export const HREFLANG_PAIRS: Record<string, { en: string; hi: string }> = {
  "/": { en: "/", hi: "/hi" },
  "/introduction": { en: "/introduction", hi: "/hi/introduction" },
  "/registration": { en: "/registration", hi: "/hi/registration" },
  "/contact-us": { en: "/contact-us", hi: "/hi/contact-us" },
};

export function buildHreflangLanguages(paths: { en: string; hi?: string }): Record<string, string> {
  const languages: Record<string, string> = {
    "en-IN": `${SITE_URL}${paths.en}`,
    "x-default": `${SITE_URL}${paths.en}`,
  };
  if (paths.hi) {
    languages["hi-IN"] = `${SITE_URL}${paths.hi}`;
  }
  return languages;
}

export function hreflangForPath(path: string): Record<string, string> | undefined {
  const pair = HREFLANG_PAIRS[path];
  if (!pair) return undefined;
  return buildHreflangLanguages(pair);
}

export function withHreflang(metadata: Metadata, path: string): Metadata {
  const languages = hreflangForPath(path);
  if (!languages) return metadata;

  return {
    ...metadata,
    alternates: {
      canonical: metadata.alternates?.canonical,
      languages,
    },
  };
}
