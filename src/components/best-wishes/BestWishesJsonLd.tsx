import { SITE_URL } from "@/config/site";
import { BEST_WISHES_ENTRIES, BEST_WISHES_HERO } from "@/data/best-wishes";

export default function BestWishesJsonLd() {
  const pageUrl = `${SITE_URL}/best-wishes`;

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: BEST_WISHES_HERO.title,
    description: BEST_WISHES_HERO.subtitle,
    url: pageUrl,
    inLanguage: ["en-IN", "hi-IN"],
    numberOfItems: BEST_WISHES_ENTRIES.length,
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
  };

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shiksha Mahakumbh Abhiyan — Best Wishes",
    numberOfItems: BEST_WISHES_ENTRIES.length,
    itemListElement: BEST_WISHES_ENTRIES.slice(0, 20).map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: entry.name,
        jobTitle: entry.designation,
        description: entry.message,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Best Wishes", item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
