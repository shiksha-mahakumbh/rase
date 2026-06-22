"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import type { ProceedingsVolumeEntry } from "@/data/proceedings-hub";

export interface ProceedingPaper {
  id: string;
  title: string;
  authors: string[];
  contact: string | string[];
  abstract: string;
  keywords: string[];
}

export interface ProceedingSection {
  title: string;
  content?: string[];
  sessionChairs?: string[];
  papers?: ProceedingPaper[];
  pageStart?: number;
}

export interface ProceedingVolumeData {
  chapter: string;
  title: string;
  pageStart: number;
  sections: ProceedingSection[];
}

type Props = {
  volume: ProceedingsVolumeEntry;
  data: ProceedingVolumeData;
};

function formatContact(contact: string | string[]): string {
  return typeof contact === "string" ? contact : contact.join(", ");
}

export default function ProceedingVolumeShowcase({ volume, data }: Props) {
  const [openSections, setOpenSections] = useState<Set<number>>(() => new Set([0]));
  const [expandedPapers, setExpandedPapers] = useState<Set<string>>(() => new Set());

  const toggleSection = (index: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const togglePaper = (id: string) => {
    setExpandedPapers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalPapers = data.sections.reduce(
    (sum, s) => sum + (s.papers?.length ?? 0),
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Publications", href: "/publications" },
          { label: "Proceedings", href: "/proceedings" },
          { label: `Volume ${volume.volume}` },
        ]}
        className="mb-6"
      />

      <section
        aria-labelledby="volume-banner"
        className="relative overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-5 text-white shadow-xl md:rounded-3xl md:p-8"
      >
        <div className="grid gap-6 md:grid-cols-[140px_1fr] md:items-start">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[140px] overflow-hidden rounded-lg border border-white/20 shadow-lg md:mx-0">
            <Image
              src={volume.coverSrc}
              alt={volume.coverAlt}
              fill
              sizes="140px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-saffron">
              Volume {volume.volume}
              {volume.edition ? ` · Edition ${volume.edition}` : ""}
            </p>
            <h1 id="volume-banner" className="mt-2 text-xl font-bold md:text-2xl">
              {volume.theme}
            </h1>
            <p className="mt-2 text-sm text-white/80">
              {volume.venue} · {volume.dates} · {volume.year}
            </p>
            <dl className="mt-4 flex flex-wrap gap-4 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-white/60">Papers</dt>
                <dd className="font-bold text-brand-saffron">{totalPapers || volume.paperCount}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-white/60">Format</dt>
                <dd className="font-semibold">Web + PDF</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-white/60">Access</dt>
                <dd className="font-semibold">Open · Global</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={volume.pdfHref}
                download={volume.pdfHref.substring(volume.pdfHref.lastIndexOf("/") + 1)}
                className="rounded-lg bg-brand-saffron px-4 py-2 text-sm font-bold text-brand-navy hover:bg-brand-saffron-dark hover:text-white"
              >
                Download PDF
              </a>
              <Link
                href="/proceedings"
                className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                All volumes
              </Link>
              {volume.pastEventHref && (
                <Link
                  href={volume.pastEventHref}
                  className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Edition archive
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Proceedings navigation" className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link href="/publications" className="text-brand-blue hover:text-brand-saffron">
          Publications
        </Link>
        <span className="text-slate-300" aria-hidden>
          /
        </span>
        <Link href="/proceedings" className="text-brand-blue hover:text-brand-saffron">
          Proceedings
        </Link>
        <span className="text-slate-300" aria-hidden>
          /
        </span>
        <span className="font-medium text-brand-navy">Volume {volume.volume}</span>
      </nav>

      <div className="mt-8 space-y-4">
        {data.sections.map((section, sectionIndex) => {
          const isOpen = openSections.has(sectionIndex);
          const paperCount = section.papers?.length ?? 0;

          return (
            <section
              key={sectionIndex}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleSection(sectionIndex)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
              >
                <div>
                  <h3 className="text-base font-bold text-brand-navy md:text-lg">{section.title}</h3>
                  {paperCount > 0 && (
                    <p className="mt-0.5 text-xs text-slate-500">{paperCount} papers</p>
                  )}
                </div>
                <span
                  className={`shrink-0 text-brand-saffron transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                  {section.content && section.content.length > 0 && (
                    <div className="prose prose-sm max-w-none text-slate-700">
                      {section.content.map((para, i) => (
                        <p key={i} className="mb-3 leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}

                  {section.sessionChairs && section.sessionChairs.length > 0 && (
                    <div className="mt-4 rounded-xl bg-brand-surface-warm p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wide text-brand-saffron-dark">
                        Session chairs
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-slate-700">
                        {section.sessionChairs.map((chair, i) => (
                          <li key={i}>{chair}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.papers && section.papers.length > 0 && (
                    <ul className="mt-4 space-y-3">
                      {section.papers.map((paper) => {
                        const expanded = expandedPapers.has(paper.id);
                        return (
                          <li
                            key={paper.id}
                            className="rounded-xl border border-slate-100 bg-slate-50/50"
                          >
                            <button
                              type="button"
                              onClick={() => togglePaper(paper.id)}
                              aria-expanded={expanded}
                              className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-bold uppercase tracking-wide text-brand-saffron-dark">
                                  {paper.id}
                                </span>
                                <p className="mt-1 text-sm font-semibold text-brand-navy md:text-base">
                                  {paper.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-xs text-slate-600 md:text-sm">
                                  {paper.authors.join("; ")}
                                </p>
                              </div>
                              <span className="shrink-0 text-xs font-semibold text-brand-blue">
                                {expanded ? "Less" : "Abstract"}
                              </span>
                            </button>
                            {expanded && (
                              <div className="border-t border-slate-100 px-4 pb-4 pt-3 text-sm text-slate-700">
                                <p>
                                  <span className="font-semibold text-brand-navy">Authors: </span>
                                  {paper.authors.join("; ")}
                                </p>
                                <p className="mt-2">
                                  <span className="font-semibold text-brand-navy">Contact: </span>
                                  {formatContact(paper.contact)}
                                </p>
                                <p className="mt-3 leading-relaxed">{paper.abstract}</p>
                                {paper.keywords.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    {paper.keywords.map((kw) => (
                                      <span
                                        key={kw}
                                        className="rounded-full bg-brand-navy/5 px-2 py-0.5 text-[10px] font-medium text-brand-navy"
                                      >
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
