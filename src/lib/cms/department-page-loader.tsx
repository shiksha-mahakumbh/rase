import type { Metadata } from "next";
import type { ReactNode } from "react";
import CmsDepartmentPage from "@/components/departments/CmsDepartmentPage";
import { loadCmsPageBySlug } from "@/lib/cms/server";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { createPageMetadata } from "@/lib/seo/metadata";

export async function generateDepartmentPageMetadata(
  slug: string,
  fallback: { title: string; description: string; path: string }
): Promise<Metadata> {
  const cms = await loadCmsPageBySlug(slug);
  if (cms?.page.pageType === "department") {
    return metadataFromCmsSeo(cms.seo, {
      title: cms.page.title,
      description: cms.page.excerpt ?? fallback.description,
      path: fallback.path,
    });
  }
  return createPageMetadata(fallback);
}

export async function renderDepartmentPage(slug: string, fallback: ReactNode) {
  const cms = await loadCmsPageBySlug(slug);
  if (cms?.page.pageType === "department") {
    return <CmsDepartmentPage cms={cms} />;
  }
  return fallback;
}
