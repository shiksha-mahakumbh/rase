import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import VibhagRelatedNav from "@/components/vibhag/VibhagRelatedNav";
import { getVibhagBySlug } from "@/data/vibhag-pages";

interface VibhagPageShellProps {
  currentSlug: string;
  children: React.ReactNode;
  showRelatedNav?: boolean;
}

export default function VibhagPageShell({
  currentSlug,
  children,
  showRelatedNav = true,
}: VibhagPageShellProps) {
  const page = getVibhagBySlug(currentSlug);

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="border-b border-brand-navy/10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
          <BreadcrumbNav
            items={[
              { label: "Home", href: "/" },
              { label: "Departments", href: "/VibhagRoute/AcademicCouncil24" },
              { label: page?.title ?? "Department" },
            ]}
          />
        </div>
      </div>
      {children}
      {showRelatedNav && <VibhagRelatedNav currentSlug={currentSlug} />}
    </div>
  );
}
