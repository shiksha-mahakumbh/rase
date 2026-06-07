import Link from "next/link";
import { researchOutput } from "@/data/authority";
import { SectionHeader } from "@/components/ui";

interface Props {
  className?: string;
}

export default function ResearchOutputSection({ className = "" }: Props) {
  return (
    <section aria-label="Research output" className={`py-12 md:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Knowledge platform"
          title="Research Output"
          description="Proceedings, journals, and student research integrated with the summit."
          align="center"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {researchOutput.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-saffron/40 hover:shadow-md"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-brand-saffron">
                {item.type}
              </span>
              <h3 className="mt-2 font-bold text-brand-navy group-hover:text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
