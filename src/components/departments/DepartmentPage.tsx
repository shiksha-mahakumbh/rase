import PublicPageShell from "@/components/layouts/PublicPageShell";
import DepartmentHubIntro from "@/components/departments/DepartmentHubIntro";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
import {
  DEPARTMENTS_HERO_IMAGE,
  getVibhagHubConfig,
  isOperationalVibhagSlug,
  vibhagHubBreadcrumbs,
} from "@/data/departments-hub";
import { getVibhagBySlug } from "@/data/vibhag-pages";
import type { ReactNode } from "react";

interface DepartmentPageProps {
  slug: string;
  canonicalPath: string;
  children: ReactNode;
  showRelatedNav?: boolean;
}

export default function DepartmentPage({
  slug,
  canonicalPath,
  children,
  showRelatedNav = true,
}: DepartmentPageProps) {
  const page = getVibhagBySlug(slug);
  const hub = getVibhagHubConfig(slug);
  const useHub = isOperationalVibhagSlug(slug) && hub;

  if (useHub) {
    return (
      <PublicPageShell
        hero={{
          eyebrow: hub.hero.eyebrow,
          title: hub.hero.title,
          subtitle: hub.hero.subtitle,
          accent: "brand",
          imageSrc: DEPARTMENTS_HERO_IMAGE,
          imageAlt: hub.hero.imageAlt,
        }}
        showHero={false}
        relatedPath={canonicalPath}
        breadcrumbs={[...vibhagHubBreadcrumbs(slug)]}
        skipContainer
        showCta={false}
      >
        <DepartmentHubIntro slug={slug} />
        <VibhagPageShell currentSlug={slug} showBreadcrumb={false} showRelatedNav={showRelatedNav}>
          {children}
        </VibhagPageShell>
      </PublicPageShell>
    );
  }

  return (
    <PublicPageShell
      hero={{
        eyebrow: "Departments",
        title: page?.title ?? "Department",
        subtitle: page?.description ?? "",
        accent: "brand",
        imageSrc: DEPARTMENTS_HERO_IMAGE,
      }}
      showHero
      relatedPath={canonicalPath}
      skipContainer
      showCta={slug !== "AcademicCouncil24"}
    >
      <VibhagPageShell currentSlug={slug} showRelatedNav={showRelatedNav}>
        {children}
      </VibhagPageShell>
    </PublicPageShell>
  );
}
