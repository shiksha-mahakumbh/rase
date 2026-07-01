"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  PRESS_PAGE_HERO,
  PRESS_QUICK_LINKS,
  PRESS_STATS,
  filterPressCatalog,
  getFeaturedPressRelease,
  pressImageAlt,
  type PressLocaleFilter,
  type PressReleaseCard,
} from "@/data/press-hub";

const TABS: { id: PressLocaleFilter; label: string }[] = [
  { id: "all", label: "All releases" },
  { id: "en", label: "English" },
  { id: "hi", label: "हिंदी" },
];

type Props = {
  catalog: PressReleaseCard[];
};

export default function PressShowcase({ catalog }: Props) {
  const [filter, setFilter] = useState<PressLocaleFilter>("all");
  const featured = useMemo(() => getFeaturedPressRelease(catalog), [catalog]);
  const filtered = useMemo(() => filterPressCatalog(catalog, filter), [catalog, filter]);
  const gridItems = useMemo(
    () => filtered.filter((c) => c.slug !== featured?.slug),
    [filtered, featured]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Media Centre", href: "/media-center" },
          { label: "Press Releases" },
        ]}
        className="mb-6"
      />

      <HubGradientBanner
        id="press-banner"
        eyebrow={PRESS_PAGE_HERO.eyebrow}
        title={PRESS_PAGE_HERO.title}
        subtitle={PRESS_PAGE_HERO.subtitle}
        stats={PRESS_STATS}
        titleAs="h1"
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PRESS_QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
          >
            <span aria-hidden>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

      <div
        className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Press language filter"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`press-tab-${tab.id}`}
            aria-controls="press-tabpanel"
            aria-selected={filter === tab.id}
            onClick={() => setFilter(tab.id)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition min-h-[44px] ${
              filter === tab.id
                ? "bg-brand-navy text-white shadow-sm"
                : "bg-white text-brand-navy ring-1 ring-slate-200 hover:ring-brand-saffron/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id="press-tabpanel" role="tabpanel" aria-labelledby={`press-tab-${filter}`}>
      {featured && (filter === "all" || featured.locale === filter) && (
        <section className="mt-10" aria-labelledby="featured-press">
          <h2 id="featured-press" className="text-lg font-bold text-brand-navy md:text-xl">
            Featured release
          </h2>
          <FeaturedPressCard release={featured} />
        </section>
      )}

      <section className="mt-10" aria-labelledby="press-releases-grid">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="press-releases-grid" className="text-lg font-bold text-brand-navy md:text-xl">
              Latest press notes
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {filtered.length} official release{filtered.length === 1 ? "" : "s"} — curated, no
              duplicates.
            </p>
          </div>
          <Link
            href="/media-center"
            className="text-sm font-semibold text-brand-blue hover:text-brand-saffron"
          >
            Media Centre →
          </Link>
        </div>

        {gridItems.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
            No releases in this language filter.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridItems.map((release) => (
              <li key={release.id}>
                <PressReleaseCardItem release={release} />
              </li>
            ))}
          </ul>
        )}
      </section>
      </div>
    </div>
  );
}

function FeaturedPressCard({ release }: { release: PressReleaseCard }) {
  const imageAlt = pressImageAlt(release);
  return (
    <article className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-video md:aspect-auto md:min-h-[260px]">
          <Image
            src={release.heroImage}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${release.accent} opacity-40`} />
        </div>
        <div className="flex flex-col p-5 md:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-saffron/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-brand-saffron-dark">
              {release.locale === "hi" ? "हिंदी" : "English"}
            </span>
            {release.edition && (
              <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-brand-navy">
                Edition {release.edition}
              </span>
            )}
          </div>
          <h3 className="mt-3 text-xl font-bold text-brand-navy md:text-2xl">{release.title}</h3>
          <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-slate-600">
            {release.excerpt}
          </p>
          <Link
            href={release.href}
            className="mt-5 inline-flex min-h-[44px] w-fit items-center rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-light"
          >
            Read full release
          </Link>
        </div>
      </div>
    </article>
  );
}

function PressReleaseCardItem({ release }: { release: PressReleaseCard }) {
  const imageAlt = pressImageAlt(release);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-saffron/40 hover:shadow-lg">
      <div className={`h-1.5 bg-gradient-to-r ${release.accent}`} aria-hidden />
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Image
          alt={imageAlt}
          src={release.heroImage}
          fill
          className="object-cover transition group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wide text-brand-saffron-dark">
            {release.locale === "hi" ? "हिंदी" : "English"}
          </span>
          {release.edition && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
              SMK {release.edition}
            </span>
          )}
        </div>
        <h3 className="mt-2 line-clamp-3 text-base font-bold text-brand-navy group-hover:text-brand-blue">
          {release.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
          {release.excerpt}
        </p>
        <Link
          href={release.href}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
        >
          Read release
        </Link>
      </div>
    </article>
  );
}
