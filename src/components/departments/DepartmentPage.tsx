import PublicPageShell from "@/components/layouts/PublicPageShell";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
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

  return (
    <PublicPageShell
      hero={{
        eyebrow: "Departments",
        title: page?.title ?? "Department",
        subtitle: page?.description,
        accent: "navy",
      }}
      showHero={false}
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
