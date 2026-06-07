import Link from "next/link";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
} from "@/lib/seo/schema";
import { PILLAR_REGISTRY } from "@/lib/knowledge-graph/pillar-registry";
import { ENTITY_DIRECTORIES } from "@/lib/knowledge-graph/entity-directories";
import { getPillarItemListItems } from "@/lib/knowledge-graph/internal-link-engine";
export default function EducationHubPage() {
  const collection = buildCollectionPageSchema({
    name: "Shiksha Mahakumbh Education Ecosystem",
    description:
      "Multi-dimensional education pillars — school, higher, vocational, research, policy, olympiads, awards, conferences, publications, and media.",
    path: "/education",
  });

  const itemList = buildItemListSchema({
    name: "Education pillars",
    items: getPillarItemListItems(),
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Education", path: "/education" },
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
            National Education Ecosystem
          </p>
          <h1 className="mt-2 text-3xl font-bold text-brand-navy md:text-4xl">
            Education at Shiksha Mahakumbh
          </h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-700">
            Shiksha Mahakumbh Abhiyan is a multi-dimensional education movement — not
            only an event platform. Explore pillars spanning school and higher
            education, skills, research, innovation, policy, olympiads, awards,
            conferences, publications, and media.
          </p>
        </header>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {PILLAR_REGISTRY.map((pillar) => (
            <li key={pillar.slug}>
              <Link
                href={pillar.path}
                className="block h-full rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-saffron/40 hover:shadow-md"
              >
                <h2 className="text-lg font-bold text-brand-navy">{pillar.label}</h2>
                <p className="mt-2 text-sm text-slate-600">{pillar.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-12" aria-labelledby="entity-directories">
          <h2 id="entity-directories" className="text-xl font-bold text-brand-navy">
            National directories
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {ENTITY_DIRECTORIES.map((d) => (
              <li key={d.id}>
                <Link
                  href={d.path}
                  className="text-sm font-medium text-brand-navy hover:text-brand-saffron hover:underline"
                >
                  {d.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-center">
          <Link
            href="/knowledge"
            className="text-sm font-semibold text-brand-saffron hover:underline"
          >
            Knowledge Hub →
          </Link>
          <span className="mx-2 text-slate-400">·</span>
          <Link
            href="/registration"
            className="text-sm font-semibold text-brand-saffron hover:underline"
          >
            Registration →
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
