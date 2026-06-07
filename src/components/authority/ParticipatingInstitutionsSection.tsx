import { participatingInstitutions } from "@/data/authority";
import { SectionHeader } from "@/components/ui";

interface Props {
  className?: string;
}

export default function ParticipatingInstitutionsSection({
  className = "",
}: Props) {
  return (
    <section
      aria-label="Participating institutions"
      className={`bg-brand-navy py-12 text-white md:py-16 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Academic network"
          title="Participating Institutions"
          description="National institutes, universities, and research bodies."
          align="center"
          className="[&_h2]:text-white [&_p]:text-white/80 [&_span]:text-brand-saffron"
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {participatingInstitutions.map((inst) => (
            <li
              key={`${inst.name}-${inst.role}`}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3"
            >
              <p className="font-semibold">{inst.name}</p>
              <p className="mt-1 text-sm text-white/75">{inst.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
