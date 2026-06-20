import PublicPageShell from "@/components/layouts/PublicPageShell";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
import { getVibhagBySlug } from "@/data/vibhag-pages";
import type { ReactNode } from "react";
import { brandPageHero } from "@/lib/page-heroes";

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
      hero={brandPageHero(
        page?.title ?? "Department",
        page?.description ?? "",
        "Departments"
      )}
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
