"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "@/components/past-editions/editions/Spoken_English_Workshop/Spoken_English_Workshop";
import { brandWorkshopHero } from "@/lib/page-heroes";

export default function SpokenEnglishWorkshopPage() {
  return (
    <PublicPageShell
      hero={brandWorkshopHero(
        "Spoken English Workshop",
        "Professional development workshop for educators — January 2024."
      )}
      relatedPath="/workshops"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <EventPage />
    </PublicPageShell>
  );
}
