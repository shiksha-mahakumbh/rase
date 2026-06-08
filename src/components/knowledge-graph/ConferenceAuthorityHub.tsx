import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
} from "@/lib/seo/schema";
import {
  CONFERENCE_YEAR_ARCHIVE,
  EVENT_HUB_ROUTES,
  SUMMIT_ROUTES,
  WORKSHOP_ARCHIVE,
} from "@/lib/knowledge-graph/conference-catalog";
import { getPillarEntry } from "@/lib/knowledge-graph/pillar-registry";
import { SITE_URL } from "@/config/site";

export default function ConferenceAuthorityHub() {
  const pillar = getPillarEntry("conferences")!;

  const collection = buildCollectionPageSchema({
    name: "Conferences & Summits",
    description: pillar.intro,
    path: "/conferences",
  });

  const itemList = buildItemListSchema({
    name: "Conference authority network",
    items: [
      { name: "Events", url: `${SITE_URL}/events` },
      { name: "Summits", url: `${SITE_URL}/summits` },
      { name: "Workshops", url: `${SITE_URL}/workshops` },
      { name: "Proceedings", url: `${SITE_URL}/proceedings` },
      ...CONFERENCE_YEAR_ARCHIVE.flatMap((y) =>
        y.routes.map((r) => ({ name: `${y.label} — ${r.label}`, url: `${SITE_URL}${r.path}` }))
      ),
    ],
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Education", path: "/education" },
    { name: "Conferences", path: "/conferences" },
  ]);

  return (
    <PublicPageShell
      hero={{
        eyebrow: "Education Pillar",
        title: pillar.label,
        subtitle: pillar.tagline,
        accent: "saffron",
      }}
      relatedPath="/conferences"
      containerClassName="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16"
    >
      <JsonLd data={collection} />
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbs} />

      <p className="leading-relaxed text-slate-700">{pillar.intro}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/events", label: "Events" },
          { href: "/summits", label: "Summits" },
          { href: "/workshops", label: "Workshops" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-center font-bold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-md"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="by-year">
        <h2 id="by-year" className="text-xl font-bold text-brand-navy">
          Editions by year
        </h2>
        {CONFERENCE_YEAR_ARCHIVE.map((edition) => (
          <div key={edition.year} className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-bold text-brand-navy">
              {edition.year} — {edition.label}
            </h3>
            <ul className="mt-3 space-y-1">
              {edition.routes.map((r) => (
                <li key={r.path}>
                  <Link href={r.path} className="text-sm text-brand-navy hover:text-brand-saffron hover:underline">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-10" aria-labelledby="summits-list">
        <h2 id="summits-list" className="text-lg font-bold text-brand-navy">
          Summit programmes
        </h2>
        <ul className="mt-3 space-y-2">
          {SUMMIT_ROUTES.map((r) => (
            <li key={r.path}>
              <Link href={r.path} className="font-medium text-brand-navy hover:text-brand-saffron hover:underline">
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="workshops-list">
        <h2 id="workshops-list" className="text-lg font-bold text-brand-navy">
          Workshop archive
        </h2>
        <ul className="mt-3 space-y-2">
          {WORKSHOP_ARCHIVE.map((r) => (
            <li key={r.path}>
              <Link href={r.path} className="font-medium text-brand-navy hover:text-brand-saffron hover:underline">
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-labelledby="events-list">
        <h2 id="events-list" className="text-lg font-bold text-brand-navy">
          Event calendar
        </h2>
        <ul className="mt-3 space-y-2">
          {EVENT_HUB_ROUTES.map((r) => (
            <li key={r.path}>
              <Link href={r.path} className="font-medium text-brand-navy hover:text-brand-saffron hover:underline">
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8">
        <Link href="/proceedings" className="font-semibold text-brand-saffron hover:underline">
          View proceedings →
        </Link>
      </p>
    </PublicPageShell>
  );
}
