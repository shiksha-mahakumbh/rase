import BestWishesShowcase from "@/components/best-wishes/BestWishesShowcase";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  BEST_WISHES_BREADCRUMBS,
  BEST_WISHES_HERO_IMAGE,
  BEST_WISHES_HERO_IMAGE_ALT,
  BEST_WISHES_PAGE_HERO,
} from "@/data/best-wishes-hub";

export default function BestWishesPage() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: BEST_WISHES_PAGE_HERO.eyebrow,
        title: BEST_WISHES_PAGE_HERO.title,
        subtitle: BEST_WISHES_PAGE_HERO.subtitle,
        accent: "brand",
        imageSrc: BEST_WISHES_HERO_IMAGE,
        imageAlt: BEST_WISHES_HERO_IMAGE_ALT,
      }}
      showHero={false}
      showCta={false}
      breadcrumbs={[...BEST_WISHES_BREADCRUMBS]}
      relatedPath={CANONICAL_ROUTES.bestWishes}
      skipContainer
    >
      <BestWishesShowcase />
    </PublicPageShell>
  );
}
