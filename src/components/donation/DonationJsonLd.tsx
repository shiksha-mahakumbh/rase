import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  DONATION_80G,
  DONATION_CANONICAL_URL,
  DONATION_HERO_IMAGE,
  DONATION_PAGE_HERO,
  DONATION_PATH,
  DONATION_TIERS,
  donationMetaDescription,
  DONATION_FAQ,
} from "@/data/donation-hub";
import {
  buildCollectionPageSchema,
  buildFaqSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function DonationJsonLd() {
  const description = donationMetaDescription();

  const collection = buildCollectionPageSchema({
    name: DONATION_PAGE_HERO.title,
    description,
    path: DONATION_PATH,
  });

  const tierList = buildItemListSchema({
    name: "Donation & Sponsorship Tiers",
    items: DONATION_TIERS.map((tier) => ({
      name: tier.name,
      url: `${DONATION_PATH}#donate-form`,
    })),
  });

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: DONATION_PAGE_HERO.title,
    description,
    url: DONATION_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${DONATION_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: {
      "@type": "NGO",
      name: DONATION_80G.orgLegalName,
      taxID: DONATION_80G.orgPan,
      description: DONATION_80G.note,
    },
  };

  const donateAction = {
    "@context": "https://schema.org",
    "@type": "DonateAction",
    name: "Donate to Shiksha Mahakumbh Abhiyan",
    description,
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}${CANONICAL_ROUTES.donation}#donate-form`,
      actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"],
    },
    recipient: {
      "@type": "NGO",
      name: DONATION_80G.orgLegalName,
      taxID: DONATION_80G.orgPan,
    },
  };

  const faq = buildFaqSchema([...DONATION_FAQ]);

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={tierList} />
      <JsonLd data={webPage} />
      <JsonLd data={donateAction} />
      <JsonLd data={faq} />
    </>
  );
}
