import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildProfilePageSchema,
  buildResearchProjectSchema,
} from "@/lib/seo/schema";
import type { EntityDirectoryConfig } from "@/lib/knowledge-graph/entity-directories";
import { ENTITY_DIRECTORIES } from "@/lib/knowledge-graph/entity-directories";
import { ENTITY_LANDING_REGISTRY } from "@/lib/knowledge-graph/entities/landing-framework";
import InternalLinksBlock from "./InternalLinksBlock";
import { getInternalLinksForPath } from "@/lib/knowledge-graph/internal-link-engine";
import { SITE_URL } from "@/config/site";
import { brandPageHero } from "@/lib/page-heroes";

type Props = {
  directory: EntityDirectoryConfig;
};

export default function EntityDirectoryTemplate({ directory }: Props) {
  const entries = ENTITY_LANDING_REGISTRY.filter(
    (e) =>
      e.path.startsWith(directory.path) ||
      (directory.id === "people" && e.type === "person") ||
      (directory.id === "educational-leaders" && e.type === "person")
  );

  const related = getInternalLinksForPath(directory.path, 6);

  const collection = buildCollectionPageSchema({
    name: directory.label,
    description: directory.description,
    path: directory.path,
  });

  const profilePage = buildProfilePageSchema({
    name: `${directory.label} Directory`,
    description: directory.description,
    path: directory.path,
  });

  const itemList = buildItemListSchema({
    name: `${directory.label} — indexed entries`,
    items: entries.length
      ? entries.map((e) => ({ name: e.label, url: `${SITE_URL}${e.path}` }))
      : ENTITY_DIRECTORIES.map((d) => ({
          name: d.label,
          url: `${SITE_URL}${d.path}`,
        })),
  });

  const researchProject =
    directory.id === "research-projects"
      ? buildResearchProjectSchema({
          name: directory.label,
          description: directory.description,
          path: directory.path,
        })
      : null;

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Education", path: "/education" },
    { name: directory.label, path: directory.path },
  ]);

  return (
    <PublicPageShell
      hero={brandPageHero(directory.label, directory.description, "National Directory")}
      relatedPath={directory.path}
      containerClassName="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16"
    >
      <JsonLd data={collection} />
      <JsonLd data={profilePage} />
      {researchProject ? <JsonLd data={researchProject} /> : null}
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbs} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
        <Link href="/education" className="hover:text-brand-saffron">
          Education
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-brand-navy">{directory.label}</span>
      </nav>

      <p className="mt-6 text-sm text-slate-500">
        Entity profiles will be published here as the national directory expands.
      </p>

      {entries.length > 0 ? (
        <ul className="mt-8 space-y-3">
          {entries.map((e) => (
            <li key={e.slug}>
              <Link
                href={e.path}
                className="font-medium text-brand-navy hover:text-brand-saffron hover:underline"
              >
                {e.label}
              </Link>
              <span className="ml-2 text-xs text-slate-500">({e.status})</span>
            </li>
          ))}
        </ul>
      ) : (
        <section className="mt-8" aria-labelledby="other-directories">
          <h2 id="other-directories" className="text-lg font-bold text-brand-navy">
            Explore directories
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {ENTITY_DIRECTORIES.filter((d) => d.id !== directory.id).map((d) => (
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
      )}

      <div className="mt-10">
        <InternalLinksBlock title="Related programmes" links={related} />
      </div>
    </PublicPageShell>
  );
}
