"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "@/components/past-editions/editions/sk24/SK24";
import { editionPageHero } from "@/data/past-editions";

export default function Sk24PastEventPage() {
  return (
    <PublicPageShell
      hero={editionPageHero("/past_event/sk24")}
      relatedPath="/past-events"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <EventPage />
    </PublicPageShell>
  );
}
