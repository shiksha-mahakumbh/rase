"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "@/components/past-editions/editions/sk23/SK23";
import { editionPageHero } from "@/data/past-editions";

export default function Sk23PastEventPage() {
  return (
    <PublicPageShell
      hero={editionPageHero("/past_event/sk23")}
      relatedPath="/past-events"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <EventPage />
    </PublicPageShell>
  );
}
