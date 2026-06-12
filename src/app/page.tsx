import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";
import HomeJsonLd from "@/components/home/HomeJsonLd";
import HomeEcosystemJsonLd from "@/components/home/HomeEcosystemJsonLd";
import { CmsProvider } from "@/lib/cms/context";
import { extractFaqsFromCmsData } from "@/lib/cms/faq";
import { loadCmsHomepage, loadCmsPageData } from "@/lib/cms/server";
import { loadCmsSpeakers, loadCmsPartners } from "@/lib/cms/organizational";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";

const FALLBACK_META = {
  title: "Shiksha Mahakumbh 6.0 — National Education Summit",
  description:
    "Join Shiksha Mahakumbh 6.0 at NIT Hamirpur, 9–11 October 2026. India's premier multidisciplinary education summit — research, conclaves, olympiads, innovation, and NEP 2020 alignment.",
  path: "/",
  keywords: [
    "Shiksha Mahakumbh 2026",
    "शिक्षा महाकुंभ",
    "NIT Hamirpur conference",
    "NEP 2020 education summit",
    "education conference India",
    "Bharat 2047",
    "Indian Knowledge Systems",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await loadCmsHomepage();
  if (homepage?.seo) {
    return metadataFromCmsSeo(homepage.seo, FALLBACK_META);
  }
  return createPageMetadata(FALLBACK_META);
}

export default async function Page() {
  const [cmsData, featuredSpeakers, cmsPartners] = await Promise.all([
    loadCmsPageData(),
    loadCmsSpeakers("en", true),
    loadCmsPartners("en", "media"),
  ]);
  const faqs = extractFaqsFromCmsData(cmsData);

  return (
    <CmsProvider data={cmsData}>
      <HomeJsonLd faqs={faqs} />
      <HomeEcosystemJsonLd />
      {cmsData.homepage?.seo?.schemaJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(cmsData.homepage.seo.schemaJsonLd),
          }}
        />
      )}
      <HomePage featuredSpeakers={featuredSpeakers} cmsPartners={cmsPartners} />
    </CmsProvider>
  );
}
