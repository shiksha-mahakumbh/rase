"use client";

import { useState, type ReactNode } from "react";

export type DigitalMediaItem = {
  name: string;
  url: string;
  description: string;
};

export type DigitalMediaSection = {
  title: string;
  items: readonly DigitalMediaItem[];
};

type Props = {
  sections: readonly DigitalMediaSection[];
  pageTitle?: string;
  intro?: ReactNode;
  initialCount?: number;
  className?: string;
};

function MediaCard({ item }: { item: DigitalMediaItem }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-saffron/30 hover:shadow-md">
      <div className="flex min-h-[7rem] items-center justify-center bg-brand-navy px-4 py-5">
        <h2 className="text-center text-base font-bold leading-snug text-white md:text-lg">
          {item.name}
        </h2>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-saffron px-4 py-2 text-sm font-bold text-brand-navy transition hover:bg-brand-saffron-dark hover:text-white"
        >
          Visit source
        </a>
      </div>
    </article>
  );
}

/** Lightweight digital media grid — no antd / framer-motion. */
export default function DigitalMediaArchiveGrid({
  sections,
  pageTitle,
  intro,
  initialCount = 8,
  className = "bg-slate-50 p-4 md:p-8",
}: Props) {
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  return (
    <div className={className}>
      {pageTitle ? (
        <h1 className="mb-4 text-center text-2xl font-bold text-brand-navy md:text-3xl">
          {pageTitle}
        </h1>
      ) : null}
      {intro ? <div className="mx-auto mb-8 max-w-3xl text-center text-slate-600">{intro}</div> : null}

      {sections.map((section, sectionIndex) => {
        const expanded = expandedSections[sectionIndex] ?? false;
        const visible = expanded ? section.items : section.items.slice(0, initialCount);
        const hasMore = section.items.length > initialCount;

        return (
          <section
            key={section.title}
            className={sectionIndex > 0 ? "mt-10 border-t border-slate-200 pt-10" : undefined}
            aria-labelledby={`digital-section-${sectionIndex}`}
          >
            <h2
              id={`digital-section-${sectionIndex}`}
              className="mb-6 text-xl font-bold text-brand-navy md:text-2xl"
            >
              {section.title}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((item) => (
                <li key={item.url}>
                  <MediaCard item={item} />
                </li>
              ))}
            </ul>
            {hasMore ? (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      [sectionIndex]: !expanded,
                    }))
                  }
                  className="inline-flex min-h-[44px] items-center rounded-xl border border-brand-blue/25 bg-white px-6 py-2.5 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/5"
                >
                  {expanded
                    ? "Show less"
                    : `Show all (${section.items.length})`}
                </button>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
