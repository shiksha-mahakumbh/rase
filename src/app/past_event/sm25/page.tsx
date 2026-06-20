"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM25 from "@/components/past-editions/editions/sm25/SM25";
import { editionPageHero } from "@/data/past-editions";

export default function Sm25PastEventPage() {
  return (
    <PublicPageShell
      hero={editionPageHero("/past_event/sm25")}
      relatedPath="/past-events"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <SM25 />
    </PublicPageShell>
  );
}
