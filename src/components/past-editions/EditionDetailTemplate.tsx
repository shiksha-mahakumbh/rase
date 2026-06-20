import Link from "next/link";
import type { PastEditionRecord } from "@/data/past-editions";

type Props = {
  edition: PastEditionRecord;
  /** Optional extra body copy from legacy microsite */
  children?: React.ReactNode;
};

export default function EditionDetailTemplate({ edition, children }: Props) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <nav className="text-sm text-slate-600">
        <Link href="/past-events" className="font-semibold text-brand-blue hover:text-brand-saffron">
          Past Editions
        </Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="font-medium text-brand-navy">{edition.title}</span>
      </nav>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-brand-saffron px-3 py-1 text-xs font-bold text-brand-navy">
          Edition {edition.edition}
        </span>
        <span className="rounded-lg bg-brand-blue/10 px-3 py-1 text-xs font-semibold text-brand-blue">
          {edition.venue}
        </span>
        <span className="rounded-lg bg-brand-saffron/10 px-3 py-1 text-xs font-semibold text-brand-saffron-dark">
          {edition.dates}
        </span>
      </div>

      <p className="text-lg font-semibold text-brand-navy">
        Theme: <span className="text-brand-saffron-dark">{edition.theme}</span>
      </p>

      <section className="space-y-6">
        <div className="rounded-2xl border border-brand-saffron/15 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-navy">Core Essence (Mool Tatva)</h2>
          <p className="mt-2 text-slate-700">{edition.coreEssence}</p>
        </div>
        <div className="rounded-2xl border border-brand-blue/15 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-navy">Impact &amp; Outcomes</h2>
          <p className="mt-2 text-slate-700">{edition.impact}</p>
        </div>
        {children}
      </section>

      {edition.galleryUrl ? (
        <section className="rounded-2xl border border-slate-200 bg-brand-surface-warm p-6">
          <h2 className="text-xl font-bold text-brand-navy">Gallery</h2>
          <p className="mt-2 text-slate-600">
            Photographs from {edition.title} at {edition.venue}.
          </p>
          <a
            href={edition.galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-brand-saffron px-5 py-2.5 text-sm font-bold text-brand-navy hover:bg-brand-saffron-dark hover:text-white"
          >
            Open full photo archive →
          </a>
        </section>
      ) : null}

      <p>
        <Link
          href="/past-events"
          className="font-semibold text-brand-blue hover:text-brand-saffron"
        >
          ← All past editions
        </Link>
      </p>
    </div>
  );
}
