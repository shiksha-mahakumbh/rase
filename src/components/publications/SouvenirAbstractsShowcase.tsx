"use client";

import Image from "next/image";
import Link from "next/link";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  SOUVENIR_ABSTRACTS_PDF_PATH,
  SOUVENIR_META,
  SOUVENIR_PAGE_HERO,
  SOUVENIR_RELATED_LINKS,
  SOUVENIR_STATS,
  SOUVENIR_TRACK_HIGHLIGHTS,
} from "@/data/souvenir-abstracts-hub";

function downloadPdf() {
  const link = document.createElement("a");
  link.href = SOUVENIR_ABSTRACTS_PDF_PATH;
  link.download = "Souvenir_Abstracts_MTC.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function SouvenirAbstractsShowcase() {
  const pdfPreviewSrc = `${SOUVENIR_ABSTRACTS_PDF_PATH}#view=FitH`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <HubGradientBanner
        id="souvenir-banner"
        eyebrow={SOUVENIR_PAGE_HERO.eyebrow}
        title={SOUVENIR_PAGE_HERO.title}
        subtitle={SOUVENIR_PAGE_HERO.subtitle}
        stats={SOUVENIR_STATS}
      />

      <section className="mt-10" aria-labelledby="souvenir-volume">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
            <div className="border-b border-slate-100 bg-gradient-to-br from-brand-surface-warm to-white p-6 lg:border-b-0 lg:border-r">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-xl border border-slate-200 shadow-md">
                <Image
                  src={SOUVENIR_META.coverSrc}
                  alt={SOUVENIR_META.coverAlt}
                  fill
                  sizes="240px"
                  className="object-cover"
                  priority
                />
              </div>
              <dl className="mt-5 space-y-2 text-sm">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Conference
                  </dt>
                  <dd className="font-semibold text-brand-navy">Multi Track Conference (MTC)</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Context
                  </dt>
                  <dd className="text-slate-700">
                    {SOUVENIR_META.title} · {SOUVENIR_META.venue}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Theme
                  </dt>
                  <dd className="text-slate-700">{SOUVENIR_META.theme}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col p-6 md:p-8">
              <h2 id="souvenir-volume" className="text-xl font-bold text-brand-navy md:text-2xl">
                Souvenir volume — abstract compendium
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                This souvenir compiles accepted abstract submissions across Multi Track Conference
                research areas — a reference for delegates, reviewers, and institutions participating
                in Shiksha Mahakumbh Abhiyan&apos;s national and international research programme.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-saffron px-5 py-2.5 text-sm font-bold text-brand-navy hover:bg-brand-saffron-dark hover:text-white"
                >
                  Download PDF
                </button>
                <a
                  href={SOUVENIR_ABSTRACTS_PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy hover:border-brand-saffron/40"
                >
                  Open in new tab
                </a>
                <Link
                  href="/proceedings"
                  className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-brand-blue hover:text-brand-saffron"
                >
                  Full proceedings →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 hidden md:block" aria-labelledby="pdf-preview">
        <h2 id="pdf-preview" className="text-lg font-bold text-brand-navy md:text-xl">
          Preview
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Inline preview on desktop — use download on mobile for the best experience.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
          <iframe
            title="Souvenir Abstracts MTC PDF preview"
            src={pdfPreviewSrc}
            className="h-[min(70vh,720px)] w-full bg-white"
          />
        </div>
      </section>

      <section className="mt-10 md:hidden" aria-labelledby="mobile-pdf-note">
        <div
          id="mobile-pdf-note"
          className="rounded-xl border border-brand-saffron/25 bg-brand-surface-warm px-4 py-4 text-sm text-slate-700"
        >
          <strong className="text-brand-navy">Mobile tip:</strong> Tap{" "}
          <strong>Download PDF</strong> or <strong>Open in new tab</strong> to read the souvenir on
          your device.
        </div>
      </section>

      <section className="mt-10" aria-labelledby="track-highlights">
        <h2 id="track-highlights" className="text-lg font-bold text-brand-navy md:text-xl">
          Multi Track research areas
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Abstracts span the hybrid Multi Track Conference framework — aligned with NEP 2020 and
          global education research standards.
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {SOUVENIR_TRACK_HIGHLIGHTS.map((track) => (
            <li
              key={track.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className={`h-1.5 bg-gradient-to-r ${track.accent}`} aria-hidden />
              <div className="p-4">
                <h3 className="font-bold text-brand-navy">{track.label}</h3>
                <p className="mt-1 text-sm text-slate-600">{track.hint}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="souvenir-related">
        <h2 id="souvenir-related" className="text-lg font-bold text-brand-navy md:text-xl">
          Related resources
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SOUVENIR_RELATED_LINKS.map((link) => {
            const external = "external" in link && link.external;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex min-h-[44px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
                >
                  <span aria-hidden>{link.icon}</span>
                  {link.label}
                  {external && <span className="ml-auto text-xs text-slate-400">↗</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
