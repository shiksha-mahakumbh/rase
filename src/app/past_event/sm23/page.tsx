"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM23 from "../../component/sm23/SM23";
import { getEditionByHref } from "@/data/past-editions";

const edition = getEditionByHref("/past_event/sm23")!;

const PAGE_HERO = {
  eyebrow: "शिक्षा महाकुंभ अभियान",
  title: edition.title,
  subtitle: `${edition.venue} · ${edition.dates} · ${edition.theme}`,
  accent: "navy",
} as const;

export default function Sm23PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/abhiyan">
      <SM23 />
    </PublicPageShell>
  );
}
