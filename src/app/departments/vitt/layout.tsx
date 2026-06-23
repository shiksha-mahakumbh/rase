import type { Metadata } from "next";
import VibhagJsonLd from "@/components/vibhag/VibhagJsonLd";
import { generateDepartmentPageMetadata } from "@/lib/cms/department-page-loader";
import {
  DEPARTMENTS_OG_IMAGE,
  VIBHAG_HUB_BY_SLUG,
  vibhagHubMetaDescription,
} from "@/data/departments-hub";

const HUB = VIBHAG_HUB_BY_SLUG.Vitt24;

export async function generateMetadata(): Promise<Metadata> {
  return generateDepartmentPageMetadata(HUB.cmsSlug, {
    title: HUB.pageTitle,
    description: vibhagHubMetaDescription(HUB.slug),
    path: HUB.path,
    keywords: [...HUB.keywords],
    locale: "en_IN",
    ogImageUrl: DEPARTMENTS_OG_IMAGE,
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <VibhagJsonLd slug={HUB.slug} />
      {children}
    </>
  );
}
