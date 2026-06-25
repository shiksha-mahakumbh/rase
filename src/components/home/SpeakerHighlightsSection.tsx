"use client";

import Link from "next/link";
import { SectionHeader, SpeakerCard } from "@/components/ui";
import { FEATURED_HOME_SPEAKERS } from "@/data/mahakumbh-abhiyan-speakers";
import type { CmsSpeakerCard } from "@/lib/cms/types";

function formatCmsRole(s: CmsSpeakerCard): string {
  return [s.designation, s.institution].filter(Boolean).join(" · ") || s.title || "";
}

export default function SpeakerHighlightsSection({
  speakers = [],
}: {
  speakers?: CmsSpeakerCard[];
}) {
  const cmsCards = speakers
    .filter((s) => s.fullName && s.fullName.length > 2)
    .slice(0, 8)
    .map((s) => ({
      key: s.id,
      name: s.fullName,
      role: formatCmsRole(s),
      imageSrc: s.photoUrl ?? undefined,
      href: s.slug ? s.href : undefined,
    }));

  const staticCards = FEATURED_HOME_SPEAKERS.map((s) => ({
    key: s.name,
    name: s.name,
    role: s.role,
    imageSrc: s.imageSrc,
    href: undefined as string | undefined,
  }));

  const cards = cmsCards.length >= 4 ? cmsCards.slice(0, 8) : staticCards.slice(0, 8);

  return (
    <section
      id="speakers"
      className="bg-gradient-to-b from-white to-brand-surface-warm py-12 md:py-16"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
        <p className="mt-8 text-center">
          <Link
            href="/speakers/directory"
            className="text-sm font-semibold text-brand-navy hover:text-brand-saffron hover:underline"
          >
            View speaker directory (editions 1.0–5.0)
          </Link>
          <span className="mt-1 block text-xs text-slate-500">
            पूर्ण वक्ता सूची — संस्करण 1.0–5.0
          </span>
        </p>
      </div>
    </section>
  );
}
