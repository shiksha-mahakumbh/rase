"use client";

import PublicPageShell from "@/components/layouts/PublicPageShell";
import UpcomingEvent from "../component/UpcomingEvent";
import { PAGE_HEROES } from "@/lib/page-heroes";

export default function UpcomingEventsPage() {
  return (
    <PublicPageShell hero={PAGE_HEROES.upcomingEvents} skipContainer>
      <UpcomingEvent />
    </PublicPageShell>
  );
}
