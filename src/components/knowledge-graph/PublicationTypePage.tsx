import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildDatasetSchema,
  buildScholarlyArticleSchema,
} from "@/lib/seo/schema";
import type { PublicationTypeEntry } from "@/lib/knowledge-graph/publication-catalog";
import { brandPageHero } from "@/lib/page-heroes";

type Props = { entry: PublicationTypeEntry };

export default function PublicationTypePage({ entry }: Props) {
  const collection = buildCollectionPageSchema({
    name: entry.label,
    description: entry.description,
    path: entry.path,
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Publications", path: "/publications" },
    { name: entry.label, path: entry.path },
  ]);

  const datasetPlaceholder = buildDatasetSchema({
    name: `${entry.label} catalogue`,
    description: entry.description,
    path: entry.path,
  });

  const scholarlyCatalogue =
    entry.id === "research-papers"
      ? buildScholarlyArticleSchema({
          headline: `${entry.label} catalogue`,
          description: entry.description,
          path: entry.path,
        })
      : null;

  return (
    <PublicPageShell
      hero={brandPageHero(entry.label, entry.description, "Publications")}
      relatedPath={entry.path}
      containerClassName="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16"
    >
      <JsonLd data={collection} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={datasetPlaceholder} />
      {scholarlyCatalogue ? <JsonLd data={scholarlyCatalogue} /> : null}

      <nav className="text-sm text-slate-600" aria-label="Breadcrumb">
        <Link href="/publications" className="hover:text-brand-saffron">
          Publications
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-brand-navy">{entry.label}</span>
      </nav>

      <p className="mt-6 text-sm text-slate-500">
        Indexed publications will appear here. Browse existing{" "}
        <Link href="/proceedings" className="font-semibold text-brand-saffron hover:underline">
          proceedings
        </Link>{" "}
        and{" "}
        <Link href="/journals" className="font-semibold text-brand-saffron hover:underline">
          journals
        </Link>{" "}
        in the meantime.
      </p>
    </PublicPageShell>
  );
}
