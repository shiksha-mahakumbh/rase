"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM23 from "@/components/past-editions/editions/sm23/SM23";
import { editionPageHero } from "@/data/past-editions";

export default function Sm23PastEventPage() {
  return (
    <PublicPageShell
      hero={editionPageHero("/past_event/sm23")}
      relatedPath="/past-events"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <SM23 />
    </PublicPageShell>
  );
}
