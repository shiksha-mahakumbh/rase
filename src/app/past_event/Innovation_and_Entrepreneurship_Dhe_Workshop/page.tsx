"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/Innovation_and_Entrepreneurship_Dhe_Workshop/Innovation_and_Entrepreneurship_Dhe_Workshop";

const PAGE_HERO = {
  eyebrow: "Workshops",
  title: "Innovation & Entrepreneurship Workshop",
  subtitle: "DHE workshop on innovation and entrepreneurial skills.",
  accent: "emerald",
} as const;

export default function InnovationWorkshopPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/workshops">
      <EventPage />
    </PublicPageShell>
  );
}
