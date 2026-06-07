import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import VibhagPageShell from "@/components/vibhag/VibhagPageShell";
import RelatedContentSection from "@/components/knowledge-graph/RelatedContentSection";
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
  return (
    <div className="min-h-screen bg-brand-surface">
      <NavBar />
      <VibhagPageShell currentSlug={slug} showRelatedNav={showRelatedNav}>
        {children}
      </VibhagPageShell>
      <RelatedContentSection
        path={canonicalPath}
        title="Related programmes & resources"
      />
      <Footer />
    </div>
  );
}
