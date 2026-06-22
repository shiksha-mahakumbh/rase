import JsonLd from "@/components/seo/JsonLd";
import {
  PRESS_CANONICAL_URL,
  PRESS_PAGE_HERO,
  type PressReleaseCard,
} from "@/data/press-hub";
import { SITE_URL } from "@/config/site";
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildItemListSchema } from "@/lib/seo/schema";

type Props = {
  catalog: PressReleaseCard[];
};

export default function PressJsonLd({ catalog }: Props) {
  const collection = buildCollectionPageSchema({
    name: "Shiksha Mahakumbh Press Releases",
    description: PRESS_PAGE_HERO.subtitle,
    path: "/press",
  });

  const itemList = buildItemListSchema({
    name: "Press releases",
    items: catalog.map((item) => ({
      name: item.title,
      url: `${SITE_URL}${item.href}`,
    })),
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Media Centre", path: "/media-center" },
    { name: "Press Releases", path: "/press" },
  ]);

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PRESS_PAGE_HERO.title,
    description: PRESS_PAGE_HERO.subtitle,
    url: PRESS_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
    audience: {
      "@type": "Audience",
      audienceType: "Media, education institutions, and global stakeholders",
    },
  };

  const newsArticles = catalog.slice(0, 10).map((item) => ({
    id: item.id,
    data: {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: item.title,
      description: item.excerpt,
      url: `${SITE_URL}${item.href}`,
      inLanguage: item.locale === "hi" ? "hi-IN" : "en-IN",
      publisher: {
        "@type": "Organization",
        name: "Department of Holistic Education",
        url: SITE_URL,
      },
    },
  }));

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbs} />
      <JsonLd data={webPage} />
      {newsArticles.map((article) => (
        <JsonLd key={article.id} data={article.data} />
      ))}
    </>
  );
}
