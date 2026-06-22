"use client";

import Link from "next/link";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  CONFERENCES_PAGE_HERO,
  CONFERENCES_PRIMARY_LINKS,
  CONFERENCES_STATS,
} from "@/data/conferences-hub";
import {
  CONFERENCE_YEAR_ARCHIVE,
  EVENT_HUB_ROUTES,
  WORKSHOP_ARCHIVE,
} from "@/lib/knowledge-graph/conference-catalog";
import { EventsListing } from "@/components/events/CmsEventView";
import type { CmsEventCard } from "@/lib/cms/types";

type Props = {
  cmsEvents?: CmsEventCard[];
};

export default function ConferencesShowcase({ cmsEvents = [] }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <HubGradientBanner
        id="conferences-banner"
        eyebrow={CONFERENCES_PAGE_HERO.eyebrow}
        title={CONFERENCES_PAGE_HERO.title}
        subtitle={CONFERENCES_PAGE_HERO.subtitle}
        stats={CONFERENCES_STATS}
      />

      <section className="mt-10" aria-labelledby="primary-programmes">
        <h2 id="primary-programmes" className="sr-only">
          Primary programmes
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONFERENCES_PRIMARY_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className={`h-1.5 bg-gradient-to-r ${item.accent}`} aria-hidden />
              <div className="p-5">
                <span className="font-bold text-brand-navy group-hover:text-brand-blue">{item.label}</span>
                <span className="mt-1 block text-xs text-slate-500">{item.hint}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {cmsEvents.length > 0 && (
        <section className="mt-10" aria-labelledby="cms-events">
          <h2 id="cms-events" className="text-lg font-bold text-brand-navy md:text-xl">
            Featured programmes
          </h2>
          <div className="mt-4">
            <EventsListing events={cmsEvents} />
          </div>
        </section>
      )}

      <section className="mt-10" aria-labelledby="event-routes">
        <h2 id="event-routes" className="text-lg font-bold text-brand-navy md:text-xl">
          Quick links
        </h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {EVENT_HUB_ROUTES.map((r) => (
            <li key={r.path}>
              <Link
                href={r.path}
                className="block rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-brand-navy transition hover:border-brand-saffron/30 hover:bg-white"
              >
                {r.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/conclave"
              className="block rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-brand-navy transition hover:border-brand-saffron/30 hover:bg-white"
            >
              Academic Conclave
            </Link>
          </li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="by-year">
        <h2 id="by-year" className="text-lg font-bold text-brand-navy md:text-xl">
          Editions by year
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {CONFERENCE_YEAR_ARCHIVE.map((edition) => (
            <div
              key={edition.year}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-bold text-brand-navy">
                {edition.year} — {edition.label}
              </h3>
              <ul className="mt-3 space-y-2">
                {edition.routes.map((r) => (
                  <li key={r.path}>
                    <Link
                      href={r.path}
                      className="text-sm text-brand-navy hover:text-brand-saffron hover:underline"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="workshops-list">
        <h2 id="workshops-list" className="text-lg font-bold text-brand-navy md:text-xl">
          Workshop archive
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {WORKSHOP_ARCHIVE.map((r) => (
            <Link
              key={r.path}
              href={r.path}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-md"
            >
              {r.label}
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10">
        <Link href="/proceedings" className="font-semibold text-brand-saffron hover:underline">
          View proceedings →
        </Link>
      </p>
    </div>
  );
}
