"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM24 from "@/components/past-editions/editions/sm24/SM24";
import { editionPageHero } from "@/data/past-editions";

export default function Sm24PastEventPage() {
  return (
    <PublicPageShell
      hero={editionPageHero("/past_event/sm24")}
      relatedPath="/past-events"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <SM24 />
    </PublicPageShell>
  );
}
