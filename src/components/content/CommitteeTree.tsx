"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { COMMITTEE_EDITIONS } from "@/data/committee-editions";

interface CommitteeTreeProps {
  onSelect?: (committee: string) => void;
}

const CommitteeTimeline: React.FC<CommitteeTreeProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");

  const years = useMemo(
    () => Array.from(new Set(COMMITTEE_EDITIONS.map((c) => c.year))).sort(),
    []
  );

  const filtered = useMemo(() => {
    return COMMITTEE_EDITIONS.filter((c) => {
      const matchesYear = yearFilter === "all" || c.year === yearFilter;
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.year.includes(q);
      return matchesYear && matchesQuery;
    });
  }, [query, yearFilter]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="sr-only" htmlFor="committee-search">
          Search committees
        </label>
        <input
          id="committee-search"
          type="search"
          placeholder="Search edition or description…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[44px] flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-saffron focus:outline-none focus:ring-1 focus:ring-brand-saffron"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by year">
          <button
            type="button"
            onClick={() => setYearFilter("all")}
            className={`min-h-[40px] rounded-lg px-3 py-1.5 text-sm font-medium ${
              yearFilter === "all"
                ? "bg-brand-navy text-white"
                : "bg-slate-100 text-gray-700"
            }`}
          >
            All
          </button>
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setYearFilter(year)}
              className={`min-h-[40px] rounded-lg px-3 py-1.5 text-sm font-medium ${
                yearFilter === year
                  ? "bg-brand-navy text-white"
                  : "bg-slate-100 text-gray-700"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="relative ml-2 border-l-2 border-brand-saffron/40 pl-8">
        {filtered.map((committee, index) => (
          <motion.article
            key={committee.title}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="relative mb-10"
          >
            <div
              aria-hidden
              className="absolute -left-[2.55rem] top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-brand-saffron shadow-md"
            />
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_32px_rgba(11,31,59,0.08)] transition hover:-translate-y-0.5 hover:border-brand-saffron/30 hover:shadow-lg">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-saffron-dark">
                    Edition {committee.edition}
                  </span>
                  <h2 className="text-xl font-bold text-brand-navy md:text-2xl">
                    {committee.title}
                  </h2>
                </div>
                <span className="rounded-full bg-brand-saffron/15 px-3 py-1 text-sm font-semibold text-brand-navy">
                  {committee.year}
                </span>
              </div>
              <p className="mb-5 leading-relaxed text-gray-600">
                {committee.description}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={committee.link}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
                >
                  View Event
                </Link>
                <Link
                  href={committee.committeeLink}
                  onClick={() => onSelect?.(committee.onCommitteeSelect)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-brand-saffron bg-brand-saffron/10 px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-saffron/20"
                >
                  Committee Details
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-gray-500">No editions match your search.</p>
        )}
      </div>
    </div>
  );
};

export default CommitteeTimeline;
