import { Suspense } from "react";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import ContentHubClient from "./ContentHubClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";
import { buildArticleJsonLd } from "@/lib/content/jsonLd";
import { CONTENT_REGISTRY } from "@/lib/content/registry";

export default function KnowledgeHubPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shiksha Mahakumbh Knowledge Hub",
    hasPart: CONTENT_REGISTRY.slice(0, 6).map((item) => buildArticleJsonLd(item)),
  };

  return (
    <div className="min-h-screen bg-brand-surface">
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
      <NavBar />
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
          <ContentHubClient />
        </Suspense>

      </main>
      <RelatedContentSection path="/knowledge" title="Related programmes & resources" />
      <Footer />
    </div>
  );
}
