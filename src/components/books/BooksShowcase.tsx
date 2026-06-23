import Image from "next/image";
import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  BOOK_CATALOG,
  BOOKS_EDITION_NOTE,
  BOOKS_PAGE_HERO,
  BOOKS_RELATED_PUBLICATIONS,
  BOOKS_STATS,
} from "@/data/books-hub";

export default function BooksShowcase() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Publications", href: "/publications" },
          { label: "Books" },
        ]}
        className="mb-6"
      />

      <HubGradientBanner
        id="books-banner"
        eyebrow={BOOKS_PAGE_HERO.eyebrow}
        title={BOOKS_PAGE_HERO.title}
        subtitle={BOOKS_PAGE_HERO.subtitle}
        stats={BOOKS_STATS}
        titleAs="h1"
      />

      <section className="mt-10" aria-labelledby="books-catalog">
        <h2 id="books-catalog" className="text-lg font-bold text-brand-navy md:text-xl">
          Published titles
        </h2>
        <div className="mt-5 grid gap-6">
          {BOOK_CATALOG.map((book) => (
            <article
              key={book.id}
              id={book.id}
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className={`h-1.5 bg-gradient-to-r ${book.accent}`} aria-hidden />
              <div className="grid gap-6 p-5 md:grid-cols-[220px_1fr] md:p-8">
                <div className="mx-auto w-full max-w-[220px]">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-brand-surface-warm/60 p-2 shadow-md">
                    <Image
                      src={book.coverSrc}
                      alt={book.coverAlt}
                      fill
                      sizes="220px"
                      className="object-contain p-1"
                      priority
                    />
                    {!book.previewHref && (
                      <div className="absolute inset-x-0 bottom-0 bg-brand-navy/85 px-3 py-2 text-center text-[11px] font-semibold text-white">
                        Preview coming soon
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-navy">
                      Edition {book.edition}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-saffron-dark">
                      {book.year}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-brand-navy md:text-2xl">{book.title}</h3>
                  <dl className="mt-3 space-y-1 text-sm text-slate-600">
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="font-semibold text-brand-navy">Venue</dt>
                      <dd>{book.venue}</dd>
                    </div>
                    <div className="flex flex-wrap gap-x-2">
                      <dt className="font-semibold text-brand-navy">Dates</dt>
                      <dd>{book.dates}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700 md:text-base">
                    {book.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {book.previewHref ? (
                      <a
                        href={book.previewHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-brand-navy px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-navy-light"
                      >
                        View preview
                      </a>
                    ) : (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-500">
                        Preview coming soon
                      </span>
                    )}
                    <Link
                      href={book.purchaseHref}
                      className="rounded-full bg-brand-saffron px-5 py-2.5 text-sm font-bold text-brand-navy transition hover:bg-brand-saffron-dark hover:text-white"
                    >
                      Request a copy
                    </Link>
                    {book.pastEventHref && (
                      <Link
                        href={book.pastEventHref}
                        className="rounded-full border border-brand-blue/25 px-5 py-2.5 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/5"
                      >
                        Edition {book.edition} details
                      </Link>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    ISBN, publisher, and author details will be published when confirmed.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="books-related">
        <h2 id="books-related" className="text-lg font-bold text-brand-navy md:text-xl">
          Related publications
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {BOOKS_RELATED_PUBLICATIONS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-saffron/40 hover:shadow-sm"
              >
                <span className="text-sm font-bold text-brand-navy">{link.label}</span>
                <span className="mt-1 text-xs text-slate-600">{link.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <aside className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-sm text-slate-600 md:px-6 md:py-5">
        <p className="font-semibold text-brand-navy">More editions</p>
        <p className="mt-1">{BOOKS_EDITION_NOTE}</p>
        <Link href="/publications" className="mt-3 inline-block text-sm font-semibold text-brand-blue hover:underline">
          Browse all publications →
        </Link>
      </aside>
    </div>
  );
}
