import { createPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/config/site";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createPageMetadata({
  title: "Media Centre — Press, Archives & Coverage",
  description:
    "Shiksha Mahakumbh media centre: press releases, digital and print archives, photo and video galleries, and national coverage.",
  path: CANONICAL_ROUTES.mediaCenter,
  keywords: [
    "Shiksha Mahakumbh media",
    "education press India",
    "Mahakumbh digital media archive",
  ],
});

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Education", item: `${SITE_URL}/education` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Media Centre",
      item: `${SITE_URL}${CANONICAL_ROUTES.mediaCenter}`,
    },
  ],
};

const collection = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Shiksha Mahakumbh Media Centre",
  description:
    "Media coverage, press releases, digital and print archives of Shiksha Mahakumbh Abhiyan.",
  url: `${SITE_URL}${CANONICAL_ROUTES.mediaCenter}`,
};

export default function MediaCenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }}
      />
      {children}
    </>
  );
}
