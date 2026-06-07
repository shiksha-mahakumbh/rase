import { createPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/config/site";
import { DHE_ORGANIZATION } from "@/config/organization";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description:
    "Contact the Shiksha Mahakumbh Abhiyan organising team — Department of Holistic Education, E7 Orchid Towers, Sector-125, SAS Nagar, Punjab 140301.",
  path: CANONICAL_ROUTES.contact,
  keywords: [
    "Contact Shiksha Mahakumbh",
    "Department of Holistic Education address",
    "DHE SAS Nagar",
    "education summit contact India",
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
      name: "Contact Us",
      item: `${SITE_URL}${CANONICAL_ROUTES.contact}`,
    },
  ],
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: DHE_ORGANIZATION.name,
  url: SITE_URL,
  email: DHE_ORGANIZATION.emails[0],
  telephone: DHE_ORGANIZATION.phones[0].replace(/\s/g, ""),
  address: {
    "@type": "PostalAddress",
    streetAddress: `${DHE_ORGANIZATION.address.line1}, ${DHE_ORGANIZATION.address.line2}`,
    addressLocality: DHE_ORGANIZATION.address.line3,
    addressRegion: DHE_ORGANIZATION.address.state,
    postalCode: DHE_ORGANIZATION.address.pincode,
    addressCountry: DHE_ORGANIZATION.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: DHE_ORGANIZATION.address.lat,
    longitude: DHE_ORGANIZATION.address.lng,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      {children}
    </>
  );
}
