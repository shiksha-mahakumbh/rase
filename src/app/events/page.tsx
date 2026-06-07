import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import JsonLd from "@/components/seo/JsonLd";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";
import {
  CONFERENCE_YEAR_ARCHIVE,
  EVENT_HUB_ROUTES,
  EVENTS_HUB,
} from "@/lib/knowledge-graph/conference-catalog";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: EVENTS_HUB.title,
  description: EVENTS_HUB.description,
  alternates: { canonical: EVENTS_HUB.path },
};

export default function EventsHubPage() {
  const schemas = [
    buildCollectionPageSchema({
      name: EVENTS_HUB.title,
      description: EVENTS_HUB.description,
      path: EVENTS_HUB.path,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Conferences", path: "/conferences" },
      { name: "Events", path: EVENTS_HUB.path },
    ]),
    buildItemListSchema({
      name: "Event programmes",
      items: [
        ...EVENT_HUB_ROUTES.map((r) => ({
          name: r.label,
          url: `${SITE_URL}${r.path}`,
        })),
        ...CONFERENCE_YEAR_ARCHIVE.flatMap((y) =>
          y.routes.map((r) => ({
            name: `${y.year} — ${r.label}`,
            url: `${SITE_URL}${r.path}`,
          }))
        ),
      ],
    }),
  ];

  return (
    <div className="min-h-screen bg-brand-surface">
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <NavBar />
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <nav className="text-sm text-slate-600">
          <Link href="/conferences" className="hover:text-brand-saffron">
            Conferences
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-brand-navy">Events</span>
        </nav>
        <h1 className="mt-6 text-3xl font-bold text-brand-navy">{EVENTS_HUB.title}</h1>
        <p className="mt-4 text-slate-700">{EVENTS_HUB.description}</p>

        <section className="mt-8" aria-labelledby="event-routes">
          <h2 id="event-routes" className="text-lg font-bold text-brand-navy">
            Event calendar
          </h2>
          <ul className="mt-3 space-y-2">
            {EVENT_HUB_ROUTES.map((r) => (
              <li key={r.path}>
                <Link href={r.path} className="font-medium text-brand-navy hover:underline">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="by-year">
          <h2 id="by-year" className="text-lg font-bold text-brand-navy">
            Editions by year
          </h2>
          {CONFERENCE_YEAR_ARCHIVE.map((edition) => (
            <div key={edition.year} className="mt-4 rounded-2xl border bg-white p-4">
              <h3 className="font-bold text-brand-navy">
                {edition.year} — {edition.label}
              </h3>
              <ul className="mt-2 space-y-1">
                {edition.routes.map((r) => (
                  <li key={r.path}>
                    <Link href={r.path} className="text-sm hover:underline">
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
      <RelatedContentSection path={EVENTS_HUB.path} title="Related in the RASE network" />
      <Footer />
    </div>
  );
}
