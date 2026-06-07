"use client";

import LazySection from "@/components/performance/LazySection";
import {
  DHE_MAP_EMBED_URL,
  DHE_MAP_LINK,
  DHE_ORGANIZATION,
} from "@/config/organization";

export default function ContactMap() {
  return (
    <section aria-labelledby="contact-map-heading">
      <h2
        id="contact-map-heading"
        className="mb-4 text-xl font-bold text-brand-navy md:text-2xl"
      >
        Find Us
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        {DHE_ORGANIZATION.address.formatted}
      </p>
      <LazySection
        minHeight="16rem"
        rootMargin="100px 0px"
        fallback={
          <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-500 md:h-80 lg:h-[420px]">
            Loading map…
          </div>
        }
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
          <iframe
            title={`${DHE_ORGANIZATION.name} office location map`}
            src={DHE_MAP_EMBED_URL}
            className="h-64 w-full md:h-80 lg:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </LazySection>
      <p className="mt-3 text-center text-sm">
        <a
          href={DHE_MAP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-saffron-dark hover:underline"
        >
          Open in Google Maps →
        </a>
      </p>
    </section>
  );
}
