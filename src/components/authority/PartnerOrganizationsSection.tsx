import { partnerOrganizations } from "@/data/authority";
import { SectionHeader } from "@/components/ui";

interface Props {
  className?: string;
}

export default function PartnerOrganizationsSection({ className = "" }: Props) {
  return (
    <section aria-label="Partner organizations" className={`py-12 md:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Ecosystem"
          title="Partner Organizations"
          description="Education, media, CSR, and knowledge partners."
          align="center"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partnerOrganizations.map((org) => (
            <article
              key={org.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-brand-saffron">
                {org.category}
              </span>
              <h3 className="mt-2 font-bold text-brand-navy">{org.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{org.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
