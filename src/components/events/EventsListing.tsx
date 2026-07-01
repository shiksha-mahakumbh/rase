"use client";

import Link from "next/link";
import { formatEventDateRange } from "@/lib/cms/format-dates";

type EventListItem = {
  id: string;
  title: string;
  slug: string;
  href: string;
  startDate: string | null;
  endDate: string | null;
  venue: string | null;
  location: string | null;
  description: string | null;
  isFeatured: boolean;
};

export function EventsListing({ events }: { events: EventListItem[] }) {
  if (events.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="cms-events">
      <h2 id="cms-events" className="text-lg font-bold text-brand-navy">
        Published Events
      </h2>
      <ul className="mt-4 space-y-3">
        {events.map((event) => (
          <li key={event.id}>
            <Link
              href={event.href}
              className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-navy/30 hover:shadow-sm"
            >
              <h3 className="font-bold text-brand-navy">{event.title}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {formatEventDateRange(event.startDate, event.endDate)}
                {(event.venue ?? event.location) &&
                  ` · ${event.venue ?? event.location}`}
              </p>
              {event.description && (
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">{event.description}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
