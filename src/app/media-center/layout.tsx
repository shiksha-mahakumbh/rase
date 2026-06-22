import { createPageMetadata } from "@/lib/seo/metadata";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { MEDIA_CENTER_SEO_KEYWORDS, MEDIA_CENTER_PAGE_HERO } from "@/data/media-center-hub";

export const metadata = createPageMetadata({
  title: "Media Centre — Press, Archives & Global Coverage | Shiksha Mahakumbh",
  description: MEDIA_CENTER_PAGE_HERO.subtitle,
  path: CANONICAL_ROUTES.mediaCenter,
  keywords: [...MEDIA_CENTER_SEO_KEYWORDS],
  locale: "en_IN",
});

export default function MediaCenterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
