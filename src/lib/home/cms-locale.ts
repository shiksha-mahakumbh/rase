import type { ContentLocale } from "@prisma/client";

/** Hindi (and other locale) home routes use English CMS data until full hi CMS content exists. */
export function cmsLocaleForRoute(_locale: string): ContentLocale {
  return "en";
}
