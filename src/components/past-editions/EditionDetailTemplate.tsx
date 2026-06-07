import Link from "next/link";
import type { PastEditionRecord } from "@/data/past-editions";

type Props = {
  edition: PastEditionRecord;
  /** Optional extra body copy from legacy microsite */
  children?: React.ReactNode;
};

export default function EditionDetailTemplate({ edition, children }: Props) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="text-sm text-slate-600">
        <Link href="/pastevent" className="hover:text-brand-saffron">
          Past Editions
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-brand-navy">{edition.title}</span>
      </nav>

      <header className="mt-6 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-navy-light p-8 text-white">
        <span className="rounded-full bg-brand-saffron px-3 py-1 text-xs font-bold text-brand-navy">
          Edition {edition.edition}
        </span>
        <h1 className="mt-4 text-3xl font-bold">{edition.title}</h1>
        <p className="mt-2 text-lg text-white/90">{edition.venueFull}</p>
        <p className="mt-1 text-white/80">{edition.dates}</p>
        <p className="mt-4 font-semibold text-brand-saffron">Theme: {edition.theme}</p>
      </header>

      <section className="mt-8 space-y-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-navy">Core Essence (Mool Tatva)</h2>
          <p className="mt-2 text-slate-700">{edition.coreEssence}</p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-navy">Impact &amp; Outcomes</h2>
          <p className="mt-2 text-slate-700">{edition.impact}</p>
        </div>
        {children}
      </section>

      {edition.galleryUrl ? (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-brand-navy">Gallery</h2>
          <p className="mt-2 text-slate-600">
            Photographs from {edition.title} at {edition.venue}.
          </p>
          <a
            href={edition.galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-semibold text-brand-saffron hover:underline"
          >
            Open full photo archive on Google Drive →
          </a>
        </section>
      ) : null}

      <p className="mt-10">
        <Link href="/pastevent" className="font-semibold text-brand-navy hover:underline">
          ← All past editions
        </Link>
      </p>
    </main>
  );
}
