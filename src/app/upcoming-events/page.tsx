import UpcomingEventsQuickLinks from "@/components/upcoming-events/UpcomingEventsQuickLinks";
import UpcomingEventsShowcase from "@/components/upcoming-events/UpcomingEventsShowcase";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import {
  UPCOMING_EVENTS_BREADCRUMBS,
  UPCOMING_EVENTS_PATH,
} from "@/data/upcoming-events-hub";

export default function UpcomingEventsPage() {
  return (
    <PublicPageShell
      showHero={false}
      showCta={false}
      breadcrumbs={[...UPCOMING_EVENTS_BREADCRUMBS]}
      relatedPath={UPCOMING_EVENTS_PATH}
      skipContainer
    >
      <UpcomingEventsQuickLinks />
      <UpcomingEventsShowcase />
    </PublicPageShell>
  );
}
