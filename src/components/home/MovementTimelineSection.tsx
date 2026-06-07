import Link from "next/link";
import { SectionHeader, TimelineCard } from "@/components/ui";
import { PAST_EDITIONS } from "@/data/past-editions";

const upcomingEdition = {
  year: "2026",
  title: "Shiksha Mahakumbh 6.0",
  location: "NIT Hamirpur",
  highlight: "Current edition — 9–11 October 2026. Register now.",
  active: true,
  href: "/registration",
};

export default function MovementTimelineSection() {
  const completed = PAST_EDITIONS.map((e) => ({
    year: e.year,
    title: e.title,
    location: e.venue,
    highlight: e.theme,
    href: e.href,
  }));

  return (
    <section aria-labelledby="timeline-heading" className="bg-brand-surface-warm py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our Journey"
          title="Major Editions Timeline"
          description="Five completed national editions and the continuing Shiksha Mahakumbh Abhiyan journey."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {completed.map((e) => (
            <Link key={e.title} href={e.href} className="block transition hover:opacity-95">
              <TimelineCard {...e} />
            </Link>
          ))}
          <Link href={upcomingEdition.href} className="block">
            <TimelineCard {...upcomingEdition} active />
          </Link>
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/pastevent"
            className="text-sm font-semibold text-brand-saffron hover:underline"
          >
            View full past editions archive →
          </Link>
        </p>
      </div>
    </section>
  );
}
