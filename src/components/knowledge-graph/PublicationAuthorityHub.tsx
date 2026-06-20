import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
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
import { SITE_URL } from "@/config/site";
import { brandPageHero } from "@/lib/page-heroes";

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
    <PublicPageShell
      hero={brandPageHero(pillar.label, pillar.tagline, "Education Pillar")}
      relatedPath="/publications"
      containerClassName="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16"
    >
      <JsonLd data={collection} />
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbs} />

      <p className="leading-relaxed text-slate-700">{pillar.intro}</p>

      <section className="mt-10" aria-labelledby="pub-types">
        <h2 id="pub-types" className="text-xl font-bold text-brand-navy">
          Publication types
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {PUBLICATION_TYPES.map((t) => (
            <li key={t.id}>
              <Link
                href={t.path}
                className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-saffron/40 hover:shadow-md"
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
    </PublicPageShell>
  );
}
