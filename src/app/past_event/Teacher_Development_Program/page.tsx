"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "@/components/past-editions/editions/Teacher_Development_Program/Teacher_Development_Program";
import { brandWorkshopHero } from "@/lib/page-heroes";

export default function TeacherDevelopmentProgramPage() {
  return (
    <PublicPageShell
      hero={brandWorkshopHero(
        "Teacher Development Program",
        "Faculty development programme in collaboration with NITTTR — March 2024."
      )}
      relatedPath="/workshops"
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
    >
      <EventPage />
    </PublicPageShell>
  );
}
