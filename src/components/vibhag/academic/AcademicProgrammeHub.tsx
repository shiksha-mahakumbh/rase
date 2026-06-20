"use client";

import {
  ACADEMIC_COUNCIL_EVENT,
  ACADEMIC_COUNCIL_STATS,
  ACADEMIC_PROGRAMME_HUB,
  type AcademicCouncilTabId,
  type ProgrammeHubSection,
} from "@/data/academic-council-content";

const accentStyles: Record<
  ProgrammeHubSection["accent"],
  { border: string; bg: string; icon: string; btn: string }
> = {
  navy: {
    border: "border-brand-navy/20",
    bg: "from-brand-navy/5 to-white",
    icon: "bg-brand-navy/10 text-brand-navy",
    btn: "bg-brand-navy text-white hover:bg-brand-navy-light",
  },
  saffron: {
    border: "border-brand-saffron/30",
    bg: "from-brand-surface-warm to-white",
    icon: "bg-brand-saffron/20 text-brand-navy",
    btn: "bg-brand-saffron text-brand-navy hover:bg-brand-saffron-dark hover:text-white",
  },
  emerald: {
    border: "border-emerald-200",
    bg: "from-emerald-50/80 to-white",
    icon: "bg-emerald-100 text-emerald-800",
    btn: "bg-emerald-700 text-white hover:bg-emerald-800",
  },
  sky: {
    border: "border-sky-200",
    bg: "from-sky-50/80 to-white",
    icon: "bg-sky-100 text-sky-800",
    btn: "bg-sky-700 text-white hover:bg-sky-800",
  },
  amber: {
    border: "border-amber-200",
    bg: "from-amber-50/80 to-white",
    icon: "bg-amber-100 text-amber-900",
    btn: "bg-amber-600 text-white hover:bg-amber-700",
  },
  rose: {
    border: "border-rose-200",
    bg: "from-rose-50/80 to-white",
    icon: "bg-rose-100 text-rose-800",
    btn: "bg-rose-700 text-white hover:bg-rose-800",
  },
  indigo: {
    border: "border-indigo-200",
    bg: "from-indigo-50/80 to-white",
    icon: "bg-indigo-100 text-indigo-800",
    btn: "bg-indigo-700 text-white hover:bg-indigo-800",
  },
  teal: {
    border: "border-teal-200",
    bg: "from-teal-50/80 to-white",
    icon: "bg-teal-100 text-teal-800",
    btn: "bg-teal-700 text-white hover:bg-teal-800",
  },
  violet: {
    border: "border-violet-200",
    bg: "from-violet-50/80 to-white",
    icon: "bg-violet-100 text-violet-800",
    btn: "bg-violet-700 text-white hover:bg-violet-800",
  },
};

interface AcademicProgrammeHubProps {
  onNavigate: (tabId: AcademicCouncilTabId) => void;
}

export default function AcademicProgrammeHub({ onNavigate }: AcademicProgrammeHubProps) {
  return (
    <section
      id="ac-programme-hub"
      className="px-4 py-8 md:px-8 md:py-10"
      aria-labelledby="ac-hub-heading"
    >
      <div className="mx-auto max-w-5xl">
        {/* Event banner */}
        <div className="overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-5 text-white shadow-xl md:rounded-3xl md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-saffron md:text-xs">
            Global Academic Platform · Viksit Bharat 2047
          </p>
          <h2 id="ac-hub-heading" className="mt-2 text-xl font-bold md:text-3xl">
            Academic Programmes at a Glance
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
            Explore conclaves, research tracks, olympiads, awards, exhibitions, cultural programmes,
            Bal Shodh Patrika, best practices, and student innovation — unified under the Academic
            Council.
          </p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                Dates
              </dt>
              <dd className="mt-1 text-sm font-bold md:text-base">9–11 October 2026</dd>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                Venue
              </dt>
              <dd className="mt-1 text-sm font-bold md:text-base">{ACADEMIC_COUNCIL_EVENT.venue}</dd>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm sm:col-span-1">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                Reach
              </dt>
              <dd className="mt-1 text-sm font-bold md:text-base">
                National &amp; International Delegates
              </dd>
            </div>
          </dl>
        </div>

        {/* Stats */}
        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {ACADEMIC_COUNCIL_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200/80 bg-white px-3 py-4 text-center shadow-sm"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                {stat.label}
              </dt>
              <dd className="mt-1 text-2xl font-bold text-brand-navy">{stat.value}</dd>
              <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">{stat.hint}</p>
            </div>
          ))}
        </dl>

        {/* Programme cards */}
        <div className="mt-8 space-y-6">
          {ACADEMIC_PROGRAMME_HUB.map((section) => {
            const styles = accentStyles[section.accent];
            return (
              <article
                key={section.id}
                className={`overflow-hidden rounded-2xl border bg-gradient-to-br shadow-sm ${styles.border} ${styles.bg}`}
              >
                <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between md:p-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${styles.icon}`}
                        aria-hidden
                      >
                        {section.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-500">{section.titleHi}</p>
                        <h3 className="text-lg font-bold text-brand-navy md:text-xl">
                          {section.titleEn}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate(section.tabId)}
                    className={`inline-flex min-h-[44px] shrink-0 items-center justify-center self-start rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron ${styles.btn}`}
                  >
                    Explore programme →
                  </button>
                </div>

                <ul className="grid gap-2 border-t border-slate-100/80 px-5 py-4 sm:grid-cols-2 md:px-6">
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="rounded-lg border border-white/60 bg-white/70 px-3 py-2.5 text-sm"
                    >
                      <p className="font-medium text-brand-navy">{item.titleEn}</p>
                      {item.titleHi ? (
                        <p className="mt-0.5 text-xs text-slate-500">{item.titleHi}</p>
                      ) : null}
                      {item.topics && item.topics.length > 0 ? (
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                          {item.topics.join(" · ")}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>

                {section.footerNote ? (
                  <p className="border-t border-slate-100/80 bg-white/50 px-5 py-3 text-xs font-medium text-indigo-800 md:px-6 md:text-sm">
                    {section.footerNote}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>

        {/* Contact strip */}
        <div className="mt-8 rounded-2xl border border-brand-navy/10 bg-brand-surface-warm px-5 py-4 text-center md:px-8">
          <p className="text-sm font-semibold text-brand-navy">Academic enquiries</p>
          <p className="mt-2 text-sm text-slate-600">
            <a
              href={`mailto:${ACADEMIC_COUNCIL_EVENT.contactEmail}`}
              className="font-medium text-brand-navy underline-offset-2 hover:underline"
            >
              {ACADEMIC_COUNCIL_EVENT.contactEmail}
            </a>
            {" · "}
            <a
              href={`https://wa.me/${ACADEMIC_COUNCIL_EVENT.contactPhone.replace(/\D/g, "")}`}
              className="font-medium text-brand-navy underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp {ACADEMIC_COUNCIL_EVENT.contactPhone}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
