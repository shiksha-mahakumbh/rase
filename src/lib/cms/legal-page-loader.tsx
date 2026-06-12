import type { Metadata } from "next";
import type { ReactNode } from "react";
import CmsLegalPage from "@/components/layouts/CmsLegalPage";
import { loadCmsPageBySlug } from "@/lib/cms/server";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateLegalPageMetadata(
  slug: string,
  fallback: { title: string; description: string; path: string }
): Promise<Metadata> {
  const cms = await loadCmsPageBySlug(slug);
  if (cms?.page.pageType === "policy") {
    return metadataFromCmsSeo(cms.seo, {
      title: cms.page.title,
      description: cms.page.excerpt ?? fallback.description,
      path: fallback.path,
    });
  }
  return createPageMetadata(fallback);
}

export async function renderLegalPage(
  slug: string,
  fallback: ReactNode
) {
  const cms = await loadCmsPageBySlug(slug);
  if (cms?.page.pageType === "policy") {
    return <CmsLegalPage cms={cms} />;
  }
  return fallback;
}
