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
import { buildHeroContent } from "@/lib/home/build-hero-content";
import { buildHomeSectionsContent } from "@/lib/home/build-home-sections";
import HeroLcpPreload from "@/components/home/HeroLcpPreload";
import { resolveTickerItems } from "@/data/default-announcements";
import { navMenusFromCms } from "@/components/layout/navbar/NavBarShell";
import { cmsLocaleForRoute } from "@/lib/home/cms-locale";

async function LocalePartnersJsonLdDeferred({ locale }: { locale: string }) {
  const cmsLocale = cmsLocaleForRoute(locale);
  const [cmsData, featuredSpeakers, cmsPartners] = await Promise.all([
    loadCmsPageData(cmsLocale),
    loadCmsSpeakers(cmsLocale, true),
    loadCmsPartners(cmsLocale),
  ]);
  const affiliationShowcase = buildAffiliationShowcase({
    cmsPartners,
    cmsSpeakers: featuredSpeakers,
    homepagePartners: getHomepagePartners(cmsData.homepage),
  });
  return <PartnersShowcaseJsonLd grouped={affiliationShowcase} />;
}

export default async function LocaleHomeServer({ locale }: { locale: string }) {
  const cmsLocale = cmsLocaleForRoute(locale);
  const cmsData = await loadCmsHomeShell(cmsLocale);
  const faqs = extractFaqsFromCmsData(cmsData);
  const heroContent = buildHeroContent(cmsData.homepage);
  const homeSections = buildHomeSectionsContent(cmsData.homepage);
  const tickerItems = resolveTickerItems(cmsData.announcementBars, locale);
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
        locale={cmsLocale}
      />
      <HomeJsonLd faqs={faqs} />
      <HomeEcosystemJsonLd />
      <Suspense fallback={null}>
        <LocalePartnersJsonLdDeferred locale={locale} />
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
