import { featuredSpeakers } from "@/data/authority-speakers";
import { SectionHeader, SpeakerCard } from "@/components/ui";

interface Props {
  className?: string;
}

export default function SpeakersSection({ className = "" }: Props) {
  return (
    <section aria-label="Featured speakers" className={`py-12 md:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Leadership"
          title="Featured Speakers & Chairs"
          description="Track chairs and convenors from the Academic Council network."
          align="center"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredSpeakers.map((speaker) => (
            <SpeakerCard
              key={speaker.name}
              name={speaker.name}
              role={`${speaker.title} · ${speaker.organization}${speaker.topic ? ` — ${speaker.topic}` : ""}`}
              imageSrc={speaker.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
