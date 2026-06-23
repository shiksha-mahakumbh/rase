import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import { DynamicFooter, DynamicNavBar } from "@/components/layout/SiteDynamicChrome";
import PageCtaSection from "./PageCtaSection";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { CmsProvider } from "@/lib/cms/context";
import { loadPublicChromeCms } from "@/lib/cms/server";
import type { PublicPageShellProps } from "./public-page-shell.types";

/**
 * Server-rendered public page chrome with cached CMS nav/footer data
 * and deferred NavBar/Footer client islands.
 */
export default async function PublicPageLayout({
  hero,
  showHero = true,
  showCta = true,
  relatedPath,
  relatedTitle = "Related programmes & resources",
  breadcrumbs,
  children,
  mainClassName = "",
  containerClassName = "mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20",
  skipContainer = false,
}: PublicPageShellProps) {
  const cms = await loadPublicChromeCms("en");

  return (
    <CmsProvider data={cms}>
      <div className="min-h-screen bg-white">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <BreadcrumbJsonLd items={breadcrumbs} />
        ) : null}
        <DynamicNavBar />
        {showHero && hero ? (
          <ShowcaseHero
            eyebrow={hero.eyebrow}
            title={hero.title}
            subtitle={hero.subtitle}
            accent={hero.accent ?? "brand"}
            imageSrc={hero.imageSrc}
            imageAlt={hero.imageAlt}
            imagePriority={hero.imagePriority}
          />
        ) : null}
        <main id="main-content" className={mainClassName}>
          {skipContainer ? children : (
            <div className={containerClassName}>{children}</div>
          )}
        </main>
        {relatedPath ? (
          <RelatedContentSection
            path={relatedPath}
            title={relatedTitle}
            className="mx-auto max-w-5xl px-4 py-8"
          />
        ) : null}
        {showCta ? <PageCtaSection /> : null}
        <DynamicFooter />
      </div>
    </CmsProvider>
  );
}
