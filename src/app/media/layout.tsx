import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";
import { SITE_URL } from "@/config/site";

export const metadata = PUBLIC_PAGE_META.media;

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Education", item: `${SITE_URL}/education` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Media & Press",
      item: `${SITE_URL}/media`,
    },
  ],
};

const collection = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Shiksha Mahakumbh Media Centre",
  description:
    "Media coverage, press releases, digital and print archives of Shiksha Mahakumbh Abhiyan.",
  url: `${SITE_URL}/media`,
};

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
