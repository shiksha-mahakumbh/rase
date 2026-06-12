import PublicPageShell from "@/components/layouts/PublicPageShell";
import UpcomingEvent from "../component/UpcomingEvent";
import { PAGE_HEROES } from "@/lib/page-heroes";
import { loadCmsEvents, mapCmsEventsToUpcoming } from "@/lib/cms/organizational";

export default async function UpcomingEventsPage() {
  const cmsEvents = await loadCmsEvents("en", true);
  const events = cmsEvents.length > 0 ? mapCmsEventsToUpcoming(cmsEvents) : undefined;

  return (
    <PublicPageShell hero={PAGE_HEROES.upcomingEvents} skipContainer>
      <UpcomingEvent events={events} />
    </PublicPageShell>
  );
}
