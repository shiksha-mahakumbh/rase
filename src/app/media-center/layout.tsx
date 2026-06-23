import { createPageMetadata } from "@/lib/seo/metadata";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { MEDIA_CENTER_OG_IMAGE, MEDIA_CENTER_PAGE_HERO, MEDIA_CENTER_SEO_KEYWORDS } from "@/data/media-center-hub";

export const metadata = createPageMetadata({
  title: `${MEDIA_CENTER_PAGE_HERO.title} — Press, Archives & Global Coverage`,
  description: MEDIA_CENTER_PAGE_HERO.subtitle,
  path: CANONICAL_ROUTES.mediaCenter,
  keywords: [...MEDIA_CENTER_SEO_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: MEDIA_CENTER_OG_IMAGE,
});

export default function MediaCenterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
