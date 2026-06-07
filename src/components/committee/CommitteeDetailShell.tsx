import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";

interface CommitteeDetailShellProps {
  editionTitle: string;
  children: React.ReactNode;
}

export default function CommitteeDetailShell({
  editionTitle,
  children,
}: CommitteeDetailShellProps) {
  return (
    <div className="min-h-screen bg-brand-surface">
      <ShowcaseHero
        eyebrow="Governance & Leadership"
        title={editionTitle}
        subtitle="Committee members guiding and managing initiatives to promote quality education and holistic development across India."
      />
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Committee", href: "/committees" },
            { label: editionTitle },
          ]}
          className="mb-8"
        />
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg md:rounded-3xl md:p-8">
          {children}
        </div>
        <p className="mt-8 text-center">
          <Link
            href="/committees"
            className="text-sm font-semibold text-brand-saffron-dark hover:underline"
          >
            ← Back to Committee Timeline
          </Link>
        </p>
      </div>
    </div>
  );
}
