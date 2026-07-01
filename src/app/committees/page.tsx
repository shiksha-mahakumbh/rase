import PublicPageShell from "@/components/layouts/PublicPageShell";
import { CommitteesShowcase } from "@/lib/perf/deferred-showcases";
import AdSlotRegion from "@/components/showcase/AdSlotRegion";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  COMMITTEES_BREADCRUMBS,
  COMMITTEES_HERO_IMAGE,
  COMMITTEES_HERO_IMAGE_ALT,
  COMMITTEES_PAGE_HERO,
} from "@/data/committee-hub";

export default function CommitteesPage() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: COMMITTEES_PAGE_HERO.eyebrow,
        title: COMMITTEES_PAGE_HERO.title,
        subtitle: COMMITTEES_PAGE_HERO.subtitle,
        accent: "brand",
        imageSrc: COMMITTEES_HERO_IMAGE,
        imageAlt: COMMITTEES_HERO_IMAGE_ALT,
      }}
      breadcrumbs={[...COMMITTEES_BREADCRUMBS]}
      relatedPath={CANONICAL_ROUTES.committees}
      containerClassName="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14"
    >
      <CommitteesShowcase />
      <AdSlotRegion label="Partner showcase" className="mt-12" />
    </PublicPageShell>
  );
}
