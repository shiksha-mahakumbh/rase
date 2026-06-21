"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  UPCOMING_EVENTS,
  UPCOMING_EVENTS_HERO,
  UPCOMING_EVENTS_STATS,
} from "@/data/upcoming-events-hub";

export default function UpcomingEventsShowcase() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      {/* Banner */}
      <section
        aria-labelledby="upcoming-events-banner"
        className="relative overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-5 text-white shadow-xl md:rounded-3xl md:p-8"
      >
        <div
          className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-brand-saffron/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-saffron md:text-xs">
          {UPCOMING_EVENTS_HERO.eyebrow}
        </p>
        <h2 id="upcoming-events-banner" className="mt-2 text-xl font-bold md:text-3xl">
          {UPCOMING_EVENTS_HERO.title}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
          Register for <strong className="text-brand-saffron">Shiksha Mahakumbh 6.0</strong> at NIT
          Hamirpur (9–11 October 2026). Edition 7.0 at IIT Jammu — dates to be announced.
        </p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {UPCOMING_EVENTS_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                {stat.label}
              </dt>
              <dd className="mt-1 text-lg font-bold text-brand-saffron md:text-xl">{stat.value}</dd>
              <dd className="text-[11px] text-white/75">{stat.hint}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Event cards */}
      <section className="mt-10" aria-labelledby="upcoming-events-grid">
        <h2 id="upcoming-events-grid" className="sr-only">
          Upcoming programme cards
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {UPCOMING_EVENTS.map((event, index) => {
            const isOpen = event.status === "registration_open";
            return (
              <motion.article
                key={event.id}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
                className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
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

      {/* Global reach CTA */}
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
            href="/registration"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-saffron px-6 py-3 text-sm font-bold text-brand-navy shadow-md transition hover:bg-brand-saffron-dark hover:text-white"
          >
            Register for 6.0
          </Link>
          <Link
            href="/past-events"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-brand-navy/20 bg-white px-6 py-3 text-sm font-bold text-brand-navy transition hover:border-brand-saffron"
          >
            View Past Editions
          </Link>
        </div>
      </section>
    </div>
  );
}
