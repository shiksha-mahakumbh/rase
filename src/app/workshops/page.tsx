import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import JsonLd from "@/components/seo/JsonLd";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";
import { WORKSHOP_ARCHIVE, WORKSHOPS_HUB } from "@/lib/knowledge-graph/conference-catalog";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: WORKSHOPS_HUB.title,
  description: WORKSHOPS_HUB.description,
  alternates: { canonical: WORKSHOPS_HUB.path },
};

export default function WorkshopsHubPage() {
  const schemas = [
    buildCollectionPageSchema({
      name: WORKSHOPS_HUB.title,
      description: WORKSHOPS_HUB.description,
      path: WORKSHOPS_HUB.path,
    }),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Conferences", path: "/conferences" },
      { name: "Workshops", path: WORKSHOPS_HUB.path },
    ]),
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
          <span className="font-medium text-brand-navy">Workshops</span>
        </nav>
        <h1 className="mt-6 text-3xl font-bold text-brand-navy">{WORKSHOPS_HUB.title}</h1>
        <p className="mt-4 text-slate-700">{WORKSHOPS_HUB.description}</p>
        <ul className="mt-8 space-y-2">
          {WORKSHOP_ARCHIVE.map((r) => (
            <li key={r.path}>
              <Link href={r.path} className="font-medium text-brand-navy hover:underline">
                {r.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/proceedings" className="font-medium text-brand-saffron hover:underline">
              Proceedings
            </Link>
          </li>
        </ul>
      </main>
      <RelatedContentSection path={WORKSHOPS_HUB.path} title="Related in the RASE network" />
      <Footer />
    </div>
  );
}
