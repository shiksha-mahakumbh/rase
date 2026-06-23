import { createPageMetadata } from "@/lib/seo/metadata";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { PRESS_HUB_OG_IMAGE, PRESS_PAGE_HERO, PRESS_SEO_KEYWORDS } from "@/data/press-hub";

export const metadata = createPageMetadata({
  title: "Press Releases — Shiksha Mahakumbh Abhiyan | National & Global Coverage",
  description: PRESS_PAGE_HERO.subtitle,
  path: CANONICAL_ROUTES.press,
  keywords: [...PRESS_SEO_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: PRESS_HUB_OG_IMAGE,
});

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
