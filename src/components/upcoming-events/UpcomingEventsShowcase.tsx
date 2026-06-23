"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  SMK_6_RESOURCE_LINKS,
  UPCOMING_EVENTS,
  UPCOMING_EVENTS_CTA,
  UPCOMING_EVENTS_PAGE_HERO,
  UPCOMING_EVENTS_STATS,
} from "@/data/upcoming-events-hub";

export default function UpcomingEventsShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <HubGradientBanner
        id="upcoming-events-banner"
        titleAs="h1"
        eyebrow={UPCOMING_EVENTS_PAGE_HERO.eyebrow}
        title={UPCOMING_EVENTS_PAGE_HERO.title}
        subtitle={UPCOMING_EVENTS_PAGE_HERO.subtitle}
        stats={UPCOMING_EVENTS_STATS}
      />

      <section className="mt-10" aria-labelledby="upcoming-events-grid">
        <h2 id="upcoming-events-grid" className="mb-5 text-lg font-bold text-brand-navy md:text-xl">
          Upcoming programme cards
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {UPCOMING_EVENTS.map((event, index) => {
            const isOpen = event.status === "registration_open";
            return (
              <motion.article
                key={event.id}
                id={event.id}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
                className={`group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                  isOpen
                    ? "border-brand-saffron/40 ring-1 ring-brand-saffron/20"
                    : "border-slate-200 hover:border-brand-navy/20"
                }`}
              >
                <div
                  className={`h-1.5 w-full ${
                    isOpen
                      ? "bg-gradient-to-r from-brand-saffron via-amber-400 to-brand-navy"
                      : "bg-gradient-to-r from-brand-navy/70 to-slate-400"
                  }`}
                  aria-hidden
                />
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        isOpen
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isOpen ? "Registration Open" : "Upcoming"}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-saffron-dark">
                      Edition {event.edition}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy md:text-xl">{event.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {event.description}
                  </p>
                  <dl className="mt-4 space-y-2 rounded-xl bg-slate-50 px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <dt className="min-w-[52px] font-semibold text-brand-navy">Dates</dt>
                      <dd className="text-slate-700">{event.dates}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="min-w-[52px] font-semibold text-brand-navy">Venue</dt>
                      <dd className="text-slate-700">{event.venue}</dd>
                    </div>
                    {event.highlight && (
                      <div className="flex gap-2 border-t border-slate-200 pt-2">
                        <dt className="min-w-[52px] font-semibold text-brand-navy">Note</dt>
                        <dd className="text-slate-600">{event.highlight}</dd>
                      </div>
                    )}
                  </dl>

                  {isOpen && (
                    <nav
                      aria-label={`${event.title} resources`}
                      className="mt-4 flex flex-wrap gap-2"
                    >
                      {SMK_6_RESOURCE_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:bg-brand-surface"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  )}

                  <Link
                    href={event.registrationHref}
                    className={`mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      isOpen
                        ? "bg-gradient-to-r from-brand-navy to-[#7a4343] text-white focus-visible:outline-brand-saffron"
                        : "border-2 border-brand-navy/20 bg-white text-brand-navy hover:border-brand-navy/40 focus-visible:outline-brand-navy"
                    }`}
                  >
                    {event.ctaLabel}
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section
        className="mt-10 rounded-2xl border border-brand-navy/10 bg-gradient-to-r from-slate-50 to-amber-50/50 p-6 md:p-8"
        aria-labelledby="global-reach-cta"
      >
        <h2 id="global-reach-cta" className="text-lg font-bold text-brand-navy md:text-xl">
          Join a National Movement with Global Reach
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
          Shiksha Mahakumbh Abhiyan brings together policymakers, IITs, NITs, universities, and
          international delegates. Edition 6.0 welcomes participants from India and abroad — secure
          your place at NIT Hamirpur today.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={UPCOMING_EVENTS_CTA.registerHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-saffron px-6 py-3 text-sm font-bold text-brand-navy shadow-md transition hover:bg-brand-saffron-dark hover:text-white"
          >
            {UPCOMING_EVENTS_CTA.registerLabel}
          </Link>
          <Link
            href={UPCOMING_EVENTS_CTA.pastEditionsHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-brand-navy/20 bg-white px-6 py-3 text-sm font-bold text-brand-navy transition hover:border-brand-saffron"
          >
            {UPCOMING_EVENTS_CTA.pastEditionsLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
