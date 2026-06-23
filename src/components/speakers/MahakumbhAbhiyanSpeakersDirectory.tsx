"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import {
  MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS,
  totalAbhiyanSpeakerCount,
  type AbhiyanSpeaker,
} from "@/data/mahakumbh-abhiyan-speakers";
import { getEditionByNumber } from "@/data/past-editions";
import {
  EDITION_DIRECTORY_ACCENTS,
  SPEAKERS_DIRECTORY_BREADCRUMBS,
  SPEAKERS_DIRECTORY_HERO_IMAGE,
  SPEAKERS_DIRECTORY_INTRO,
  SPEAKERS_DIRECTORY_QUICK_LINKS,
  SPEAKERS_DIRECTORY_UPCOMING_NOTE,
} from "@/data/speakers-directory-content";
import { committeePathForEdition } from "@/lib/committee/edition-slugs";

const HONORIFIC_PREFIXES = [
  "श्रीमती ",
  "श्री ",
  "डॉ. ",
  "डॉ ",
  "Prof. ",
  "Prof ",
  "कैप्टन ",
  "कर्नल ",
  "स्वामी ",
  "सरदार ",
  "लेफ्टिनेंट ",
  "अधिवक्ता ",
  "मेजर ",
  "प्रो. ",
  "प्रो ",
  "पूज्य ",
];

function stripHonorific(name: string) {
  for (const prefix of HONORIFIC_PREFIXES) {
    if (name.startsWith(prefix)) {
      return name.slice(prefix.length).trim();
    }
  }
  return name;
}

function personInitial(name: string) {
  const trimmed = stripHonorific(name).replace(/^[\s\d./]+/, "");
  return trimmed.charAt(0) || "?";
}

function editionImageSrc(edition: string) {
  return getEditionByNumber(edition)?.imageSrc ?? SPEAKERS_DIRECTORY_HERO_IMAGE;
}

function editionEventHref(edition: string) {
  return getEditionByNumber(edition)?.href ?? "/past-events";
}

function SpeakerCard({ speaker }: { speaker: AbhiyanSpeaker }) {
  const detail = [speaker.role, speaker.organization].filter(Boolean).join(" · ");
  return (
    <li className="break-inside-avoid">
      <article className="flex gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:border-brand-saffron/35 hover:shadow-md print:rounded-none print:border-slate-200 print:p-1 print:shadow-none">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-saffron/25 to-brand-blue/15 text-xs font-bold text-brand-navy print:hidden"
          aria-hidden
        >
          {personInitial(speaker.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-brand-navy print:text-[9px]">
            {speaker.name}
          </p>
          {detail ? (
            <p className="mt-0.5 text-xs leading-relaxed text-slate-600 print:text-[8px]">
              {detail}
            </p>
          ) : null}
        </div>
      </article>
    </li>
  );
}

export default function MahakumbhAbhiyanSpeakersDirectory() {
  const total = totalAbhiyanSpeakerCount();
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredEditions = useMemo(() => {
    if (!normalizedQuery) return MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS;
    return MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS.map((edition) => ({
      ...edition,
      speakers: edition.speakers.filter((s) => {
        const haystack = `${s.name} ${s.role} ${s.organization}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      }),
    })).filter((e) => e.speakers.length > 0);
  }, [normalizedQuery]);

  const visibleCount = filteredEditions.reduce((sum, e) => sum + e.speakers.length, 0);

  return (
    <div className="mahakumbh-speakers-directory space-y-8">
      <BreadcrumbNav
        items={SPEAKERS_DIRECTORY_BREADCRUMBS.map((item, index, arr) => ({
          label: item.name,
          href: index < arr.length - 1 ? item.path : undefined,
        }))}
        className="-mt-2 mb-2 print:hidden"
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 print:hidden">
        {SPEAKERS_DIRECTORY_QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
          >
            <span aria-hidden>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </section>

      <section
        aria-labelledby="speakers-overview-heading"
        className="overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-surface-warm via-white to-brand-blue/5 p-5 shadow-sm md:p-6 print:hidden"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-saffron">
          {SPEAKERS_DIRECTORY_INTRO.headingHi}
        </p>
        <h2 id="speakers-overview-heading" className="sr-only">
          Speaker directory overview
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
          {SPEAKERS_DIRECTORY_INTRO.description}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/80 bg-white/80 px-3 py-3 text-center shadow-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
              Total Speakers
            </dt>
            <dd className="mt-1 text-xl font-bold text-brand-navy">{total}</dd>
          </div>
          {MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS.map((e) => (
            <div
              key={e.edition}
              className="rounded-xl border border-white/80 bg-white/80 px-3 py-3 text-center shadow-sm"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                Edition {e.edition}
              </dt>
              <dd className="mt-1 text-xl font-bold text-brand-navy">{e.speakers.length}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="relative min-w-0 flex-1 sm:max-w-md">
            <span className="sr-only">Search speakers</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, role, or organization…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-brand-navy shadow-sm outline-none ring-brand-saffron/30 placeholder:text-slate-400 focus:border-brand-saffron/50 focus:ring-2"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-brand-navy"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : null}
          </label>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl border border-brand-saffron/40 bg-brand-saffron/10 px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-saffron/20"
          >
            Print / Save PDF
          </button>
        </div>
        {normalizedQuery ? (
          <p className="mt-3 text-sm text-slate-600">
            Showing <strong>{visibleCount}</strong> of {total} speakers
          </p>
        ) : null}
      </section>

      <section
        className="overflow-hidden rounded-2xl border border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 via-white to-brand-saffron/5 p-6 text-center md:p-8 print:hidden"
        aria-labelledby="speakers-upcoming-heading"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-saffron">
          Edition 6.0
        </p>
        <h2 id="speakers-upcoming-heading" className="mt-2 text-xl font-bold text-brand-navy md:text-2xl">
          {SPEAKERS_DIRECTORY_UPCOMING_NOTE.title}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
          {SPEAKERS_DIRECTORY_UPCOMING_NOTE.venue} · {SPEAKERS_DIRECTORY_UPCOMING_NOTE.dates}
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-brand-navy">
          {SPEAKERS_DIRECTORY_UPCOMING_NOTE.message}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href={SPEAKERS_DIRECTORY_UPCOMING_NOTE.committeeHref}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
          >
            SMK 6.0 committee
          </Link>
          <Link
            href={SPEAKERS_DIRECTORY_UPCOMING_NOTE.registrationHref}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-saffron px-6 py-2.5 text-sm font-bold text-brand-navy transition hover:bg-brand-saffron-dark hover:text-white"
          >
            Register for SMK 6.0
          </Link>
        </div>
      </section>

      <nav
        aria-label="Edition sections"
        className="sticky top-[4.5rem] z-20 -mx-1 overflow-x-auto rounded-xl border border-slate-200/80 bg-white/95 px-2 py-2 shadow-sm backdrop-blur-md print:hidden md:top-20"
      >
        <ul className="flex min-w-max gap-2 px-1">
          {MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS.map((e) => (
            <li key={e.edition}>
              <a
                href={`#edition-${e.edition.replace(".", "-")}`}
                className="inline-flex min-h-[36px] items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:bg-brand-saffron/15 sm:text-sm"
              >
                Edition {e.edition}
                <span className="ml-1.5 rounded-full bg-brand-navy/10 px-1.5 py-0.5 text-[10px]">
                  {e.speakers.length}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-8 print:space-y-4">
        {filteredEditions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            No speakers match your search.{" "}
            <button
              type="button"
              onClick={() => setQuery("")}
              className="font-semibold text-brand-blue hover:underline"
            >
              Clear search
            </button>
          </p>
        ) : null}

        {filteredEditions.map((edition) => {
          const accent =
            EDITION_DIRECTORY_ACCENTS[edition.edition] ?? EDITION_DIRECTORY_ACCENTS["1.0"];
          const sectionId = `edition-${edition.edition.replace(".", "-")}`;
          const headingId = `${sectionId}-heading`;
          const imageSrc = editionImageSrc(edition.edition);

          return (
            <section
              key={edition.edition}
              id={sectionId}
              aria-labelledby={headingId}
              className={`scroll-mt-28 overflow-hidden rounded-2xl border ${accent.border} bg-white shadow-sm print:scroll-mt-0 print:rounded-none print:border-slate-300 print:shadow-none`}
            >
              <div className="relative h-28 sm:h-32 print:hidden">
                <Image
                  src={imageSrc}
                  alt={`${edition.title} — edition ${edition.edition}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${accent.header} opacity-90`} />
              </div>
              <div
                className={`edition-section-banner bg-gradient-to-r ${accent.header} px-4 py-4 sm:px-5 print:bg-white print:px-2 print:py-2`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-brand-navy print:border print:border-slate-300">
                    Edition {edition.edition}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${accent.badge} bg-white/90 print:text-brand-navy`}
                  >
                    {edition.speakers.length} speakers
                  </span>
                </div>
                <h3
                  id={headingId}
                  className="mt-2 text-lg font-bold text-white md:text-xl print:text-base print:text-brand-navy"
                >
                  {edition.title}
                </h3>
                <p className="text-sm text-white/85 print:text-slate-600">
                  Shiksha Mahakumbh {edition.edition}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 print:hidden">
                  <Link
                    href={editionEventHref(edition.edition)}
                    className="text-xs font-semibold text-white underline-offset-2 hover:underline"
                  >
                    Edition page →
                  </Link>
                  <Link
                    href={committeePathForEdition(edition.edition)}
                    className="text-xs font-semibold text-white/90 underline-offset-2 hover:underline"
                  >
                    Organising committee →
                  </Link>
                </div>
              </div>

              <ul className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 print:grid-cols-4 print:gap-1 print:p-2">
                {edition.speakers.map((speaker) => (
                  <SpeakerCard
                    key={`${edition.edition}-${speaker.name}-${speaker.organization}`}
                    speaker={speaker}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="text-center text-sm text-slate-500 print:hidden">
        <Link href="/past-events" className="font-semibold text-brand-blue hover:text-brand-saffron">
          Past editions
        </Link>
        {" · "}
        <Link
          href="/abhiyaninphotoframe"
          className="font-semibold text-brand-blue hover:text-brand-saffron"
        >
          Abhiyan Photo Frame
        </Link>
        {" · "}
        <Link href="/committees" className="font-semibold text-brand-blue hover:text-brand-saffron">
          Organising committees
        </Link>
      </p>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          nav,
          footer,
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
