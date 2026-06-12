import Link from "next/link";
import { SectionHeader, SpeakerCard } from "@/components/ui";
import type { CmsSpeakerCard } from "@/lib/cms/types";

const FALLBACK_SPEAKERS = [
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

export default function SpeakerHighlightsSection({
  speakers = [],
}: {
  speakers?: CmsSpeakerCard[];
}) {
  const featured =
    speakers.length > 0
      ? (speakers.filter((s) => s.isFeatured).length >= 4
          ? speakers.filter((s) => s.isFeatured)
          : speakers
        ).slice(0, 4)
      : [];

  const cards =
    featured.length > 0
      ? featured.map((s) => ({
          key: s.id,
          name: s.fullName,
          role: s.designation ?? s.title ?? s.institution ?? "",
          imageSrc: s.photoUrl ?? undefined,
          href: s.href,
        }))
      : FALLBACK_SPEAKERS.map((s) => ({
          key: s.name,
          name: s.name,
          role: s.role,
          imageSrc: s.imageSrc,
          href: undefined as string | undefined,
        }));

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Leadership"
          title="Voices That Shape the Movement"
          description="Past editions have hosted national leaders, scholars, and reformers on one stage."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {cards.map((s) =>
            s.href ? (
              <Link key={s.key} href={s.href} className="transition hover:opacity-90">
                <SpeakerCard name={s.name} role={s.role} imageSrc={s.imageSrc} />
              </Link>
            ) : (
              <SpeakerCard key={s.key} name={s.name} role={s.role} imageSrc={s.imageSrc} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
