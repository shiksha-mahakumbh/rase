"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM24 from "../../component/sm24/SM24";

const PAGE_HERO = {
  eyebrow: "Past Events",
  title: "Shiksha Mahakumbh 2024",
  subtitle: "Highlights and archives from the 2024 edition.",
  accent: "navy",
} as const;

export default function Sm24PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/past-events">
      <SM24 />
    </PublicPageShell>
  );
}
