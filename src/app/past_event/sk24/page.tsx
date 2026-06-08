"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/sk24/SK24";
import Organizer from "../../component/sk24/organizer";

const PAGE_HERO = {
  eyebrow: "Past Events",
  title: "Shiksha Kumbh 2024",
  subtitle: "Highlights and archives from the 2024 Kumbh edition.",
  accent: "saffron",
} as const;

export default function Sk24PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/past-events">
      <EventPage />
      <Organizer />
    </PublicPageShell>
  );
}
