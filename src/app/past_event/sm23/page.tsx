"use client";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SM23 from "../../component/sm23/SM23";

const PAGE_HERO = {
  eyebrow: "Past Events",
  title: "Shiksha Mahakumbh 2023",
  subtitle: "Highlights and archives from the 2023 edition.",
  accent: "navy",
} as const;

export default function Sm23PastEventPage() {
  return (
    <PublicPageShell hero={PAGE_HERO} relatedPath="/past-events">
      <SM23 />
    </PublicPageShell>
  );
}
