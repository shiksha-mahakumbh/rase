import type { Metadata } from "next";
import { Suspense } from "react";
import HomePage from "@/components/home/HomePage";
import HomeJsonLd from "@/components/home/HomeJsonLd";
import HomeEcosystemJsonLd from "@/components/home/HomeEcosystemJsonLd";
import PartnersShowcaseJsonLd from "@/components/home/PartnersShowcaseJsonLd";
import { extractFaqsFromCmsData } from "@/lib/cms/faq";
import { buildAffiliationShowcase } from "@/lib/cms/build-affiliation-showcase";
import { getHomepagePartners } from "@/lib/cms/partners";
import { loadCmsHomepage, loadCmsHomeShell, loadCmsPageData } from "@/lib/cms/server";
import { loadCmsSpeakers, loadCmsPartners } from "@/lib/cms/organizational";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import { buildHeroContent } from "@/lib/home/build-hero-content";
import { buildHomeSectionsContent } from "@/lib/home/build-home-sections";
import HeroLcpPreload from "@/components/home/HeroLcpPreload";
import { resolveTickerItems } from "@/data/default-announcements";
import { navMenusFromCms } from "@/components/layout/navbar/NavBarShell";

export const dynamic = "force-dynamic";

const FALLBACK_META = {
  title: "Shiksha Mahakumbh 6.0 — National Education Summit",
  description:
    "Join Shiksha Mahakumbh 6.0 at NIT Hamirpur, 9–11 October 2026. India's premier multidisciplinary education summit — research, conclaves, olympiads, innovation, and NEP 2020 alignment.",
  path: "/",
  keywords: [
    "Shiksha Mahakumbh 6.0",
    "Shiksha Mahakumbh 2026",
    "शिक्षा महाकुंभ",
    "NIT Hamirpur conference",
    "NEP 2020 education summit",
    "education conference India",
    "Bharat 2047",
    "Indian Knowledge Systems",
    "Shiksha Mahakumbh media partners",
    "education summit sponsors India",
    "IIT NIT university partners",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await loadCmsHomepage();
  if (homepage?.seo) {
    return withHreflang(metadataFromCmsSeo(homepage.seo, FALLBACK_META), "/");
  }
  return withHreflang(createPageMetadata(FALLBACK_META), "/");
}

async function HomePartnersJsonLdDeferred() {
  const [cmsData, featuredSpeakers, cmsPartners] = await Promise.all([
    loadCmsPageData(),
    loadCmsSpeakers("en", true),
    loadCmsPartners("en"),
  ]);
  const affiliationShowcase = buildAffiliationShowcase({
    cmsPartners,
    cmsSpeakers: featuredSpeakers,
    homepagePartners: getHomepagePartners(cmsData.homepage),
  });
  return <PartnersShowcaseJsonLd grouped={affiliationShowcase} />;
}

export default async function Page() {
  const cmsData = await loadCmsHomeShell();
  const faqs = extractFaqsFromCmsData(cmsData);
  const heroContent = buildHeroContent(cmsData.homepage);
  const homeSections = buildHomeSectionsContent(cmsData.homepage);
  const tickerItems = resolveTickerItems(cmsData.announcementBars, "en");
  const navMenus = navMenusFromCms(cmsData.headerMenu);

  return (
    <>
      <HeroLcpPreload />
      <HomePage
        cmsData={cmsData}
        heroContent={heroContent}
        homeSections={homeSections}
        tickerItems={tickerItems}
        navMenus={navMenus}
      />
      <HomeJsonLd faqs={faqs} />
      <HomeEcosystemJsonLd />
      <Suspense fallback={null}>
        <HomePartnersJsonLdDeferred />
      </Suspense>
      {cmsData.homepage?.seo?.schemaJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(cmsData.homepage.seo.schemaJsonLd),
          }}
        />
      )}
    </>
  );
}
