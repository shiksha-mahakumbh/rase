import { SITE_URL } from "@/config/site";
import { DONATION_80G, DONATION_HERO, DONATION_TIERS } from "@/data/donation-hub";

export default function DonationJsonLd() {
  const pageUrl = `${SITE_URL}/donation`;

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: DONATION_HERO.title,
    description: DONATION_HERO.subtitle,
    url: pageUrl,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
  };

  const nonprofit = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: DONATION_80G.orgLegalName,
    url: SITE_URL,
    taxID: DONATION_80G.orgPan,
    description:
      "Department of Holistic Education — organizer of Shiksha Mahakumbh national education summits. Donations eligible under Section 80G.",
    areaServed: { "@type": "Country", name: "India" },
  };

  const offers = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Donation & Sponsorship Tiers",
    itemListElement: DONATION_TIERS.map((tier, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: tier.name,
        description: tier.description,
        price: tier.amount,
        priceCurrency: "INR",
        url: `${pageUrl}#donate-form`,
        eligibleRegion: { "@type": "Country", name: "IN" },
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Donation & Sponsorship", item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(nonprofit) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offers) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
