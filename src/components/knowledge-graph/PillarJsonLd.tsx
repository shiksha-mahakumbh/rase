import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo/schema";
import { getRelatedLinksForPillar } from "@/lib/knowledge-graph/internal-link-engine";
import type { PillarRegistryEntry } from "@/lib/knowledge-graph/pillar-registry";
import { SITE_URL } from "@/config/site";

export default function PillarJsonLd({ entry }: { entry: PillarRegistryEntry }) {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Education", path: "/education" },
    { name: entry.label, path: entry.path },
  ]);

  const webPage = buildWebPageSchema({
    name: entry.label,
    description: entry.intro,
    path: entry.path,
  });

  const related = getRelatedLinksForPillar(entry.id, 6);
  const itemList =
    related.length > 0
      ? buildItemListSchema({
          name: `${entry.label} — related programmes`,
          items: related.map((l) => ({
            name: l.label,
            url: l.href.startsWith("http") ? l.href : `${SITE_URL}${l.href}`,
          })),
        })
      : null;

  const schemas = [breadcrumbs, webPage, itemList].filter(Boolean) as Record<
    string,
    unknown
  >[];

  return (
    <>
      {schemas.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
    </>
  );
}
