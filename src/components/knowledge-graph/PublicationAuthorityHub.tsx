import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import PublicationsShowcase from "@/components/publications/PublicationsShowcase";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
} from "@/lib/seo/schema";
import { LEGACY_PUBLICATION_ROUTES } from "@/lib/knowledge-graph/publication-catalog";
import { getPillarEntry } from "@/lib/knowledge-graph/pillar-registry";
import { CONTENT_REGISTRY } from "@/lib/content/registry";
import { SITE_URL } from "@/config/site";

export default function PublicationAuthorityHub() {
  const pillar = getPillarEntry("publications")!;

  const items = [
    ...LEGACY_PUBLICATION_ROUTES.map((r) => ({
      name: r.label,
      url: r.external ? r.href : `${SITE_URL}${r.href}`,
    })),
    ...CONTENT_REGISTRY.map((r) => ({
      name: r.title,
      url: r.href.startsWith("http") ? r.href : `${SITE_URL}${r.href}`,
    })),
  ];

  const collection = buildCollectionPageSchema({
    name: "Publications & Research — Shiksha Mahakumbh",
    description: pillar.intro,
    path: "/publications",
  });

  const itemList = buildItemListSchema({
    name: "Publications & research resources",
    items,
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Publications", path: "/publications" },
  ]);

  return (
    <PublicPageShell
      showHero={false}
      relatedPath="/publications"
      showCta={false}
      skipContainer
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Publications", path: "/publications" },
      ]}
    >
      <JsonLd data={collection} />
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbs} />
      <PublicationsShowcase />
    </PublicPageShell>
  );
}
