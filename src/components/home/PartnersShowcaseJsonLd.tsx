import JsonLd from "@/components/seo/JsonLd";
import { buildItemListSchema } from "@/lib/seo/schema";
import {
  PARTNER_SHOWCASE_TABS,
  type PartnerShowcaseEntry,
  type PartnerShowcaseTab,
} from "@/lib/cms/partner-showcase";

const MAX_JSONLD_ITEMS_PER_TAB = 40;

function tabItemList(
  tab: PartnerShowcaseTab,
  entries: PartnerShowcaseEntry[],
  listName: string
) {
  const items = entries.slice(0, MAX_JSONLD_ITEMS_PER_TAB).map((entry) => ({
    name: entry.name,
    url: entry.website ?? `#${tab}-partner`,
  }));

  if (items.length === 0) return null;

  const linkedItems = items.filter((item) => item.url.startsWith("http"));
  if (linkedItems.length === 0) return null;

  return buildItemListSchema({ name: listName, items: linkedItems });
}

type Props = {
  grouped: Record<PartnerShowcaseTab, PartnerShowcaseEntry[]>;
};

/** Structured data for homepage partner / affiliation showcase — crawlable org lists */
export default function PartnersShowcaseJsonLd({ grouped }: Props) {
  const schemas = PARTNER_SHOWCASE_TABS.map((tab) => {
    const schema = tabItemList(tab.id, grouped[tab.id], tab.seoHeading);
    return schema ? { id: tab.id, schema } : null;
  }).filter(Boolean) as { id: string; schema: Record<string, unknown> }[];

  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map(({ id, schema }) => (
        <JsonLd key={id} data={schema} />
      ))}
    </>
  );
}
