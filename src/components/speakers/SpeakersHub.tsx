import Image from "next/image";
import Link from "next/link";
import { SectionHeader, SpeakerCard } from "@/components/ui";
import type { CmsSpeakerCard } from "@/lib/cms/types";

const FALLBACK_SPEAKERS = [
  {
    fullName: "National Policymakers",
    designation: "Cabinet ministers, governors, and education leaders at past editions",
    photoUrl: "/2023M/anurag_singh_thakur.JPG",
    slug: "",
    href: "/speakers",
  },
  {
    fullName: "Academic Leadership",
    designation: "INI directors, vice-chancellors, and research scholars",
    photoUrl: "/2024K/k7.png",
    slug: "",
    href: "/speakers",
  },
  {
    fullName: "Spiritual & Cultural Guides",
    designation: "Dignitaries inaugurating the Mahakumbh tradition",
    photoUrl: "/2024M/Press7.jpg",
    slug: "",
    href: "/speakers",
  },
  {
    fullName: "Organising Secretaries",
    designation: "Vidya Bharati, BSM, and national partner organisations",
    photoUrl: "/2023M/raghunandan.JPG",
    slug: "",
    href: "/speakers",
  },
];

export default function SpeakersHub({ speakers = [] }: { speakers?: CmsSpeakerCard[] }) {
  const cards =
    speakers.length > 0
      ? speakers
      : FALLBACK_SPEAKERS.map((s, i) => ({
          id: `fallback-${i}`,
          fullName: s.fullName,
          slug: s.slug,
          title: null,
          designation: s.designation,
          institution: null,
          photoUrl: s.photoUrl,
          isFeatured: false,
          href: s.href,
        }));

  return (
    <div>
      <SectionHeader
        eyebrow="Leadership"
        title="Speakers & Dignitaries"
        description="National leaders, scholars, and reformers who have shaped the Shiksha Mahakumbh movement."
      />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
        {cards.map((speaker) => {
          const role =
            [speaker.designation, speaker.institution].filter(Boolean).join(" — ") ||
            speaker.title ||
            "";
          const card = (
            <SpeakerCard
              name={speaker.fullName}
              role={role}
              imageSrc={speaker.photoUrl ?? undefined}
            />
          );

          if (!speaker.slug) {
            return <div key={speaker.id}>{card}</div>;
          }

          return (
            <Link key={speaker.id} href={speaker.href} className="transition hover:opacity-90">
              {card}
            </Link>
          );
        })}
      </div>
      {speakers.length > 0 && (
        <p className="mt-8 text-center text-sm text-slate-500">
          Tap a speaker to view their profile.
        </p>
      )}
    </div>
  );
}

export function SpeakerHighlightsGrid({ speakers = [] }: { speakers?: CmsSpeakerCard[] }) {
  const featured = speakers.filter((s) => s.isFeatured).slice(0, 4);
  const display = featured.length >= 4 ? featured : speakers.slice(0, 4);
  if (display.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {display.map((s) => (
        <Link key={s.id} href={s.href} className="transition hover:opacity-90">
          <SpeakerCard
            name={s.fullName}
            role={s.designation ?? s.title ?? s.institution ?? ""}
            imageSrc={s.photoUrl ?? undefined}
          />
        </Link>
      ))}
    </div>
  );
}
