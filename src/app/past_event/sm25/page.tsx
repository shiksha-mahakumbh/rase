"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM25 from "../../component/sm25/SM25";

const PAGE_HERO = {
  eyebrow: "Past Events",
  title: "Shiksha Mahakumbh 2025",
  subtitle: "Highlights and archives from the 2025 edition.",
  accent: "navy",
} as const;

export default function Sm25PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/past-events">
      <SM25 />
    </PublicPageShell>
  );
}
