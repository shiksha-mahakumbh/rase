"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/Teacher_Development_Program/Teacher_Development_Program";

const PAGE_HERO = {
  eyebrow: "Workshops",
  title: "Teacher Development Program",
  subtitle: "Faculty development programme archive.",
  accent: "emerald",
} as const;

export default function TeacherDevelopmentProgramPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/workshops">
      <EventPage />
    </PublicPageShell>
  );
}
