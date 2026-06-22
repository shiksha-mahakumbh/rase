import JsonLd from "@/components/seo/JsonLd";
import {
  MEDIA_CENTER_CANONICAL_URL,
  MEDIA_CENTER_PAGE_HERO,
  MEDIA_EDITION_CARDS,
  MEDIA_QUICK_LINKS,
  dedupeMediaCenterItems,
} from "@/data/media-center-hub";
import { SITE_URL } from "@/config/site";
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildItemListSchema } from "@/lib/seo/schema";
import type { CmsMediaCenterItem } from "@/lib/cms/types";

type Props = {
  cmsItems?: CmsMediaCenterItem[];
};

export default function MediaCenterJsonLd({ cmsItems = [] }: Props) {
  const collection = buildCollectionPageSchema({
    name: "Shiksha Mahakumbh Media Centre",
    description: MEDIA_CENTER_PAGE_HERO.subtitle,
    path: "/media-center",
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Media Centre", path: "/media-center" },
  ]);

  const editionList = buildItemListSchema({
    name: "Edition media archives",
    items: MEDIA_EDITION_CARDS.map((e) => ({
      name: `${e.title} — ${e.venue}`,
      url: `${SITE_URL}${e.eventHref}`,
    })),
  });

  const hubList = buildItemListSchema({
    name: "Media resources",
    items: [
      ...MEDIA_QUICK_LINKS.map((l) => ({
        name: l.label,
        url: l.href.startsWith("http") ? l.href : `${SITE_URL}${l.href}`,
      })),
      ...dedupeMediaCenterItems(cmsItems).slice(0, 12).map((i) => ({
        name: i.title,
        url: i.href.startsWith("http") ? i.href : `${SITE_URL}${i.href}`,
      })),
    ],
  });

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: MEDIA_CENTER_PAGE_HERO.title,
    description: MEDIA_CENTER_PAGE_HERO.subtitle,
    url: MEDIA_CENTER_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Education delegates, researchers, and institutions globally",
    },
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={editionList} />
      <JsonLd data={hubList} />
      <JsonLd data={webPage} />
    </>
  );
}
