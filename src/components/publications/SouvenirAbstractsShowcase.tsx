"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  SOUVENIR_CATALOG,
  SOUVENIR_PAGE_HERO,
  SOUVENIR_RELATED_LINKS,
  SOUVENIR_STATS,
  SOUVENIR_TRACK_HIGHLIGHTS,
  type SouvenirEditionEntry,
} from "@/data/souvenir-abstracts-hub";

function SouvenirEditionCard({ entry }: { entry: SouvenirEditionEntry }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const pdfFilename = entry.pdfHref.substring(entry.pdfHref.lastIndexOf("/") + 1);

  return (
    <article
      id={`smk-${entry.edition}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className={`h-1.5 bg-gradient-to-r ${entry.accent}`} aria-hidden />
      <div className="relative aspect-[3/4] w-full bg-slate-100 sm:aspect-[16/10]">
        <Image
          src={entry.coverSrc}
          alt={entry.coverAlt}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-navy">
            Edition {entry.edition}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {entry.year}
          </span>
        </div>
        <h3 className="mt-2 text-base font-bold leading-snug text-brand-navy md:text-lg">
          {entry.theme}
        </h3>
        <dl className="mt-3 space-y-1 text-xs text-slate-600">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-semibold text-brand-navy">Venue</dt>
            <dd>{entry.venue}</dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-semibold text-brand-navy">Dates</dt>
            <dd>{entry.dates}</dd>
          </div>
          {entry.paperCountNote && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-semibold text-brand-navy">Scope</dt>
              <dd>{entry.paperCountNote}</dd>
            </div>
          )}
        </dl>
        <div className="mt-5 flex flex-col gap-2">
          <a
            href={entry.pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-navy-light"
          >
            Preview PDF
          </a>
          <a
            href={entry.pdfHref}
            download={pdfFilename}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-saffron px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-saffron-dark hover:text-white"
          >
            Download
          </a>
          <button
            type="button"
            onClick={() => setPreviewOpen((open) => !open)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand-navy/20 px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-navy/5 md:hidden"
          >
            {previewOpen ? "Hide preview" : "Quick preview"}
          </button>
          <Link
            href={entry.pastEventHref}
            className="text-center text-xs font-semibold text-brand-saffron-dark underline-offset-2 hover:underline"
          >
            View past event
          </Link>
        </div>
      </div>
      {previewOpen && (
        <div className="border-t border-slate-100 p-4 md:hidden">
          <iframe
            title={`${entry.label} PDF preview`}
            src={`${entry.pdfHref}#view=FitH`}
            className="h-64 w-full rounded-lg border border-slate-200 bg-white"
          />
        </div>
      )}
    </article>
  );
}

export default function SouvenirAbstractsShowcase() {
  const [activePreview, setActivePreview] = useState(SOUVENIR_CATALOG[0]?.pdfHref ?? "");
  const activeEntry = SOUVENIR_CATALOG.find((e) => e.pdfHref === activePreview);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Publications", href: "/publications" },
          { label: "Souvenir Abstracts MTC" },
        ]}
        className="mb-6"
      />

      <HubGradientBanner
        id="souvenir-banner"
        eyebrow={SOUVENIR_PAGE_HERO.eyebrow}
        title={SOUVENIR_PAGE_HERO.title}
        subtitle={SOUVENIR_PAGE_HERO.subtitle}
        stats={SOUVENIR_STATS}
        titleAs="h1"
      />

      <section className="mt-10" aria-labelledby="souvenir-volumes">
        <h2 id="souvenir-volumes" className="text-lg font-bold text-brand-navy md:text-xl">
          Published souvenir booklets
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Each booklet compiles Multi Track Conference abstract submissions for a Shiksha Mahakumbh
          national edition. Preview or download the full PDF for delegates, reviewers, and
          institutions.
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {SOUVENIR_CATALOG.map((entry) => (
            <SouvenirEditionCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      <section className="mt-10 hidden md:block" aria-labelledby="pdf-preview">
        <h2 id="pdf-preview" className="text-lg font-bold text-brand-navy md:text-xl">
          Preview
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {SOUVENIR_CATALOG.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setActivePreview(entry.pdfHref)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                activePreview === entry.pdfHref
                  ? "bg-brand-navy text-white"
                  : "border border-slate-200 text-brand-navy hover:border-brand-saffron/40"
              }`}
            >
              Edition {entry.edition}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Inline preview on desktop — use download on mobile for the best experience.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner">
          <iframe
            title={activeEntry ? `${activeEntry.label} PDF preview` : "Souvenir PDF preview"}
            src={`${activePreview}#view=FitH`}
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
          <strong>Download</strong> or <strong>Preview PDF</strong> on each edition card to read
          the souvenir on your device.
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
