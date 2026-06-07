import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";
import { SITE_URL } from "@/config/site";

export const metadata = PUBLIC_PAGE_META.committeepage;

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Organising Committee",
      item: `${SITE_URL}/committeepage`,
    },
  ],
};

const collection = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Shiksha Mahakumbh Organising Committees",
  description:
    "Committee members and governance structure across Shiksha Mahakumbh editions.",
  url: `${SITE_URL}/committeepage`,
};

export default function CommitteePageLayout({
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
