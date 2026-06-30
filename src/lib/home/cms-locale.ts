import type { ContentLocale } from "@prisma/client";

/** Hindi routes prefer hi CMS content; falls back to English when hi homepage is not published. */
export function cmsLocaleForRoute(locale: string): ContentLocale {
  if (locale === "hi") return "hi";
  return "en";
}
