import { governmentEngagement } from "@/data/authority";
import { SectionHeader } from "@/components/ui";

interface Props {
  className?: string;
}

export default function GovernmentEngagementSection({ className = "" }: Props) {
  return (
    <section
      aria-label="Government and policy engagement"
      className={`border-y border-slate-200 bg-amber-50/50 py-12 md:py-16 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Policy alignment"
          title="Government & National Vision"
          description="Engagement aligned with NEP 2020, Bharat @ 2047, and state participation."
          align="center"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {governmentEngagement.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-sm"
            >
              {item.icon && (
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
              )}
              <h3 className="mt-2 font-bold text-brand-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
