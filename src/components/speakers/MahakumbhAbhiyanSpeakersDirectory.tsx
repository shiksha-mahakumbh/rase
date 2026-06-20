"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS,
  totalAbhiyanSpeakerCount,
  type AbhiyanSpeaker,
} from "@/data/mahakumbh-abhiyan-speakers";
import {
  EDITION_DIRECTORY_ACCENTS,
  SPEAKERS_DIRECTORY_INTRO,
} from "@/data/speakers-directory-content";

function initials(name: string) {
  const trimmed = name.replace(/^[\s\d./]+/, "");
  return trimmed.charAt(0) || "?";
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
          {initials(speaker.name)}
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
      {/* Overview strip */}
      <section className="overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-surface-warm via-white to-brand-blue/5 p-5 shadow-sm md:p-6 print:hidden">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-saffron">
          {SPEAKERS_DIRECTORY_INTRO.headingHi}
        </p>
        <h2 className="mt-1 text-xl font-bold text-brand-navy md:text-2xl">
          {SPEAKERS_DIRECTORY_INTRO.heading}
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

      {/* Edition jump nav */}
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

      {/* Edition sections */}
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
            EDITION_DIRECTORY_ACCENTS[edition.edition] ??
            EDITION_DIRECTORY_ACCENTS["1.0"];
          const sectionId = `edition-${edition.edition.replace(".", "-")}`;

          return (
            <section
              key={edition.edition}
              id={sectionId}
              className={`scroll-mt-28 overflow-hidden rounded-2xl border ${accent.border} bg-white shadow-sm print:scroll-mt-0 print:rounded-none print:border-slate-300 print:shadow-none`}
            >
              <header className={`bg-gradient-to-r ${accent.header} px-4 py-4 sm:px-5`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-brand-navy">
                    Edition {edition.edition}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${accent.badge} bg-white/90`}
                  >
                    {edition.speakers.length} speakers
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-white md:text-xl">{edition.title}</h3>
                <p className="text-sm text-white/85">Shiksha Mahakumbh {edition.edition}</p>
              </header>

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

      {/* Footer links */}
      <p className="text-center text-sm text-slate-500 print:hidden">
        <Link href="/speakers" className="font-semibold text-brand-blue hover:text-brand-saffron">
          ← Featured speakers
        </Link>
        {" · "}
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
          header,
          footer,
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
