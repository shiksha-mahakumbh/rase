"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM25 from "../../component/sm25/SM25";
import { getEditionByHref } from "@/data/past-editions";

const edition = getEditionByHref("/past_event/sm25")!;

const PAGE_HERO = {
  eyebrow: "शिक्षा महाकुंभ अभियान",
  title: edition.title,
  subtitle: `${edition.venue} · ${edition.dates} · ${edition.theme}`,
  accent: "navy",
} as const;

export default function Sm25PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/abhiyan">
      <SM25 />
    </PublicPageShell>
  );
}
