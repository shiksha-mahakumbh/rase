import PublicPageShell from "@/components/layouts/PublicPageShell";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
import AcademicCouncil from "@/components/vibhag/AcademicCouncil24";
import AcademicCouncilJsonLd from "@/components/seo/AcademicCouncilJsonLd";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { ACADEMIC_COUNCIL_HERO } from "@/data/academic-council-content";

export default function AcademicCouncilDepartmentPage() {
  return (
    <>
      <AcademicCouncilJsonLd />
      <PublicPageShell
        hero={{
          eyebrow: ACADEMIC_COUNCIL_HERO.eyebrow,
          title: ACADEMIC_COUNCIL_HERO.title,
          subtitle: ACADEMIC_COUNCIL_HERO.subtitle,
          accent: "brand",
          imageSrc: "/branding/shiksha-mahakumbh-brand-hero.png",
        }}
        relatedPath={CANONICAL_ROUTES.departments.academicCouncil}
        skipContainer
        showCta={false}
      >
        <VibhagPageShell currentSlug="AcademicCouncil24" showRelatedNav={false}>
          <AcademicCouncil />
        </VibhagPageShell>
      </PublicPageShell>
    </>
  );
}
