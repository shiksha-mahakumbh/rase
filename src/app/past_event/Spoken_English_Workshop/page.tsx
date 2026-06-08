"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/Spoken_English_Workshop/Spoken_English_Workshop";

const PAGE_HERO = {
  eyebrow: "Workshops",
  title: "Spoken English Workshop",
  subtitle: "Professional development workshop archive.",
  accent: "emerald",
} as const;

export default function SpokenEnglishWorkshopPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/workshops">
      <EventPage />
    </PublicPageShell>
  );
}
