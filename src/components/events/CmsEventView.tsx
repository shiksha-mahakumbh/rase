import Image from "next/image";
import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { CtaButton } from "@/components/ui";
import { SITE_URL } from "@/config/site";
import type { CmsLoadedEvent } from "@/lib/cms/types";
import { formatEventDateRange } from "@/lib/cms/organizational";
import { buildEventSchema } from "@/server/services/seo.service";
import { brandPageHero } from "@/lib/page-heroes";

export default function CmsEventView({ event }: { event: CmsLoadedEvent }) {
  const dateLabel = formatEventDateRange(event.startDate, event.endDate);
  const location = event.venue ?? event.location ?? undefined;

  const eventJsonLd = buildEventSchema({
    name: event.title,
    startDate: event.startDate ?? new Date().toISOString(),
    endDate: event.endDate ?? undefined,
    location,
    description: event.description ?? undefined,
    url: `${SITE_URL}/events/${event.slug}`,
  });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Conferences", path: "/conferences" },
          { name: event.title, path: `/events/${event.slug}` },
        ]}
      />
      <JsonLd data={eventJsonLd as Record<string, unknown>} />
      <PublicPageShell
        hero={{
          ...brandPageHero(
            event.title,
            [dateLabel, location].filter(Boolean).join(" · "),
            event.edition ?? "Event"
          ),
          imageSrc: event.bannerUrl ?? undefined,
        }}
        relatedPath="/conferences"
        showCta={false}
      >
        <article className="mx-auto max-w-3xl">
          {event.bannerUrl && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
              <Image
                src={event.bannerUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          )}
          {event.description && (
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          )}
          {Array.isArray(event.highlights) && event.highlights.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-brand-navy">Highlights</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
                {event.highlights.map((item, index) => (
                  <li key={index}>{typeof item === "string" ? item : JSON.stringify(item)}</li>
                ))}
              </ul>
            </section>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {event.registrationLink && (
              <CtaButton href={event.registrationLink}>Register</CtaButton>
            )}
            {event.brochureUrl && (
              <CtaButton href={event.brochureUrl} variant="secondary">
                Download Brochure
              </CtaButton>
            )}
          </div>
        </article>
      </PublicPageShell>
    </>
  );
}

export function EventsListing({ events }: { events: Array<{ id: string; title: string; slug: string; href: string; startDate: string | null; endDate: string | null; venue: string | null; location: string | null; description: string | null; isFeatured: boolean }> }) {
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
