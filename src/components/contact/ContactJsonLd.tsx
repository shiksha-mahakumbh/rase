import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import { DHE_ORGANIZATION } from "@/config/organization";
import {
  CONTACT_CANONICAL_URL,
  CONTACT_FAQ,
  CONTACT_HERO_IMAGE,
  CONTACT_PAGE_HERO,
  CONTACT_PATH,
  contactMetaDescription,
} from "@/data/contact-hub";
import { buildFaqSchema, orgReference } from "@/lib/seo/schema";

/** Single consolidated JSON-LD graph (P3-8). */
export default function ContactJsonLd() {
  const description = contactMetaDescription();

  const organizationEntity = {
    "@type": "EducationalOrganization",
    name: DHE_ORGANIZATION.name,
    alternateName: DHE_ORGANIZATION.abhiyan,
    url: SITE_URL,
    email: DHE_ORGANIZATION.emails.join(", "),
    telephone: DHE_ORGANIZATION.phones.map((p) => p.replace(/\s/g, "")).join(", "),
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
    contactPoint: [
      ...DHE_ORGANIZATION.emails.map((email) => ({
        "@type": "ContactPoint",
        contactType: "customer support",
        email,
        availableLanguage: ["English", "Hindi"],
      })),
      ...DHE_ORGANIZATION.phones.map((phone) => ({
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: phone.replace(/\s/g, ""),
        availableLanguage: ["English", "Hindi"],
      })),
    ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: CONTACT_PAGE_HERO.title,
        description,
        url: `${SITE_URL}${CONTACT_PATH}`,
        isPartOf: orgReference(),
      },
      {
        "@type": "ContactPage",
        name: CONTACT_PAGE_HERO.title,
        description,
        url: CONTACT_CANONICAL_URL,
        inLanguage: ["en-IN", "hi-IN"],
        primaryImageOfPage: `${SITE_URL}${CONTACT_HERO_IMAGE}`,
        isPartOf: orgReference(),
        mainEntity: organizationEntity,
      },
      buildFaqSchema([...CONTACT_FAQ]),
    ],
  };

  return <JsonLd data={graph} />;
}
