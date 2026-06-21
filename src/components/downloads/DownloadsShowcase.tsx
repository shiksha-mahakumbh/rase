"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BrochureDownloadLink from "@/components/analytics/BrochureDownloadLink";
import {
  COMMITTEE_BROCHURES_FOLDER_URL,
  DOWNLOADS_HUB_STATS,
  EDITION_BROCHURES,
} from "@/data/downloads-hub";
import type { CmsDownload } from "@/lib/cms/types";

const TYPE_LABELS: Record<string, string> = {
  brochure: "Brochures",
  report: "Reports",
  guidelines: "Guidelines",
  circular: "Circulars",
  poster: "Posters",
  presentation: "Presentations",
  other: "Other",
};

type Props = { initialDownloads: CmsDownload[] };

export default function DownloadsShowcase({ initialDownloads }: Props) {
  const [downloads, setDownloads] = useState(initialDownloads);
  const [brochureQuery, setBrochureQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const years = useMemo(
    () => Array.from(new Set(EDITION_BROCHURES.map((b) => b.year))).sort().reverse(),
    []
  );

  const filteredBrochures = useMemo(() => {
    const q = brochureQuery.toLowerCase().trim();
    return EDITION_BROCHURES.filter((b) => {
      const matchesYear = yearFilter === "all" || b.year === yearFilter;
      const matchesQuery =
        !q ||
        b.edition.includes(q) ||
        b.venue.toLowerCase().includes(q) ||
        b.theme.toLowerCase().includes(q) ||
        b.year.includes(q);
      return matchesYear && matchesQuery;
    });
  }, [brochureQuery, yearFilter]);

  const cmsBrochures = useMemo(
    () => downloads.filter((d) => d.downloadType === "brochure"),
    [downloads]
  );
  const otherDownloads = useMemo(
    () => downloads.filter((d) => d.downloadType !== "brochure"),
    [downloads]
  );

  const types = useMemo(
    () => Array.from(new Set(otherDownloads.map((d) => d.downloadType))),
    [otherDownloads]
  );

  const filteredOther = useMemo(() => {
    const q = search.trim().toLowerCase();
    return otherDownloads.filter((d) => {
      if (typeFilter && d.downloadType !== typeFilter) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [otherDownloads, search, typeFilter]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v2/downloads?limit=100", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { items: CmsDownload[] };
        setDownloads(data.items ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  const trackAndOpen = async (id: string, url: string) => {
    fetch(`/api/v2/downloads/${id}/track`, { method: "POST" }).catch(() => undefined);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <section
        aria-labelledby="downloads-hub-banner"
        className="overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-5 text-white shadow-xl md:rounded-3xl md:p-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-saffron md:text-xs">
          Official Resources · National & International Delegates
        </p>
        <h2 id="downloads-hub-banner" className="mt-2 text-xl font-bold md:text-3xl">
          Edition Brochures & Download Centre
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
          Download official Shiksha Mahakumbh Abhiyan brochures for editions 1.0 through 6.0 —
          programmes, conclaves, registration details, and global participation information in
          print-ready PDF format.
        </p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Editions
            </dt>
            <dd className="mt-1 text-sm font-bold md:text-base">1.0 — 6.0 PDF Brochures</dd>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Latest
            </dt>
            <dd className="mt-1 text-sm font-bold md:text-base">Edition 6.0 · NIT Hamirpur 2026</dd>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Global Reach
            </dt>
            <dd className="mt-1 text-sm font-bold md:text-base">Free for all delegates</dd>
          </div>
        </dl>
        <p className="mt-4">
          <BrochureDownloadLink
            href={COMMITTEE_BROCHURES_FOLDER_URL}
            plan="downloads-all-brochures-folder"
            className="inline-flex min-h-[44px] items-center rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Open All Brochures on Google Drive
          </BrochureDownloadLink>
        </p>
      </section>

      <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {DOWNLOADS_HUB_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200/80 bg-white px-3 py-4 text-center shadow-sm"
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
              {stat.label}
            </dt>
            <dd className="mt-1 text-2xl font-bold text-brand-navy">{stat.value}</dd>
            <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">{stat.hint}</p>
          </div>
        ))}
      </dl>

      <section aria-labelledby="edition-brochures" className="mt-10">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="edition-brochures" className="text-xl font-bold text-brand-navy md:text-2xl">
              Shiksha Mahakumbh Edition Brochures
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Official PDF brochures — view online or download for each Abhiyan edition.
            </p>
          </div>
          <label className="sr-only" htmlFor="brochure-search">
            Search brochures
          </label>
          <input
            id="brochure-search"
            type="search"
            placeholder="Search edition, venue, theme…"
            value={brochureQuery}
            onChange={(e) => setBrochureQuery(e.target.value)}
            className="min-h-[44px] w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron lg:max-w-xs"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter brochures by year">
          <button
            type="button"
            onClick={() => setYearFilter("all")}
            className={`min-h-[40px] rounded-lg px-3 py-1.5 text-sm font-medium ${
              yearFilter === "all" ? "bg-brand-navy text-white" : "bg-slate-100 text-gray-700"
            }`}
          >
            All Years
          </button>
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setYearFilter(year)}
              className={`min-h-[40px] rounded-lg px-3 py-1.5 text-sm font-medium ${
                yearFilter === year ? "bg-brand-navy text-white" : "bg-slate-100 text-gray-700"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredBrochures.map((brochure, index) => (
            <motion.article
              key={brochure.edition}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:border-brand-saffron/40 hover:shadow-lg"
            >
              <div className="relative bg-gradient-to-r from-brand-navy to-brand-navy/90 px-5 py-4">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-saffron/20 blur-2xl"
                />
                <div className="relative flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-saffron px-3 py-1 text-xs font-bold text-brand-navy">
                    Edition {brochure.edition}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                    {brochure.year}
                  </span>
                  {brochure.status === "upcoming" && (
                    <span className="rounded-full bg-emerald-400/90 px-3 py-1 text-xs font-bold text-brand-navy">
                      Upcoming
                    </span>
                  )}
                  <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                    PDF · {brochure.fileSize}
                  </span>
                </div>
                <h3 className="relative mt-2 text-lg font-bold text-white">{brochure.venue}</h3>
                <p className="relative mt-1 text-sm text-white/80">{brochure.dates}</p>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm font-semibold leading-snug text-brand-saffron-dark">
                  {brochure.theme}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{brochure.fileName}</p>

                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <BrochureDownloadLink
                    href={brochure.downloadUrl}
                    plan={`downloads-brochure-dl-${brochure.edition}`}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
                  >
                    Download PDF
                  </BrochureDownloadLink>
                  <BrochureDownloadLink
                    href={brochure.viewUrl}
                    plan={`downloads-brochure-view-${brochure.edition}`}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-brand-saffron bg-brand-saffron/10 px-4 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-saffron/20"
                  >
                    View Online
                  </BrochureDownloadLink>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                  <Link
                    href={brochure.eventHref}
                    className="text-brand-blue hover:text-brand-saffron-dark hover:underline"
                  >
                    Edition page →
                  </Link>
                  <Link
                    href={brochure.committeeHref}
                    className="text-brand-blue hover:text-brand-saffron-dark hover:underline"
                  >
                    Committee list →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredBrochures.length === 0 && (
          <p className="py-10 text-center text-slate-500">No brochures match your search.</p>
        )}
      </section>

      {cmsBrochures.length > 0 && (
        <section aria-labelledby="cms-brochures" className="mt-14 border-t border-slate-200 pt-10">
          <h2 id="cms-brochures" className="text-lg font-bold text-brand-navy md:text-xl">
            Additional Brochures
          </h2>
          <ul className="mt-4 space-y-3" role="list">
            {cmsBrochures.map((d) => (
              <li
                key={d.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-bold text-brand-navy">{d.title}</h3>
                  {d.description ? (
                    <p className="mt-1 text-sm text-slate-600">{d.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => trackAndOpen(d.id, d.fileUrl)}
                  className="min-h-[44px] shrink-0 rounded-xl bg-brand-navy px-5 py-2 text-sm font-bold text-white hover:bg-brand-navy-light"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="other-downloads" className="mt-14 border-t border-slate-200 pt-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="other-downloads" className="text-lg font-bold text-brand-navy md:text-xl">
              Reports, Guidelines & Circulars
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Additional official documents from the Department of Holistic Education.
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="min-h-[44px] rounded-xl bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-light disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh list"}
          </button>
        </div>

        <label className="sr-only" htmlFor="download-search">
          Search other downloads
        </label>
        <input
          id="download-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reports, guidelines, circulars…"
          className="mb-4 w-full min-h-[44px] rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
        />

        {types.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTypeFilter(null)}
              className={`min-h-[40px] rounded-full px-4 py-2 text-sm font-semibold ${
                !typeFilter ? "bg-brand-navy text-white" : "bg-white ring-1 ring-slate-200"
              }`}
            >
              All
            </button>
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                className={`min-h-[40px] rounded-full px-4 py-2 text-sm font-semibold ${
                  typeFilter === t ? "bg-brand-saffron text-brand-navy" : "bg-white ring-1 ring-slate-200"
                }`}
              >
                {TYPE_LABELS[t] ?? t}
              </button>
            ))}
          </div>
        )}

        {filteredOther.length === 0 ? (
          <p className="py-8 text-center text-slate-500">
            {otherDownloads.length === 0
              ? "No additional documents published yet. Edition brochures are available above."
              : "No documents match your filters."}
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2" role="list">
            {filteredOther.map((d) => (
              <li
                key={d.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-bold text-brand-navy">{d.title}</h3>
                {d.description ? (
                  <p className="mt-2 flex-1 text-sm text-slate-600">{d.description}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold uppercase">
                    {TYPE_LABELS[d.downloadType] ?? d.downloadType}
                  </span>
                  {d.category ? (
                    <span className="rounded bg-slate-100 px-2 py-0.5">{d.category}</span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => trackAndOpen(d.id, d.fileUrl)}
                  className="mt-4 min-h-[44px] w-full rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-navy-light"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-10 text-center text-sm text-slate-500">
        <Link href="/committees" className="font-semibold text-brand-blue hover:underline">
          Organising committees
        </Link>
        {" · "}
        <Link href="/past-events" className="font-semibold text-brand-blue hover:underline">
          Past editions
        </Link>
        {" · "}
        <Link href="/registration" className="font-semibold text-brand-blue hover:underline">
          Register for SM 6.0
        </Link>
      </p>
    </div>
  );
}
