"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { UPCOMING_EVENTS, UPCOMING_EVENTS_HERO } from "@/data/upcoming-events-hub";

interface UpcomingEventProps {
  /** @deprecated Page uses UpcomingEventsShowcase; home keeps this compact grid. */
  events?: typeof UPCOMING_EVENTS;
}

const UpcomingEvent: React.FC<UpcomingEventProps> = ({ events = UPCOMING_EVENTS }) => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 md:py-10">
      <div className="mb-6 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
          {UPCOMING_EVENTS_HERO.eyebrow}
        </p>
        <h2 className="home-section-title text-2xl md:text-3xl">{UPCOMING_EVENTS_HERO.title}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((event, index) => (
          <motion.article
            key={event.id}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
            className="home-glass home-card-hover flex flex-col justify-between rounded-2xl border border-primary/10 p-5 md:p-6"
          >
            <div>
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                {event.status === "registration_open" ? "Registration Open" : "Upcoming"}
              </span>
              <h3 className="mb-3 text-lg font-bold text-primary md:text-xl">{event.title}</h3>
              <dl className="space-y-2 text-sm text-gray-700">
                <div className="flex gap-2">
                  <dt className="font-semibold text-gray-900">Dates:</dt>
                  <dd>{event.dates}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold text-gray-900">Venue:</dt>
                  <dd>{event.venue}</dd>
                </div>
              </dl>
            </div>
            <Link
              href={event.registrationHref}
              className={`mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                event.status === "registration_open"
                  ? "bg-gradient-to-r from-primary to-[#7a4343] text-white"
                  : "border-2 border-primary/20 bg-white text-primary"
              }`}
            >
              {event.ctaLabel}
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default UpcomingEvent;
