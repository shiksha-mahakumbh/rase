import Link from "next/link";
import Image from "next/image";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  PUBLICATIONS_PAGE_HERO,
  PUBLICATIONS_STATS,
} from "@/data/publications-hub";
import { LEGACY_PUBLICATION_ROUTES } from "@/lib/knowledge-graph/publication-catalog";
import { DHE_JOURNALS_URL } from "@/lib/knowledge-graph/site-cleanup";
import { CONTENT_REGISTRY, getCategoryLabel } from "@/lib/content/registry";
import { PROCEEDINGS_CATALOG } from "@/data/proceedings-hub";

export default function PublicationsShowcase() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <HubGradientBanner
        id="publications-banner"
        eyebrow={PUBLICATIONS_PAGE_HERO.eyebrow}
        title={PUBLICATIONS_PAGE_HERO.title}
        subtitle={PUBLICATIONS_PAGE_HERO.subtitle}
        stats={PUBLICATIONS_STATS}
      />

      <section className="mt-10" aria-labelledby="proceedings-volumes">
        <h2 id="proceedings-volumes" className="text-lg font-bold text-brand-navy md:text-xl">
          Proceedings volumes
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Peer-reviewed paper compilations from national Shiksha Mahakumbh conferences.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROCEEDINGS_CATALOG.map((volume) => (
            <article
              key={volume.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className={`h-1.5 bg-gradient-to-r ${volume.accent}`} aria-hidden />
              <div className="relative aspect-[16/10] bg-slate-100">
                <Image
                  src={volume.coverSrc}
                  alt={volume.coverAlt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-brand-navy/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-navy">
                    Vol. {volume.volume}
                  </span>
                  {volume.edition && (
                    <span className="rounded-full bg-brand-saffron/15 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-saffron-dark">
                      Edition {volume.edition}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-bold text-brand-navy">{volume.theme}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {volume.paperCount} papers · {volume.year}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-4">
                  <Link
                    href={volume.readHref}
                    className="rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-navy-light"
                  >
                    Read online
                  </Link>
                  <a
                    href={volume.pdfHref}
                    download
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-brand-navy hover:border-brand-saffron/40"
                  >
                    PDF
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4">
          <Link href="/proceedings" className="text-sm font-semibold text-brand-blue hover:text-brand-saffron">
            View all proceedings →
          </Link>
        </p>
      </section>

      <section className="mt-10" aria-labelledby="pub-routes">
        <h2 id="pub-routes" className="text-lg font-bold text-brand-navy md:text-xl">
          Books &amp; journals
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LEGACY_PUBLICATION_ROUTES.filter((r) => !r.href.startsWith("/proceeding")).map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-saffron/40 hover:shadow-md"
              >
                <span className="font-bold text-brand-navy group-hover:text-brand-blue">{r.label}</span>
                <span className="mt-1 text-xs text-slate-500">{r.year}</span>
                <span className="mt-auto pt-3 text-xs font-semibold text-brand-saffron">
                  {r.external ? "Open platform ↗" : "Browse →"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="research-resources">
        <h2 id="research-resources" className="text-lg font-bold text-brand-navy md:text-xl">
          Research &amp; programme resources
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {CONTENT_REGISTRY.map((item) => {
            const external = item.href.startsWith("http");
            return (
              <li key={item.slug}>
                <Link
                  href={item.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-saffron/40 hover:shadow-md"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wide text-brand-saffron-dark">
                    {getCategoryLabel(item.category)}
                  </span>
                  <span className="mt-1 block font-bold text-brand-navy group-hover:text-brand-blue">
                    {item.title}
                    {external && <span className="ml-1 text-xs font-normal text-slate-400">↗</span>}
                  </span>
                  <span className="mt-2 block text-sm text-slate-600">{item.excerpt}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        Official journal platform:{" "}
        <a
          href={DHE_JOURNALS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand-blue hover:underline"
        >
          pub.dhe.org.in
        </a>
        {" "}— open access for researchers and institutions globally.
      </p>
    </div>
  );
}
