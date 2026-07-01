import Image from "next/image";
import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { CtaButton } from "@/components/ui";
import { SITE_URL } from "@/config/site";
import type { CmsLoadedEvent } from "@/lib/cms/types";
import { formatEventDateRange } from "@/lib/cms/format-dates";
import { buildEventSchema } from "@/server/services/seo.service";
import { brandPageHero } from "@/lib/page-heroes";
import SafeHtml from "@/components/common/SafeHtml";

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
            <SafeHtml
              html={event.description}
              className="prose prose-slate max-w-none"
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
