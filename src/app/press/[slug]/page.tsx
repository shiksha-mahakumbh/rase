import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PressArticleJsonLd from "@/components/seo/PressArticleJsonLd";
import CmsPressArticleView from "@/components/press/CmsPressArticleView";
import { loadCmsPageBySlug } from "@/lib/cms/server";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { pressArticleMeta } from "@/lib/seo/publicPages";
import { getPressLegacyEntry, PRESS_LEGACY_SLUGS } from "@/lib/press/legacy-registry";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cms = await loadCmsPageBySlug(slug);
  const legacy = getPressLegacyEntry(slug);

  if (cms?.page.pageType === "article") {
    return metadataFromCmsSeo(cms.seo, {
      title: cms.page.title,
      description: cms.page.excerpt ?? cms.page.title,
      path: `/press/${slug}`,
      ogImageUrl: cms.seo?.ogImageUrl,
    });
  }

  if (legacy?.pressNumber) {
    return pressArticleMeta(legacy.pressNumber);
  }

  return { title: "Press Release" };
}

export default async function PressSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const cms = await loadCmsPageBySlug(slug);

  if (cms?.page.pageType === "article") {
    return <CmsPressArticleView cms={cms} slug={slug} />;
  }

  const legacy = getPressLegacyEntry(slug);
  if (!legacy) notFound();

  const { default: LegacyArticle } = await legacy.component();
  const jsonLd = legacy.pressNumber ? (
    <PressArticleJsonLd pressNumber={legacy.pressNumber} />
  ) : null;

  return (
    <>
      {jsonLd}
      <LegacyArticle />
    </>
  );
}

export function generateStaticParams() {
  return PRESS_LEGACY_SLUGS.map((slug) => ({ slug }));
}
