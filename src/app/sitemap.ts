import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { PRESS_CANONICAL_PATHS } from "@/constants/canonical-routes";
import { MEDIA_ARCHIVE_KEYS } from "@/data/media-archive-keys";
import { COMMITTEE_LEGACY_SLUGS } from "@/lib/committee/legacy-registry";
import { committeePathFromSlug } from "@/lib/committee/edition-slugs";
import { SITEMAP_CORE_PATHS } from "@/lib/knowledge-graph/site-cleanup";
import { generateSitemapIndex } from "@/server/services/seo.service";
import { prisma } from "@/server/db/prisma";

const COMMITTEE_PATHS = COMMITTEE_LEGACY_SLUGS.map((slug) =>
  committeePathFromSlug(slug).replace(/^\//, "")
);

const MEDIA_ARCHIVE_PATHS = MEDIA_ARCHIVE_KEYS.map((key) => {
  const [edition, year, type] = key.split("/");
  return `media/${edition}/${year}/${type}`;
});

const PRESS_ARTICLE_PATHS = Object.values(PRESS_CANONICAL_PATHS).map((p) =>
  p.replace(/^\//, "")
);

/** Hindi locale pages with translated UI (body may mirror English). */
const HI_SITEMAP_PATHS = ["hi", "hi/introduction", "hi/registration", "hi/contact-us"] as const;

const SITEMAP_PATHS = Array.from(
  new Set([
    ...SITEMAP_CORE_PATHS,
    "faq",
    ...HI_SITEMAP_PATHS,
    ...COMMITTEE_PATHS,
    ...MEDIA_ARCHIVE_PATHS,
    ...PRESS_ARTICLE_PATHS,
  ])
).filter((path) => !path.includes("#"));

function sitemapPriority(path: string): number {
  if (path === "") return 1;
  if (path === "registration") return 0.9;
  if (path === "faq") return 0.75;
  if (path === "downloads" || path === "noticeboard") return 0.8;
  if (path.startsWith("departments/")) return 0.7;
  if (path.startsWith("committee/")) return 0.5;
  if (path.startsWith("press/")) return 0.4;
  if (path.startsWith("media/") && path.split("/").length > 2) return 0.4;
  return 0.6;
}

async function cmsLastModifiedBySlug(): Promise<Map<string, Date>> {
  const pages = await prisma.page.findMany({
    where: { status: "published", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });
  const map = new Map<string, Date>();
  for (const page of pages) {
    map.set(page.slug, page.updatedAt);
  }
  return map;
}

function resolveLastModified(path: string, cmsDates: Map<string, Date>, fallback: Date): Date {
  const slug = path.replace(/^hi\//, "").split("/")[0] ?? path;
  return cmsDates.get(slug) ?? cmsDates.get(path) ?? fallback;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fallbackDate = new Date();
  let cmsDates = new Map<string, Date>();
  try {
    cmsDates = await cmsLastModifiedBySlug();
  } catch {
    // DB unavailable — static dates only
  }

  const staticEntries: MetadataRoute.Sitemap = SITEMAP_PATHS.map((path) => ({
    url: path ? `${SITE_URL}/${path}` : SITE_URL,
    lastModified: resolveLastModified(path, cmsDates, fallbackDate),
    changeFrequency:
      path === "" || path === "registration" || path === "noticeboard" || path === "downloads"
        ? "weekly"
        : "monthly",
    priority: sitemapPriority(path),
  }));

  try {
    const cmsEntries = await generateSitemapIndex();
    const cmsMapped: MetadataRoute.Sitemap = cmsEntries
      .filter((e) => !e.url.includes("#"))
      .map((e) => ({
        url: e.url,
        lastModified: e.lastModified,
        changeFrequency: e.changeFrequency,
        priority: e.priority,
      }));

    const seen = new Set(staticEntries.map((e) => e.url));
    return [...staticEntries, ...cmsMapped.filter((e) => !seen.has(e.url))];
  } catch {
    return staticEntries;
  }
}
