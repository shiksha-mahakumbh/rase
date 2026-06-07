import JsonLd from "@/components/seo/JsonLd";
import { buildItemListSchema } from "@/lib/seo/schema";
import { getPillarItemListItems } from "@/lib/knowledge-graph/internal-link-engine";

/** Supplemental ItemList for education pillars — no duplicate Organization/Event */
export default function HomeEcosystemJsonLd() {
  const itemList = buildItemListSchema({
    name: "Shiksha Mahakumbh Education Pillars",
    items: [
      { name: "Education Ecosystem", url: "/education" },
      ...getPillarItemListItems(),
    ],
  });

  return <JsonLd data={itemList} />;
}
