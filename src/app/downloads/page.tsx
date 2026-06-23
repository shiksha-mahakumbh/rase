import type { Metadata } from "next";
import { loadCmsDownloads, loadDefaultOgImage, loadRouteSeo } from "@/lib/cms/server";
import DownloadsShowcase from "@/components/downloads/DownloadsShowcase";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  DOWNLOADS_BREADCRUMBS,
  DOWNLOADS_HERO_IMAGE,
  DOWNLOADS_HERO_IMAGE_ALT,
  DOWNLOADS_OG_IMAGE,
  DOWNLOADS_PAGE_HERO,
  DOWNLOADS_SEO_KEYWORDS,
  downloadsMetaDescription,
} from "@/data/downloads-hub";

export const revalidate = 300;

const FALLBACK_META = {
  title: `${DOWNLOADS_PAGE_HERO.title} — Shiksha Mahakumbh Editions 1.0–6.0`,
  description: downloadsMetaDescription(),
  path: CANONICAL_ROUTES.downloads,
  keywords: [...DOWNLOADS_SEO_KEYWORDS],
  locale: "en_IN" as const,
  ogImageUrl: DOWNLOADS_OG_IMAGE,
};

export async function generateMetadata(): Promise<Metadata> {
  const [seo, ogImage] = await Promise.all([
    loadRouteSeo("downloads"),
    loadDefaultOgImage(),
  ]);

  if (seo) {
    return metadataFromCmsSeo(seo, {
      ...FALLBACK_META,
      ogImageUrl: ogImage ?? DOWNLOADS_OG_IMAGE,
    });
  }

  return createPageMetadata({
    ...FALLBACK_META,
    ogImageUrl: ogImage ?? DOWNLOADS_OG_IMAGE,
  });
}

export default async function DownloadsPage() {
  const downloads = await loadCmsDownloads();

  return (
    <PublicPageShell
      hero={{
        eyebrow: DOWNLOADS_PAGE_HERO.eyebrow,
        title: DOWNLOADS_PAGE_HERO.title,
        subtitle: DOWNLOADS_PAGE_HERO.subtitle,
        accent: "brand",
        imageSrc: DOWNLOADS_HERO_IMAGE,
        imageAlt: DOWNLOADS_HERO_IMAGE_ALT,
      }}
      showHero={false}
      showCta={false}
      breadcrumbs={[...DOWNLOADS_BREADCRUMBS]}
      relatedPath={CANONICAL_ROUTES.downloads}
      skipContainer
    >
      <DownloadsShowcase initialDownloads={downloads} />
    </PublicPageShell>
  );
}
