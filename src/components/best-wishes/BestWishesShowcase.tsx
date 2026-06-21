"use client";

import { useMemo, useState } from "react";
import WishCard from "@/components/best-wishes/WishCard";
import {
  BEST_WISHES_ENTRIES,
  BEST_WISHES_STATS,
  WISH_EDITION_FILTERS,
  bestWishesCount,
  type WishEditionFilter,
} from "@/data/best-wishes";

type CategoryFilter = "all" | "featured" | "international" | "government" | "academic";

function matchesCategory(wish: (typeof BEST_WISHES_ENTRIES)[number], cat: CategoryFilter) {
  if (cat === "all") return true;
  if (cat === "featured") return Boolean(wish.featured);
  const d = wish.designation.toLowerCase();
  if (cat === "international") {
    return /oxford|boston|international|south asian university/i.test(d);
  }
  if (cat === "government") {
    return /governor|president|minister|lieutenant|chief minister|ugc|chairman/i.test(d);
  }
  if (cat === "academic") {
    return /director|vice.?chancellor|professor|iit|iim|csir|icar|university|nid|aiims/i.test(
      d
    );
  }
  return true;
}

const CATEGORY_OPTIONS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "featured", label: "Featured" },
  { id: "government", label: "Government" },
  { id: "academic", label: "Academic & Research" },
  { id: "international", label: "International" },
];

export default function BestWishesShowcase() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [edition, setEdition] = useState<WishEditionFilter>("all");
  const total = bestWishesCount();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return BEST_WISHES_ENTRIES.filter((wish) => {
      if (edition !== "all" && wish.edition !== edition) return false;
      if (!matchesCategory(wish, category)) return false;
      if (!q) return true;
      return (
        wish.name.toLowerCase().includes(q) ||
        wish.designation.toLowerCase().includes(q) ||
        wish.message.toLowerCase().includes(q)
      );
    });
  }, [query, category, edition]);

  const featured = filtered.filter((w) => w.featured);
  const featuredIds = new Set(featured.map((w) => w.id));
  const rest = filtered.filter((w) => !featuredIds.has(w.id));

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero banner */}
      <section
        aria-labelledby="best-wishes-banner"
        className="relative overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-5 text-white shadow-xl md:rounded-3xl md:p-8"
      >
        <div
          className="pointer-events-none absolute -right-12 top-0 h-48 w-48 rounded-full bg-brand-saffron/20 blur-3xl"
          aria-hidden
        />
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-saffron md:text-xs">
          Institutional Support · Global Education Movement
        </p>
        <h2 id="best-wishes-banner" className="mt-2 text-xl font-bold md:text-3xl">
          {total} Dignitary Messages
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
          Best wishes from national leaders, governors, ministers, IIT/IIM/CSIR directors, and
          international institutions — name, designation, and message for the Shiksha Mahakumbh
          Abhiyan (editions 1.0–6.0).
        </p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Total messages
            </dt>
            <dd className="mt-1 text-sm font-bold md:text-base">{total}</dd>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              Featured
            </dt>
            <dd className="mt-1 text-sm font-bold md:text-base">{BEST_WISHES_STATS.featured}</dd>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              International
            </dt>
            <dd className="mt-1 text-sm font-bold md:text-base">
              {BEST_WISHES_STATS.international}+ leaders
            </dd>
          </div>
        </dl>
      </section>

      {/* Filters */}
      <div className="mt-8 space-y-4">
        <label htmlFor="wishes-search" className="sr-only">
          Search dignitaries
        </label>
        <input
          id="wishes-search"
          type="search"
          placeholder="Search by name, designation, or message…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand-saffron focus:outline-none focus:ring-2 focus:ring-brand-saffron/20"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setCategory(opt.id)}
              className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === opt.id
                  ? "bg-brand-navy text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-brand-saffron"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by edition">
          {WISH_EDITION_FILTERS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setEdition(opt)}
              className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition ${
                edition === opt
                  ? "bg-brand-saffron text-brand-navy shadow-md"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-brand-saffron"
              }`}
            >
              {opt === "all" ? "All editions" : opt === "Abhiyan" ? "Abhiyan-wide" : `Edition ${opt}`}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && category !== "featured" && (
        <section className="mt-10" aria-labelledby="featured-wishes">
          <h2 id="featured-wishes" className="mb-5 text-lg font-bold text-brand-navy md:text-xl">
            Featured Messages
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((wish) => (
              <li key={wish.id}>
                <WishCard wish={wish} variant="featured" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* All messages grid */}
      <section className="mt-10" aria-labelledby="all-wishes">
        <h2 id="all-wishes" className="mb-5 text-lg font-bold text-brand-navy md:text-xl">
          {category === "featured" ? "Featured Messages" : "All Messages"} ({filtered.length})
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(category === "featured" ? featured : rest).map((wish) => (
            <li key={wish.id}>
              <WishCard wish={wish} variant={wish.featured ? "featured" : "default"} />
            </li>
          ))}
        </ul>
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-500">
            No messages match your search. Try a different keyword or filter.
          </p>
        )}
      </section>
    </div>
  );
}
