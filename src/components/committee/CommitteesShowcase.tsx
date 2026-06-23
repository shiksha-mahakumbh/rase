"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import BrochureDownloadLink from "@/components/analytics/BrochureDownloadLink";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import {
  COMMITTEES_BREADCRUMBS,
  COMMITTEES_HERO_IMAGE,
  COMMITTEES_QUICK_LINKS,
  COMMITTEES_UPCOMING_CTA,
  COMMITTEE_HUB_EDITIONS,
  buildCommitteeHubStats,
  getCommitteeHubMemberTotal,
} from "@/data/committee-hub";
import { countCommitteeMembers } from "@/data/committee-members";
import {
  COMMITTEE_BROCHURES_FOLDER_URL,
  getBrochureViewUrl,
  getCommitteeBrochure,
} from "@/data/committee-brochures";
import { getEditionByNumber } from "@/data/past-editions";

function editionMatchesQuery(
  edition: (typeof COMMITTEE_HUB_EDITIONS)[number],
  q: string
): boolean {
  if (
    edition.edition.includes(q) ||
    edition.venue.toLowerCase().includes(q) ||
    edition.theme.toLowerCase().includes(q) ||
    edition.description.toLowerCase().includes(q) ||
    edition.year.includes(q)
  ) {
    return true;
  }

  return edition.sections.some((section) =>
    section.members.some(
      (member) =>
        member.name.toLowerCase().includes(q) ||
        member.designation.toLowerCase().includes(q)
    )
  );
}

function editionImageSrc(edition: string) {
  return getEditionByNumber(edition)?.imageSrc ?? COMMITTEES_HERO_IMAGE;
}

export default function CommitteesShowcase() {
  const [query, setQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "completed">("all");

  const memberTotal = getCommitteeHubMemberTotal();
  const hubStats = buildCommitteeHubStats();

  const years = useMemo(
    () => Array.from(new Set(COMMITTEE_HUB_EDITIONS.map((c) => c.year))).sort().reverse(),
    []
  );

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return COMMITTEE_HUB_EDITIONS.filter((edition) => {
      const matchesYear = yearFilter === "all" || edition.year === yearFilter;
      const matchesStatus = statusFilter === "all" || edition.status === statusFilter;
      const matchesQuery = !q || editionMatchesQuery(edition, q);
      return matchesYear && matchesStatus && matchesQuery;
    });
  }, [query, yearFilter, statusFilter]);

  return (
    <div>
      <BreadcrumbNav
        items={COMMITTEES_BREADCRUMBS.map((item, index, arr) => ({
          label: item.name,
          href: index < arr.length - 1 ? item.path : undefined,
        }))}
        className="-mt-2 mb-6"
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COMMITTEES_QUICK_LINKS.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
            >
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
            >
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </Link>
          )
        )}
      </section>

      <section
        aria-labelledby="committee-hub-banner"
        className="mt-6 overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-5 text-white shadow-xl md:rounded-3xl md:p-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-saffron md:text-xs">
          Governance & Leadership · National Education Movement
        </p>
        <h2 id="committee-hub-banner" className="sr-only">
          Committee coverage summary
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Coverage
            </dt>
            <dd className="mt-1 text-sm font-bold md:text-base">2023 — 2026</dd>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Listed Members
            </dt>
            <dd className="mt-1 text-sm font-bold md:text-base">{memberTotal}+</dd>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Global Reach
            </dt>
            <dd className="mt-1 text-sm font-bold md:text-base">National & International</dd>
          </div>
        </dl>
        <p className="mt-4 print:hidden">
          <BrochureDownloadLink
            href={COMMITTEE_BROCHURES_FOLDER_URL}
            plan="committee-all-brochures-folder"
            className="inline-flex min-h-[40px] items-center rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            All Edition Brochures (PDF) on Google Drive
          </BrochureDownloadLink>
        </p>
      </section>

      <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {hubStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200/80 bg-white px-3 py-4 text-center shadow-sm"
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
              {stat.label}
            </dt>
            <dd className="mt-1 text-2xl font-bold text-brand-navy">{stat.value}</dd>
            <dd className="mt-1 text-[10px] text-slate-500 sm:text-xs">{stat.hint}</dd>
          </div>
        ))}
      </dl>

      <section
        className="mt-8 overflow-hidden rounded-2xl border border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 via-white to-brand-saffron/5 p-6 text-center md:p-8"
        aria-labelledby="committee-upcoming-heading"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-saffron">
          Edition 6.0 committee
        </p>
        <h2 id="committee-upcoming-heading" className="mt-2 text-xl font-bold text-brand-navy md:text-2xl">
          {COMMITTEES_UPCOMING_CTA.title}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
          {COMMITTEES_UPCOMING_CTA.venue} · {COMMITTEES_UPCOMING_CTA.dates}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href={COMMITTEES_UPCOMING_CTA.committeeHref}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
          >
            View SMK 6.0 committee
          </Link>
          <Link
            href={COMMITTEES_UPCOMING_CTA.registrationHref}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-saffron px-6 py-2.5 text-sm font-bold text-brand-navy transition hover:bg-brand-saffron-dark hover:text-white"
          >
            Register for SMK 6.0
          </Link>
        </div>
      </section>

      <section aria-labelledby="committee-filters" className="mt-10">
        <h2 id="committee-filters" className="sr-only">
          Filter editions
        </h2>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="sr-only" htmlFor="committee-search">
            Search committees
          </label>
          <input
            id="committee-search"
            type="search"
            placeholder="Search edition, venue, theme, or member…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[44px] flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
          />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {(["all", "upcoming", "completed"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                aria-pressed={statusFilter === status}
                className={`min-h-[40px] rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${
                  statusFilter === status
                    ? "bg-brand-saffron text-brand-navy"
                    : "bg-slate-100 text-gray-700"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by year">
          <button
            type="button"
            onClick={() => setYearFilter("all")}
            aria-pressed={yearFilter === "all"}
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
              aria-pressed={yearFilter === year}
              className={`min-h-[40px] rounded-lg px-3 py-1.5 text-sm font-medium ${
                yearFilter === year ? "bg-brand-navy text-white" : "bg-slate-100 text-gray-700"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="committee-editions" className="mt-10">
        <h2
          id="committee-editions"
          className="mb-6 text-center text-lg font-bold text-brand-navy md:text-xl"
        >
          Edition Committees
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((edition, index) => {
            const members = countCommitteeMembers(edition);
            const brochure = getCommitteeBrochure(edition.edition);
            const imageSrc = editionImageSrc(edition.edition);

            return (
              <motion.article
                key={edition.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-0.5 hover:border-brand-saffron/40 hover:shadow-lg"
              >
                <div className="relative h-36 bg-slate-100">
                  <Image
                    src={imageSrc}
                    alt={`${edition.pageTitle} — ${edition.venue}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-saffron px-3 py-1 text-xs font-bold text-brand-navy">
                        Edition {edition.edition}
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                        {edition.year}
                      </span>
                      {edition.status === "upcoming" ? (
                        <span className="rounded-full bg-emerald-400/90 px-3 py-1 text-xs font-bold text-brand-navy">
                          Upcoming
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-white">{edition.venue}</h3>
                    <p className="mt-1 text-sm text-white/80">{edition.dates}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm font-semibold text-brand-saffron-dark">{edition.theme}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                    {edition.description}
                  </p>
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    {members} committee members · {edition.sections.length} sections
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={edition.committeeLink}
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
                      >
                        View Committee
                      </Link>
                      <Link
                        href={edition.eventHref}
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-brand-saffron bg-brand-saffron/10 px-4 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-saffron/20"
                      >
                        Edition Page
                      </Link>
                    </div>
                    {brochure ? (
                      <BrochureDownloadLink
                        href={getBrochureViewUrl(brochure.driveFileId)}
                        plan={`committee-hub-brochure-${edition.edition}`}
                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:bg-brand-saffron/10"
                      >
                        Brochure PDF
                        <span className="text-xs font-normal text-slate-500">
                          · {brochure.fileSize}
                        </span>
                      </BrochureDownloadLink>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-gray-500">
            No editions match your filters. Try clearing search or choosing &quot;All&quot; for status
            and year.
          </p>
        ) : null}
      </section>
    </div>
  );
}
