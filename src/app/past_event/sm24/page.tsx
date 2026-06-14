"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM24 from "../../component/sm24/SM24";
import { getEditionByHref } from "@/data/past-editions";

const edition = getEditionByHref("/past_event/sm24")!;

const PAGE_HERO = {
  eyebrow: "शिक्षा महाकुंभ अभियान",
  title: edition.title,
  subtitle: `${edition.venue} · ${edition.dates} · ${edition.theme}`,
  accent: "navy",
} as const;

export default function Sm24PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/abhiyan">
      <SM24 />
    </PublicPageShell>
  );
}
