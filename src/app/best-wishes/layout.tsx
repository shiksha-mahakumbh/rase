import { createPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/config/site";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createPageMetadata({
  title: "Best Wishes — Shiksha Mahakumbh",
  description:
    "Best wishes and greetings from dignitaries for Shiksha Mahakumbh editions — a prestigious showcase of institutional support.",
  path: CANONICAL_ROUTES.bestWishes,
  keywords: [
    "Shiksha Mahakumbh best wishes",
    "education summit greetings",
    "dignitary messages India",
  ],
});

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Media Centre",
      item: `${SITE_URL}${CANONICAL_ROUTES.mediaCenter}`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Best Wishes",
      item: `${SITE_URL}${CANONICAL_ROUTES.bestWishes}`,
    },
  ],
};

export default function BestWishesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
