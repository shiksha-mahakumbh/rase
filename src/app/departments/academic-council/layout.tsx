import AcademicCouncilJsonLd from "@/components/seo/AcademicCouncilJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  ACADEMIC_COUNCIL_OG_IMAGE,
  ACADEMIC_COUNCIL_PATH,
  ACADEMIC_COUNCIL_SEO,
} from "@/data/academic-council-hub";

export const metadata = createPageMetadata({
  title: ACADEMIC_COUNCIL_SEO.title,
  description: ACADEMIC_COUNCIL_SEO.description,
  path: ACADEMIC_COUNCIL_PATH,
  keywords: [...ACADEMIC_COUNCIL_SEO.keywords],
  locale: "en_IN",
  ogImageUrl: ACADEMIC_COUNCIL_OG_IMAGE,
});

export default function AcademicCouncilLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AcademicCouncilJsonLd />
      {children}
    </>
  );
}
