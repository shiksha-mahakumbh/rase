import DownloadsJsonLd from "@/components/downloads/DownloadsJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  DOWNLOADS_OG_IMAGE,
  DOWNLOADS_PAGE_HERO,
  DOWNLOADS_SEO_KEYWORDS,
  downloadsMetaDescription,
} from "@/data/downloads-hub";

export const metadata = createPageMetadata({
  title: `${DOWNLOADS_PAGE_HERO.title} — Shiksha Mahakumbh Editions 1.0–6.0`,
  description: downloadsMetaDescription(),
  path: CANONICAL_ROUTES.downloads,
  keywords: [...DOWNLOADS_SEO_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: DOWNLOADS_OG_IMAGE,
});

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DownloadsJsonLd />
      {children}
    </>
  );
}
