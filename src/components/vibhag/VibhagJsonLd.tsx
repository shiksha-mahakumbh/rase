import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import {
  DEPARTMENTS_HERO_IMAGE,
  getVibhagHubConfig,
  vibhagCoordinatorItemsForSchema,
  vibhagHubMetaDescription,
} from "@/data/departments-hub";
import { getVibhagBySlug } from "@/data/vibhag-pages";
import {
  buildCollectionPageSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

interface VibhagJsonLdProps {
  slug: string;
}

export default function VibhagJsonLd({ slug }: VibhagJsonLdProps) {
  const page = getVibhagBySlug(slug);
  const hub = getVibhagHubConfig(slug);
  if (!page) return null;

  const pageUrl = `${SITE_URL}${page.path}`;
  const description = hub ? vibhagHubMetaDescription(slug) : page.description;

  const collection = buildCollectionPageSchema({
    name: `${page.title} — Shiksha Mahakumbh 6.0`,
    description,
    path: page.path,
  });

  const coordinatorsList =
    hub && hub.coordinatorNames.length > 0
      ? buildItemListSchema({
          name: `${page.title} coordinators`,
          items: vibhagCoordinatorItemsForSchema(slug),
        })
      : null;

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: hub?.pageTitle ?? `${page.title} — Shiksha Mahakumbh`,
    description,
    url: pageUrl,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${DEPARTMENTS_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: {
      "@type": "Organization",
      name: "Department of Holistic Education",
      alternateName: "Shiksha Mahakumbh Abhiyan",
    },
  };

  return (
    <>
      <JsonLd data={collection} />
      {coordinatorsList ? <JsonLd data={coordinatorsList} /> : null}
      <JsonLd data={webPage} />
    </>
  );
}
