import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsPressArticleView from "@/components/press/CmsPressArticleView";
import StaticPressArticleView from "@/components/press/StaticPressArticleView";
import { loadCmsPageBySlug } from "@/lib/cms/server";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { pressArticleMeta } from "@/lib/seo/publicPages";
import {
  getPressArticleBySlug,
  PRESS_ARTICLE_SLUGS,
} from "@/lib/press/articles";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cms = await loadCmsPageBySlug(slug);
  const fallback = getPressArticleBySlug(slug);

  if (cms?.page.pageType === "article") {
    return metadataFromCmsSeo(cms.seo, {
      title: cms.page.title,
      description: cms.page.excerpt ?? cms.page.title,
      path: `/press/${slug}`,
      ogImageUrl: cms.seo?.ogImageUrl,
    });
  }

  if (fallback) {
    return pressArticleMeta(fallback.pressNumber);
  }

  return { title: "Press Release" };
}

export default async function PressSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const cms = await loadCmsPageBySlug(slug);

  if (cms?.page.pageType === "article") {
    return <CmsPressArticleView cms={cms} slug={slug} />;
  }

  const fallback = getPressArticleBySlug(slug);
  if (!fallback) notFound();

  return <StaticPressArticleView article={fallback} />;
}

export function generateStaticParams() {
  return PRESS_ARTICLE_SLUGS.map((slug) => ({ slug }));
}
