import JsonLd from "./JsonLd";
import BreadcrumbJsonLd from "./BreadcrumbJsonLd";
import { buildEducationalOrganizationJsonLd } from "@/lib/seo/schemas";
import { ORGANIZATION_SCHEMA, SITE_NAME, SITE_URL } from "@/config/site";
import { INTRODUCTION_CLOSING, INTRODUCTION_HERO } from "@/data/introduction-content";

export default function IntroductionJsonLd() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Introduction", path: "/introduction" },
        ]}
      />
      <JsonLd data={ORGANIZATION_SCHEMA} />
      <JsonLd data={buildEducationalOrganizationJsonLd()} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${INTRODUCTION_HERO.title} — Introduction`,
          description: INTRODUCTION_HERO.subtitle,
          url: `${SITE_URL}/introduction`,
          inLanguage: "en-IN",
          isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
          },
          about: {
            "@type": "EducationalOrganization",
            name: "Department of Holistic Education",
            alternateName: INTRODUCTION_HERO.title,
          },
          abstract: INTRODUCTION_CLOSING,
        }}
      />
    </>
  );
}
