import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import VibhagRelatedNav from "@/components/vibhag/VibhagRelatedNav";
import { getVibhagBySlug } from "@/data/vibhag-pages";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

interface VibhagPageShellProps {
  currentSlug: string;
  children: React.ReactNode;
  showRelatedNav?: boolean;
  showBreadcrumb?: boolean;
}

export default function VibhagPageShell({
  currentSlug,
  children,
  showRelatedNav = true,
  showBreadcrumb = true,
}: VibhagPageShellProps) {
  const page = getVibhagBySlug(currentSlug);

  return (
    <>
      {showBreadcrumb ? (
        <div className="border-b border-brand-navy/10 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
            <BreadcrumbNav
              items={[
                { label: "Home", href: "/" },
                { label: "About", href: CANONICAL_ROUTES.introduction },
                { label: page?.title ?? "Department" },
              ]}
            />
          </div>
        </div>
      ) : null}
      {children}
      {showRelatedNav && <VibhagRelatedNav currentSlug={currentSlug} />}
    </>
  );
}
