import PublicPageShell from "@/components/layouts/PublicPageShell";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
import AcademicCouncil from "@/components/vibhag/AcademicCouncil24";
import AcademicCouncilHubIntro from "@/components/vibhag/academic/AcademicCouncilHubIntro";
import {
  ACADEMIC_COUNCIL_BREADCRUMBS,
  ACADEMIC_COUNCIL_HERO_IMAGE,
  ACADEMIC_COUNCIL_HERO_IMAGE_ALT,
  ACADEMIC_COUNCIL_PAGE_HERO,
  ACADEMIC_COUNCIL_PATH,
} from "@/data/academic-council-hub";

export default function AcademicCouncilDepartmentPage() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: ACADEMIC_COUNCIL_PAGE_HERO.eyebrow,
        title: ACADEMIC_COUNCIL_PAGE_HERO.title,
        subtitle: ACADEMIC_COUNCIL_PAGE_HERO.subtitle,
        accent: "brand",
        imageSrc: ACADEMIC_COUNCIL_HERO_IMAGE,
        imageAlt: ACADEMIC_COUNCIL_HERO_IMAGE_ALT,
      }}
      showHero={false}
      relatedPath={ACADEMIC_COUNCIL_PATH}
      breadcrumbs={[...ACADEMIC_COUNCIL_BREADCRUMBS]}
      skipContainer
      showCta={false}
    >
      <AcademicCouncilHubIntro />
      <VibhagPageShell currentSlug="AcademicCouncil24" showBreadcrumb={false} showRelatedNav>
        <AcademicCouncil />
      </VibhagPageShell>
    </PublicPageShell>
  );
}
