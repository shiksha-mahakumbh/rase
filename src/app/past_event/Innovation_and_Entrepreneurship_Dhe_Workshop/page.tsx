"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "@/components/past-editions/editions/Innovation_and_Entrepreneurship_Dhe_Workshop/Innovation_and_Entrepreneurship_Dhe_Workshop";
import { brandWorkshopHero } from "@/lib/page-heroes";

export default function InnovationWorkshopPage() {
  return (
    <PublicPageShell
      hero={brandWorkshopHero(
        "Innovation & Entrepreneurship Workshop",
        "DHE workshop on innovation and entrepreneurial skills for students, teachers, and ATL coordinators."
      )}
      relatedPath="/workshops"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <EventPage />
    </PublicPageShell>
  );
}
