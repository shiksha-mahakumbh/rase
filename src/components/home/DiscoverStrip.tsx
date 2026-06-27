import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";
import type { DiscoverContent, DiscoverInsight } from "@/lib/home/build-home-sections";

function InsightCard({ item }: { item: DiscoverInsight }) {
  const inner = (
    <>
      <div
        className={`relative flex min-h-[5.5rem] items-end overflow-hidden rounded-t-2xl bg-gradient-to-br ${item.accent} p-5`}
      >
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${item.tagBg}`}
        >
          {item.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-saffron">
          {item.title}
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          <time dateTime={item.date}>{item.date}</time> · {item.author}
        </p>
      </div>
    </>
  );

  const className =
    "group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-saffron/40 hover:shadow-lg";

  if (item.external) {
    const safeHref = sanitizeExternalUrl(item.href);
    if (!safeHref) {
      return <div className={className}>{inner}</div>;
    }
    return (
      <a href={safeHref} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {inner}
    </Link>
  );
}

export default function DiscoverStrip({ content }: { content: DiscoverContent }) {
  const { eyebrow, title, description, insights } = content;

  return (
    <section
      id="discover"
      className="bg-gradient-to-b from-brand-surface-warm to-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {insights.map((item) => (
            <InsightCard key={item.title} item={item} />
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">
          For edition dates and venues, see{" "}
          <Link href={ROUTES.upcomingEvents} className="font-semibold text-brand-navy underline">
            upcoming events
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
