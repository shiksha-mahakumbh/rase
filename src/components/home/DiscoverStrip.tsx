import Link from "next/link";
import { SectionHeader } from "@/components/ui";

const insights = [
  {
    title: "NEP 2020 Implementation Frameworks",
    date: "2026",
    author: "Academic Council",
    href: "/departments/academic-council",
    tag: "Policy",
  },
  {
    title: "Research Proceedings & Souvenir",
    date: "2025",
    author: "SMK Proceedings",
    href: "/proceedings",
    tag: "Research",
  },
  {
    title: "Abstract Submission Guidelines",
    date: "Open",
    author: "Research Track",
    href: "/abstract",
    tag: "Submit",
  },
  {
    title: "Upcoming Edition — NIT Hamirpur",
    date: "Oct 2026",
    author: "Events",
    href: "/upcoming-events",
    tag: "Event",
  },
];

export default function DiscoverStrip() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Insights & Updates"
          title="Research Highlights & Announcements"
          description="Editorial cards for discoverability — policy, research, and event updates."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {insights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-brand-surface p-5 transition hover:border-brand-saffron/40 hover:shadow-md"
            >
              <span className="w-fit rounded-full bg-brand-navy/10 px-2 py-0.5 text-xs font-bold text-brand-navy">
                {item.tag}
              </span>
              <h3 className="mt-3 text-base font-bold text-brand-navy group-hover:text-brand-saffron">
                {item.title}
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                <time dateTime="2026">{item.date}</time> · {item.author}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
