"use client";

import Image from "next/image";
import Link from "next/link";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  PROCEEDINGS_CATALOG,
  PROCEEDINGS_PAGE_HERO,
  PROCEEDINGS_STATS,
} from "@/data/proceedings-hub";

function downloadPdf(href: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = href.substring(href.lastIndexOf("/") + 1);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ProceedingsShowcase() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <ReservedAdSlot slotId="publications-top" />

      <HubGradientBanner
        id="proceedings-banner"
        eyebrow={PROCEEDINGS_PAGE_HERO.eyebrow}
        title={PROCEEDINGS_PAGE_HERO.title}
        subtitle={PROCEEDINGS_PAGE_HERO.subtitle}
        stats={PROCEEDINGS_STATS}
      />

      <section className="mt-10" aria-labelledby="proceedings-volumes">
        <h2 id="proceedings-volumes" className="text-lg font-bold text-brand-navy md:text-xl">
          Published volumes
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Each volume maps to a Shiksha Mahakumbh national conference theme. Preview the PDF, download
          the full proceedings, or read paper abstracts online.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {PROCEEDINGS_CATALOG.map((volume) => (
            <article
              key={volume.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className={`h-1.5 bg-gradient-to-r ${volume.accent}`} aria-hidden />
              <div className="relative aspect-[16/10] w-full bg-slate-100">
                <Image
                  src={volume.coverSrc}
                  alt={volume.coverAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-navy">
                    Vol. {volume.volume}
                  </span>
                  {volume.edition && (
                    <span className="rounded-full bg-brand-saffron/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-saffron-dark">
                      Edition {volume.edition}
                    </span>
                  )}
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {volume.year}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold leading-snug text-brand-navy md:text-lg">
                  {volume.theme}
                </h3>
                <dl className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-brand-navy">Venue</dt>
                    <dd>{volume.venue}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-brand-navy">Dates</dt>
                    <dd>{volume.dates}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-brand-navy">Papers</dt>
                    <dd>{volume.paperCount} listed online</dd>
                  </div>
                </dl>
                <div className="mt-5 flex flex-col gap-2">
                  <a
                    href={volume.pdfHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-navy-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                  >
                    Preview PDF
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadPdf(volume.pdfHref)}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-saffron px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-saffron-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
                  >
                    Download
                  </button>
                  <Link
                    href={volume.readHref}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand-navy/20 px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-navy/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                  >
                    Read online
                  </Link>
                  {volume.pastEventHref && (
                    <Link
                      href={volume.pastEventHref}
                      className="text-center text-xs font-semibold text-brand-saffron-dark underline-offset-2 hover:underline"
                    >
                      View past event
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
