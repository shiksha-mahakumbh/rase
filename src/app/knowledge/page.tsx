import { Suspense } from "react";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import ContentHubClient from "./ContentHubClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { buildArticleJsonLd } from "@/lib/content/jsonLd";
import { CONTENT_REGISTRY } from "@/lib/content/registry";

const PAGE_HERO = {
  eyebrow: "Knowledge Hub",
  title: "Research & Resources",
  subtitle:
    "Proceedings, publications, policy papers, and programme archives from the national education movement.",
  accent: "navy" as const,
};

export default function KnowledgeHubPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shiksha Mahakumbh Knowledge Hub",
    hasPart: CONTENT_REGISTRY.slice(0, 6).map((item) => buildArticleJsonLd(item)),
  };

  return (
    <PublicPageShell
      hero={PAGE_HERO}
      relatedPath="/knowledge"
      containerClassName="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16"
    >
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Knowledge Hub", path: "/knowledge" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
        <ContentHubClient />
      </Suspense>
    </PublicPageShell>
  );
}
