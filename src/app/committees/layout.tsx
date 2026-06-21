import { createCommitteeMetadata } from "@/lib/seo/metadataBuilders";
import { SITE_URL } from "@/config/site";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createCommitteeMetadata({
  title: "Organising Committees",
  description:
    "Browse advisory, organising, and conference committees for Shiksha Mahakumbh Abhiyan editions 1.0–6.0. National education leadership from IITs, NITs, central universities, Vidya Bharti, and DHE.",
  path: CANONICAL_ROUTES.committees,
  keywords: [
    "Shiksha Mahakumbh committee",
    "organising committee",
    "national advisory committee",
    "DHE leadership",
    "education conference India",
    "IIT NIT university committee",
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
    "Committee members and governance structure across Shiksha Mahakumbh editions 1.0 through 6.0.",
  url: `${SITE_URL}${CANONICAL_ROUTES.committees}`,
  inLanguage: "en-IN",
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
