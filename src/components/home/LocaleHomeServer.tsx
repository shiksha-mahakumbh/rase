import HomePage from "@/components/home/HomePage";
import HomeJsonLd from "@/components/home/HomeJsonLd";
import HomeEcosystemJsonLd from "@/components/home/HomeEcosystemJsonLd";
import PartnersShowcaseJsonLd from "@/components/home/PartnersShowcaseJsonLd";
import { CmsProvider } from "@/lib/cms/context";
import { extractFaqsFromCmsData } from "@/lib/cms/faq";
import { buildAffiliationShowcase } from "@/lib/cms/build-affiliation-showcase";
import { getHomepagePartners } from "@/lib/cms/partners";
import { loadCmsPageData } from "@/lib/cms/server";
import { loadCmsSpeakers, loadCmsPartners } from "@/lib/cms/organizational";
import { buildHeroContent } from "@/lib/home/build-hero-content";
import { buildHomeSectionsContent } from "@/lib/home/build-home-sections";
import { HERO_LCP_PRELOAD } from "@/components/home/HeroLcpImage";
import { resolveTickerItems } from "@/data/default-announcements";
import { navMenusFromCms } from "@/components/layout/navbar/NavBarShell";
import type { ContentLocale } from "@prisma/client";
import { cmsLocaleForRoute } from "@/lib/home/cms-locale";

export default async function LocaleHomeServer({ locale }: { locale: string }) {
  const cmsLocale = cmsLocaleForRoute(locale);
  const [cmsData, featuredSpeakers, cmsPartners] = await Promise.all([
    loadCmsPageData(cmsLocale),
    loadCmsSpeakers(cmsLocale, true),
    loadCmsPartners(cmsLocale),
  ]);
  const faqs = extractFaqsFromCmsData(cmsData);
  const affiliationShowcase = buildAffiliationShowcase({
    cmsPartners,
    cmsSpeakers: featuredSpeakers,
    homepagePartners: getHomepagePartners(cmsData.homepage),
  });
  const heroContent = buildHeroContent(cmsData.homepage);
  const homeSections = buildHomeSectionsContent(cmsData.homepage);
  const tickerItems = resolveTickerItems(cmsData.announcementBars, locale);
  const navMenus = navMenusFromCms(cmsData.headerMenu);

  return (
    <CmsProvider data={cmsData}>
      <link
        rel="preload"
        as="image"
        href={HERO_LCP_PRELOAD}
        type="image/webp"
        fetchPriority="high"
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
      <HomePage
        featuredSpeakers={featuredSpeakers}
        cmsPartners={cmsPartners}
        heroContent={heroContent}
        homeSections={homeSections}
        tickerItems={tickerItems}
        navMenus={navMenus}
      />
    </CmsProvider>
  );
}
