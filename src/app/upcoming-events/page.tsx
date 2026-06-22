import UpcomingEventsShowcase from "@/components/upcoming-events/UpcomingEventsShowcase";
import UpcomingEventsJsonLd from "@/components/upcoming-events/UpcomingEventsJsonLd";
import PublicPageShell from "@/components/layouts/PublicPageShell";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Upcoming Events", path: "/upcoming-events" },
];

export default function UpcomingEventsPage() {
  return (
    <PublicPageShell
      showHero={false}
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
