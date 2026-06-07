import Link from "next/link";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildDatasetSchema,
  buildScholarlyArticleSchema,
} from "@/lib/seo/schema";
import type { PublicationTypeEntry } from "@/lib/knowledge-graph/publication-catalog";
import RelatedContentSection from "./RelatedContentSection";

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
    <div className="min-h-screen bg-brand-surface">
      <JsonLd data={collection} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={datasetPlaceholder} />
      {scholarlyCatalogue ? <JsonLd data={scholarlyCatalogue} /> : null}
      <NavBar />
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <nav className="text-sm text-slate-600">
          <Link href="/publications" className="hover:text-brand-saffron">
            Publications
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-brand-navy">{entry.label}</span>
        </nav>
        <h1 className="mt-6 text-3xl font-bold text-brand-navy">{entry.label}</h1>
        <p className="mt-4 text-slate-700">{entry.description}</p>
        <p className="mt-4 text-sm text-slate-500">
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
      </main>
      <RelatedContentSection path={entry.path} />
      <Footer />
    </div>
  );
}
