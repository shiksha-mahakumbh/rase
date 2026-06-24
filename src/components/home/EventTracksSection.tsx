import { EventCard, SectionHeader } from "@/components/ui";
import type { EventTracksContent } from "@/lib/home/build-home-sections";

export default function EventTracksSection({ content }: { content: EventTracksContent }) {
  const { eyebrow, title, description, tracks } = content;

  return (
    <section id="tracks" className="bg-brand-surface py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t) => (
            <EventCard key={t.title} {...t} ctaLabel="Explore" />
          ))}
        </div>
      </div>
    </section>
  );
}
