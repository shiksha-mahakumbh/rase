import type { ReactNode } from "react";
import NavBarShell, { navMenusFromCms } from "@/components/layout/navbar/NavBarShell";
import { DynamicFooter } from "@/components/layout/SiteDynamicChrome";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import PageCtaSection from "@/components/layouts/PageCtaSection";
import PressShareButtons from "./PressShareButtons";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";
import { CmsProvider } from "@/lib/cms/context";
import { loadPublicChromeCms } from "@/lib/cms/server";

interface PressArticleShellProps {
  title: string;
  subtitle?: string;
  canonicalPath: string;
  shareUrl: string;
  shareText: string;
  shareImage?: string;
  children: ReactNode;
}

export default async function PressArticleShell({
  title,
  subtitle,
  canonicalPath,
  shareUrl,
  shareText,
  shareImage,
  children,
}: PressArticleShellProps) {
  const cms = await loadPublicChromeCms("en");

  return (
    <CmsProvider data={cms}>
      <div className="min-h-screen bg-brand-surface">
        <NavBarShell menus={navMenusFromCms(cms.headerMenu)} />
        <ShowcaseHero
          eyebrow="Press Release"
          title={title}
          subtitle={subtitle}
          accent="navy"
        />
        <main id="main-content" className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
          <article className="prose prose-slate max-w-none prose-headings:text-brand-navy prose-a:text-brand-saffron">
            {children}
          </article>
          <PressShareButtons
            shareUrl={shareUrl}
            shareText={shareText}
            shareImage={shareImage}
          />
        </main>
        <RelatedContentSection
          path={canonicalPath}
          title="Related programmes & resources"
        />
        <PageCtaSection />
        <DynamicFooter />
      </div>
    </CmsProvider>
  );
}
