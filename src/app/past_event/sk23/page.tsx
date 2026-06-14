"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import EventPage from "../../component/sk23/SK23";
import { getEditionByHref } from "@/data/past-editions";

const edition = getEditionByHref("/past_event/sk23")!;

const PAGE_HERO = {
  eyebrow: "शिक्षा महाकुंभ अभियान",
  title: edition.title,
  subtitle: `${edition.venue} · ${edition.dates} · ${edition.theme}`,
  accent: "saffron",
} as const;

export default function Sk23PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/abhiyan">
      <EventPage />
    </PublicPageShell>
  );
}
