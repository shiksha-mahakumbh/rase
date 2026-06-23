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
import {
  buildCollectionPageSchema,
  buildFaqSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function ContactJsonLd() {
  const description = contactMetaDescription();

  const collection = buildCollectionPageSchema({
    name: CONTACT_PAGE_HERO.title,
    description,
    path: CONTACT_PATH,
  });

  const contactPage = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: CONTACT_PAGE_HERO.title,
    description,
    url: CONTACT_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${CONTACT_HERO_IMAGE}`,
    isPartOf: orgReference(),
    mainEntity: {
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
    },
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: CONTACT_PAGE_HERO.title,
    description,
    url: CONTACT_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${CONTACT_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: orgReference(),
    mainEntity: contactPage.mainEntity,
  };

  const faq = buildFaqSchema([...CONTACT_FAQ]);

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={contactPage} />
      <JsonLd data={webPage} />
      <JsonLd data={faq} />
    </>
  );
}
