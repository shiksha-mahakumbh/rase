import { SectionHeader, SpeakerCard } from "@/components/ui";

const speakers = [
  {
    name: "National Policymakers",
    role: "Cabinet ministers, governors, and education leaders at past editions",
    imageSrc: "/2023M/anurag_singh_thakur.JPG",
  },
  {
    name: "Academic Leadership",
    role: "INI directors, vice-chancellors, and research scholars",
    imageSrc: "/2024K/k7.png",
  },
  {
    name: "Spiritual & Cultural Guides",
    role: "Dignitaries inaugurating the Mahakumbh tradition",
    imageSrc: "/2024M/Press7.jpg",
  },
  {
    name: "Organising Secretaries",
    role: "Vidya Bharati, BSM, and national partner organisations",
    imageSrc: "/2023M/raghunandan.JPG",
  },
];

export default function SpeakerHighlightsSection() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Leadership"
          title="Voices That Shape the Movement"
          description="Past editions have hosted national leaders, scholars, and reformers on one stage."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {speakers.map((s) => (
            <SpeakerCard key={s.name} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
