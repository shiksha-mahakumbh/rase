"use client";

import {
  ACADEMIC_COUNCIL_EVENT,
  ACADEMIC_COUNCIL_HERO,
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
    border: "border-brand-navy/15",
    bg: "from-brand-navy/[0.04] to-white",
    icon: "bg-brand-navy/10 text-brand-navy",
    btn: "bg-brand-navy text-white hover:bg-brand-navy-light",
  },
  saffron: {
    border: "border-brand-saffron/25",
    bg: "from-brand-surface-warm to-white",
    icon: "bg-brand-saffron/20 text-brand-navy",
    btn: "bg-brand-saffron text-brand-navy hover:bg-brand-saffron-dark hover:text-white",
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
        <section
          aria-labelledby="ac-hub-heading"
          className="overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-5 text-white shadow-xl md:rounded-3xl md:p-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-saffron md:text-xs">
            Global Academic Platform · Viksit Bharat 2047
          </p>
          <h2 id="ac-hub-heading" className="sr-only">
            Programme summary
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
            {ACADEMIC_COUNCIL_HERO.tagline}
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
            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                Reach
              </dt>
              <dd className="mt-1 text-sm font-bold md:text-base">
                National &amp; International Delegates
              </dd>
            </div>
          </dl>
        </section>

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

        <div className="mt-8 space-y-5">
          {ACADEMIC_PROGRAMME_HUB.map((section) => {
            const styles = accentStyles[section.accent];
            const hasManyItems = section.items.length > 4;
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

                <ul
                  className={`grid gap-2 border-t border-slate-100/80 px-5 py-4 md:px-6 ${
                    hasManyItems
                      ? "sm:grid-cols-2"
                      : "sm:grid-cols-2"
                  }`}
                >
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="rounded-lg border border-white/80 bg-white/80 px-3 py-2.5 text-sm"
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
                  <p className="border-t border-slate-100/80 bg-brand-navy/[0.03] px-5 py-3 text-xs font-medium text-brand-navy md:px-6 md:text-sm">
                    {section.footerNote}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>

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
