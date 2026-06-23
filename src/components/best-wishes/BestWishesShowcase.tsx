"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import WishCard from "@/components/best-wishes/WishCard";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  BEST_WISHES_BREADCRUMBS,
  BEST_WISHES_HUB_STATS,
  BEST_WISHES_PAGE_HERO,
  BEST_WISHES_QUICK_LINKS,
  BEST_WISHES_UPCOMING_CTA,
} from "@/data/best-wishes-hub";
import {
  BEST_WISHES_ENTRIES,
  buildWishEditionFilters,
  isInternationalWish,
  type BestWishEntry,
} from "@/data/best-wishes";

type CategoryFilter = "all" | "featured" | "international" | "government" | "academic";

function matchesCategory(wish: BestWishEntry, cat: CategoryFilter) {
  if (cat === "all") return true;
  if (cat === "featured") return Boolean(wish.featured);
  if (cat === "international") return isInternationalWish(wish);
  const d = wish.designation.toLowerCase();
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

function editionFilterLabel(opt: string): string {
  if (opt === "all") return "All editions";
  if (opt === "Abhiyan") return "Abhiyan-wide";
  return `Edition ${opt}`;
}

export default function BestWishesShowcase() {
  const editionFilters = useMemo(() => buildWishEditionFilters(), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [edition, setEdition] = useState<string>("all");

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
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <BreadcrumbNav
        items={BEST_WISHES_BREADCRUMBS.map((item, index, arr) => ({
          label: item.name,
          href: index < arr.length - 1 ? item.path : undefined,
        }))}
        className="-mt-2 mb-6"
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {BEST_WISHES_QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
          >
            <span aria-hidden>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </section>

      <div className="mt-6">
        <HubGradientBanner
          id="best-wishes-hub-banner"
          titleAs="h1"
          eyebrow={BEST_WISHES_PAGE_HERO.eyebrow}
          title={BEST_WISHES_PAGE_HERO.title}
          subtitle={BEST_WISHES_PAGE_HERO.subtitle}
          stats={BEST_WISHES_HUB_STATS}
        />
      </div>

      <section
        className="mt-8 overflow-hidden rounded-2xl border border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 via-white to-brand-saffron/5 p-6 md:p-8"
        aria-labelledby="best-wishes-upcoming-heading"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-saffron">
          Edition 6.0
        </p>
        <h2 id="best-wishes-upcoming-heading" className="mt-2 text-xl font-bold text-brand-navy md:text-2xl">
          {BEST_WISHES_UPCOMING_CTA.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {BEST_WISHES_UPCOMING_CTA.venue} · {BEST_WISHES_UPCOMING_CTA.dates}
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">{BEST_WISHES_UPCOMING_CTA.message}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={BEST_WISHES_UPCOMING_CTA.registrationHref}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
          >
            Register for SMK 6.0
          </Link>
          <Link
            href={BEST_WISHES_UPCOMING_CTA.committeeHref}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-brand-navy/20 bg-white px-6 py-2.5 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40"
          >
            Organising committee
          </Link>
          <Link
            href={BEST_WISHES_UPCOMING_CTA.learnMoreHref}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-brand-saffron bg-brand-saffron/10 px-6 py-2.5 text-sm font-semibold text-brand-navy transition hover:bg-brand-saffron/20"
          >
            Upcoming events
          </Link>
        </div>
      </section>

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
          {editionFilters.map((opt) => (
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
              {editionFilterLabel(opt)}
            </button>
          ))}
        </div>
      </div>

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
          <p
            className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-500"
            role="status"
            aria-live="polite"
          >
            No messages match your search. Try a different keyword or filter.
          </p>
        )}
      </section>
    </div>
  );
}
