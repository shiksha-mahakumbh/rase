"use client";

import Link from "next/link";
import { VIBHAG_PAGES } from "@/data/vibhag-pages";

interface VibhagRelatedNavProps {
  currentSlug: string;
}

export default function VibhagRelatedNav({ currentSlug }: VibhagRelatedNavProps) {
  const others = VIBHAG_PAGES.filter((p) => p.slug !== currentSlug);

  return (
    <section
      className="border-t border-brand-navy/10 bg-gradient-to-b from-brand-surface to-white px-4 py-10 md:px-8"
      aria-labelledby="vibhag-related-heading"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="vibhag-related-heading"
          className="mb-6 text-center text-xl font-bold text-brand-navy md:text-2xl"
        >
          Other Department Pages
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((page) => (
            <Link
              key={page.slug}
              href={page.path}
              className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-saffron/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-saffron-dark">
                {page.titleHindi}
              </p>
              <p className="mt-1 font-bold text-brand-navy group-hover:text-brand-navy-light">
                {page.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
