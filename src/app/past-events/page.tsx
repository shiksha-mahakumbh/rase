import PublicPageShell from "@/components/layouts/PublicPageShell";
import PastEditionsShowcase from "@/components/past-editions/PastEditionsShowcase";
import {
  PAST_EVENTS_BREADCRUMBS,
  PAST_EVENTS_HERO_IMAGE,
  PAST_EVENTS_HERO_IMAGE_ALT,
  PAST_EVENTS_PAGE_HERO,
} from "@/data/past-events-hub";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function PastEventsPage() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: PAST_EVENTS_PAGE_HERO.eyebrow,
        title: (
          <>
            <span className="text-brand-blue">{PAST_EVENTS_PAGE_HERO.titleLine}</span>
            <span className="mt-1 block text-2xl text-brand-saffron md:text-3xl">
              {PAST_EVENTS_PAGE_HERO.titleHindi}
            </span>
          </>
        ),
        subtitle: PAST_EVENTS_PAGE_HERO.subtitle,
        accent: "brand",
        imageSrc: PAST_EVENTS_HERO_IMAGE,
        imageAlt: PAST_EVENTS_HERO_IMAGE_ALT,
      }}
      breadcrumbs={[...PAST_EVENTS_BREADCRUMBS]}
      relatedPath={CANONICAL_ROUTES.pastEvents}
      skipContainer
      showCta
    >
      <PastEditionsShowcase />
    </PublicPageShell>
  );
}
