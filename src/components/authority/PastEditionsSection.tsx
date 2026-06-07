import Link from "next/link";
import { pastEditions } from "@/data/authority";
import { SectionHeader, TimelineCard } from "@/components/ui";

interface Props {
  className?: string;
}

export default function PastEditionsSection({ className = "" }: Props) {
  return (
    <section aria-label="Past editions" className={`bg-slate-50 py-12 md:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Heritage"
          title="Past Editions"
          description="A growing national movement spanning Shiksha Kumbh and Shiksha Mahakumbh."
          align="center"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pastEditions.map((edition, i) => (
            <div key={edition.year} className="flex flex-col gap-3">
              <TimelineCard
                year={edition.year}
                title={edition.title}
                location={edition.venue}
                highlight={edition.highlight}
                active={i === 0}
              />
              {edition.href && (
                <Link
                  href={edition.href}
                  className="text-sm font-semibold text-brand-saffron hover:underline"
                >
                  Explore archive →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
