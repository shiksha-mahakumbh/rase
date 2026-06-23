import BestWishesJsonLd from "@/components/best-wishes/BestWishesJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  BEST_WISHES_KEYWORDS,
  BEST_WISHES_OG_IMAGE,
  bestWishesMetaDescription,
  bestWishesPageTitle,
} from "@/data/best-wishes-hub";

export const metadata = createPageMetadata({
  title: bestWishesPageTitle(),
  description: bestWishesMetaDescription(),
  path: CANONICAL_ROUTES.bestWishes,
  keywords: [...BEST_WISHES_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: BEST_WISHES_OG_IMAGE,
});

export default function BestWishesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BestWishesJsonLd />
      {children}
    </>
  );
}
