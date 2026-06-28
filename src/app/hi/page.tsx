import type { Metadata } from "next";
import HomePage from "@/components/home/HomePage";
import HomeJsonLd from "@/components/home/HomeJsonLd";
import HomeEcosystemJsonLd from "@/components/home/HomeEcosystemJsonLd";
import PartnersShowcaseJsonLd from "@/components/home/PartnersShowcaseJsonLd";
import { extractFaqsFromCmsData } from "@/lib/cms/faq";
import { buildAffiliationShowcase } from "@/lib/cms/build-affiliation-showcase";
import { getHomepagePartners } from "@/lib/cms/partners";
import { loadCmsPageData } from "@/lib/cms/server";
import { loadCmsSpeakers, loadCmsPartners } from "@/lib/cms/organizational";
import { createPageMetadata } from "@/lib/seo/metadata";
import { withHreflang } from "@/lib/seo/hreflang";
import { buildHeroContent } from "@/lib/home/build-hero-content";
import { buildHomeSectionsContent } from "@/lib/home/build-home-sections";
import HeroLcpPreload from "@/components/home/HeroLcpPreload";
import { resolveTickerItems } from "@/data/default-announcements";
import { navMenusFromCms } from "@/components/layout/navbar/NavBarShell";
import hiMessages from "@/i18n/messages/hi.json";

export const revalidate = 3600;

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

/** Hindi homepage — same cached en CMS shell as `/` with hi metadata and layout. */
export default async function HiHomePage() {
  const [cmsData, featuredSpeakers, cmsPartners] = await Promise.all([
    loadCmsPageData("en"),
    loadCmsSpeakers("en", true),
    loadCmsPartners("en"),
  ]);
  const faqs = extractFaqsFromCmsData(cmsData);
  const affiliationShowcase = buildAffiliationShowcase({
    cmsPartners,
    cmsSpeakers: featuredSpeakers,
    homepagePartners: getHomepagePartners(cmsData.homepage),
  });
  const heroContent = buildHeroContent(cmsData.homepage, "hi");
  const homeSections = buildHomeSectionsContent(cmsData.homepage);
  const tickerItems = resolveTickerItems(cmsData.announcementBars, "hi");
  const navMenus = navMenusFromCms(cmsData.headerMenu);

  return (
    <>
      <HeroLcpPreload />
      <HomePage
        cmsData={cmsData}
        featuredSpeakers={featuredSpeakers}
        cmsPartners={cmsPartners}
        heroContent={heroContent}
        homeSections={homeSections}
        tickerItems={tickerItems}
        navMenus={navMenus}
      />
      <HomeJsonLd faqs={faqs} />
      <HomeEcosystemJsonLd />
      <PartnersShowcaseJsonLd grouped={affiliationShowcase} />
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
