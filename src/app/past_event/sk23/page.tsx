"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/sk23/SK23";

const PAGE_HERO = {
  eyebrow: "Past Events",
  title: "Shiksha Kumbh 2023",
  subtitle: "Highlights and archives from the 2023 Kumbh edition.",
  accent: "saffron",
} as const;

export default function Sk23PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/past-events">
      <EventPage />
    </PublicPageShell>
  );
}
