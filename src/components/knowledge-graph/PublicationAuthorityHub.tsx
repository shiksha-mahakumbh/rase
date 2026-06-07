import Link from "next/link";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
} from "@/lib/seo/schema";
import {
  LEGACY_PUBLICATION_ROUTES,
  PUBLICATION_TYPES,
} from "@/lib/knowledge-graph/publication-catalog";
import { getPillarEntry } from "@/lib/knowledge-graph/pillar-registry";
import RelatedContentSection from "./RelatedContentSection";
import { SITE_URL } from "@/config/site";

export default function PublicationAuthorityHub() {
  const pillar = getPillarEntry("publications")!;

  const collection = buildCollectionPageSchema({
    name: "Publications — Shiksha Mahakumbh",
    description: pillar.intro,
    path: "/publications",
  });

  const items = [
    ...PUBLICATION_TYPES.map((t) => ({
      name: t.label,
      url: `${SITE_URL}${t.path}`,
    })),
    ...LEGACY_PUBLICATION_ROUTES.map((r) => ({
      name: r.label,
      url: `${SITE_URL}${r.path}`,
    })),
  ];

  const itemList = buildItemListSchema({
    name: "Publication types & volumes",
    items,
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Education", path: "/education" },
    { name: "Publications", path: "/publications" },
  ]);

  return (
    <div className="min-h-screen bg-brand-surface">
      <JsonLd data={collection} />
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbs} />
      <NavBar />
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-saffron">
            Authority hub
          </p>
          <h1 className="mt-2 text-3xl font-bold text-brand-navy">{pillar.label}</h1>
          <p className="mt-2 text-lg text-slate-600">{pillar.tagline}</p>
          <p className="mt-4 text-slate-700">{pillar.intro}</p>
        </header>

        <section className="mt-10" aria-labelledby="pub-types">
          <h2 id="pub-types" className="text-xl font-bold text-brand-navy">
            Publication types
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {PUBLICATION_TYPES.map((t) => (
              <li key={t.id}>
                <Link
                  href={t.path}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-saffron/40"
                >
                  <h3 className="font-bold text-brand-navy">{t.label}</h3>
                  <p className="mt-2 text-sm text-slate-600">{t.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="legacy-pub">
          <h2 id="legacy-pub" className="text-xl font-bold text-brand-navy">
            Proceedings &amp; volumes
          </h2>
          <ul className="mt-4 space-y-2">
            {LEGACY_PUBLICATION_ROUTES.map((r) => (
              <li key={r.path}>
                <Link
                  href={r.path}
                  className="font-medium text-brand-navy hover:text-brand-saffron hover:underline"
                >
                  {r.label}
                </Link>
                <span className="ml-2 text-xs text-slate-500">{r.year}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <RelatedContentSection path="/publications" />
      <Footer />
    </div>
  );
}
