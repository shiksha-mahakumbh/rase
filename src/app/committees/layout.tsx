import { createCommitteeMetadata } from "@/lib/seo/metadataBuilders";
import { SITE_URL } from "@/config/site";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createCommitteeMetadata({
  title: "Organising Committee",
  description: "Committee members for Shiksha Mahakumbh Abhiyan.",
  path: CANONICAL_ROUTES.committees,
});

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Organising Committees",
      item: `${SITE_URL}${CANONICAL_ROUTES.committees}`,
    },
  ],
};

const collection = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Shiksha Mahakumbh Organising Committees",
  description:
    "Committee members and governance structure across Shiksha Mahakumbh editions.",
  url: `${SITE_URL}${CANONICAL_ROUTES.committees}`,
};

export default function CommitteesLayout({ children }: { children: React.ReactNode }) {
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
