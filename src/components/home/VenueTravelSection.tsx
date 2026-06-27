"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { event } from "@/design/tokens";
import { NIT_HAMIRPUR_MAP_EMBED_URL, NIT_HAMIRPUR_MAP_LINK } from "@/config/venue-maps";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";

const DEFAULT_TRAVEL = [
  { title: "Venue", items: [event.venue, event.location] },
  {
    title: "Nearest Airport",
    items: ["Gaggal Airport (Dharamshala) ~85 km", "Chandigarh Airport ~180 km"],
  },
  {
    title: "Railway",
    items: ["Una Himachal ~80 km", "Amb Andaura ~60 km"],
  },
  {
    title: "Stay",
    items: ["Request accommodation via registration", "Hotels in Hamirpur & nearby towns"],
  },
];

export default function VenueTravelSection() {
  const cms = useCms();
  const cta = getSection(cms?.homepage, "cta");
  const travelBlocks = sectionItems<{ title: string; items: string[] }>(cta, "travel");
  const travel = travelBlocks.length ? travelBlocks : DEFAULT_TRAVEL;
  const mapUrl = sectionField(cta, "mapEmbedUrl", NIT_HAMIRPUR_MAP_EMBED_URL);

  return (
    <section
      id="venue"
      className="bg-white py-12 md:py-16 lg:py-20"
      aria-label="Venue and travel information"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Plan Your Visit"
          title={sectionField(cta, "venueTitle", "Venue & Travel")}
          description={sectionField(
            cta,
            "venueDescription",
            `${event.name} · 9–11 October 2026 at ${event.venue}.`
          )}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {travel.map((block) => (
              <div
                key={block.title}
                className="rounded-2xl border border-slate-200 bg-brand-surface p-5"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-saffron-dark">
                  {block.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="text-sm text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div>
            <iframe
              title="NIT Hamirpur location map"
              src={mapUrl}
              loading="lazy"
              className="min-h-[280px] w-full rounded-2xl border border-slate-200"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <p className="mt-3 text-center text-sm">
              <Link
                href={NIT_HAMIRPUR_MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-navy underline"
              >
                Open NIT Hamirpur in Google Maps
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
