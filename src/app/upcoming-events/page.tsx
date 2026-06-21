import UpcomingEventsShowcase from "@/components/upcoming-events/UpcomingEventsShowcase";
import UpcomingEventsJsonLd from "@/components/upcoming-events/UpcomingEventsJsonLd";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { UPCOMING_EVENTS_PAGE_HERO } from "@/data/upcoming-events-hub";
import { brandPageHero } from "@/lib/page-heroes";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Upcoming Events", path: "/upcoming-events" },
];

export default function UpcomingEventsPage() {
  return (
    <PublicPageShell
      hero={brandPageHero(
        UPCOMING_EVENTS_PAGE_HERO.title,
        UPCOMING_EVENTS_PAGE_HERO.subtitle,
        UPCOMING_EVENTS_PAGE_HERO.eyebrow
      )}
      showCta={false}
      breadcrumbs={BREADCRUMBS}
      relatedPath="/upcoming-events"
      skipContainer
    >
      <UpcomingEventsJsonLd />
      <UpcomingEventsShowcase />
    </PublicPageShell>
  );
}
