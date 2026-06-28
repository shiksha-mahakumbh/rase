import type { Metadata } from "next";
import { Suspense } from "react";
import HomePage from "@/components/home/HomePage";
import HomeJsonLd from "@/components/home/HomeJsonLd";
import HomeEcosystemJsonLd from "@/components/home/HomeEcosystemJsonLd";
import PartnersShowcaseJsonLd from "@/components/home/PartnersShowcaseJsonLd";
import { extractFaqsFromCmsData } from "@/lib/cms/faq";
import { buildAffiliationShowcase } from "@/lib/cms/build-affiliation-showcase";
import { getHomepagePartners } from "@/lib/cms/partners";
import { loadCmsHomeShell, loadCmsPageData } from "@/lib/cms/server";
import { loadCmsSpeakers, loadCmsPartners } from "@/lib/cms/organizational";
import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import { buildHeroContent } from "@/lib/home/build-hero-content";
import { buildHomeSectionsContent } from "@/lib/home/build-home-sections";
import HeroLcpPreload from "@/components/home/HeroLcpPreload";
import { resolveTickerItems } from "@/data/default-announcements";
import { navMenusFromCms } from "@/components/layout/navbar/NavBarShell";
import hiMessages from "@/i18n/messages/hi.json";

export const dynamic = "force-dynamic";

const HI_HOME_META = {
  title: hiMessages.meta.homeTitle,
  description: hiMessages.meta.homeDescription,
  path: "/hi",
};

export async function generateMetadata(): Promise<Metadata> {
  return withHreflang(
    createPageMetadata({
      ...HI_HOME_META,
      locale: "hi_IN",
    }),
    "/"
  );
}

async function HiHomePartnersJsonLdDeferred() {
  const [cmsData, featuredSpeakers, cmsPartners] = await Promise.all([
    loadCmsPageData("en"),
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

/** Hindi homepage — same cached en CMS shell as `/` with hi metadata and layout. */
export default async function HiHomePage() {
  const cmsData = await loadCmsHomeShell("en");
  const faqs = extractFaqsFromCmsData(cmsData);
  const heroContent = buildHeroContent(cmsData.homepage, "hi");
  const homeSections = buildHomeSectionsContent(cmsData.homepage);
  const tickerItems = resolveTickerItems(cmsData.announcementBars, "hi");
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
        locale="en"
      />
      <HomeJsonLd faqs={faqs} />
      <HomeEcosystemJsonLd />
      <Suspense fallback={null}>
        <HiHomePartnersJsonLdDeferred />
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
