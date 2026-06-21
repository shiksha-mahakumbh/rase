import Link from "next/link";
import type { CommitteeEditionData } from "@/data/committee-members";
import { countCommitteeMembers } from "@/data/committee-members";

interface CommitteeEditionHeaderProps {
  edition: CommitteeEditionData;
}

export default function CommitteeEditionHeader({ edition }: CommitteeEditionHeaderProps) {
  const memberCount = countCommitteeMembers(edition);

  return (
    <header className="mb-10 overflow-hidden rounded-2xl border border-brand-saffron/20 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy text-white shadow-lg print:mb-4 print:rounded-none print:border-slate-300 print:shadow-none">
      <div className="p-5 md:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-saffron md:text-xs">
          Edition {edition.edition} · {edition.year}
        </p>
        <h1 className="mt-2 text-xl font-bold md:text-2xl">{edition.pageTitle}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
          {edition.theme}
        </p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Venue
            </dt>
            <dd className="mt-1 text-sm font-bold">{edition.venue}</dd>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Dates
            </dt>
            <dd className="mt-1 text-sm font-bold">{edition.dates}</dd>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Committee Members
            </dt>
            <dd className="mt-1 text-sm font-bold">{memberCount}+ leaders</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-3 print:hidden">
          <Link
            href={edition.eventHref}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-saffron px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-saffron-dark hover:text-white"
          >
            View Edition Details
          </Link>
          <Link
            href="/committees"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            All Editions
          </Link>
        </div>
      </div>
    </header>
  );
}
