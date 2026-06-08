import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";

interface CommitteeDetailShellProps {
  editionTitle: string;
  children: React.ReactNode;
}

export default function CommitteeDetailShell({
  editionTitle,
  children,
}: CommitteeDetailShellProps) {
  return (
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
          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-saffron-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
        >
          ← Back to Committee Timeline
        </Link>
      </p>
    </div>
  );
}
