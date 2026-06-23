"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants/routes";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";
import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";

type InsightItem = {
  title: string;
  date: string;
  author: string;
  href: string;
  tag: string;
  accent: string;
  tagBg: string;
  external: boolean;
};

const DEFAULT_INSIGHTS: InsightItem[] = [
  {
    title: "NEP 2020 Implementation Frameworks",
    date: "2026",
    author: "Academic Council",
    href: "/departments/academic-council",
    tag: "Policy",
    accent: "from-brand-blue/20 to-brand-blue/5",
    tagBg: "bg-brand-blue",
    external: false,
  },
  {
    title: "Research Proceedings & Souvenir",
    date: "2025",
    author: "SMK Proceedings",
    href: "/publications/souvenir-abstracts-mtc",
    tag: "Research",
    accent: "from-brand-saffron/25 to-brand-saffron/5",
    tagBg: "bg-brand-saffron",
    external: false,
  },
  {
    title: "Multi Track Conference",
    date: "Open",
    author: "Research Track",
    href: CMT_SUBMISSION_URL,
    tag: "Submit",
    accent: "from-brand-emerald/20 to-brand-emerald/5",
    tagBg: "bg-brand-emerald",
    external: true,
  },
  {
    title: "Past Editions & Proceedings",
    date: "Archive",
    author: "SMK History",
    href: "/past-events",
    tag: "Editions",
    accent: "from-violet-200/80 to-violet-50",
    tagBg: "bg-violet-600",
    external: false,
  },
];

const ACCENT_PRESETS = [
  { accent: "from-brand-blue/20 to-brand-blue/5", tagBg: "bg-brand-blue" },
  { accent: "from-brand-saffron/25 to-brand-saffron/5", tagBg: "bg-brand-saffron" },
  { accent: "from-brand-emerald/20 to-brand-emerald/5", tagBg: "bg-brand-emerald" },
  { accent: "from-violet-200/80 to-violet-50", tagBg: "bg-violet-600" },
];

function InsightCard({ item }: { item: InsightItem }) {
  const inner = (
    <>
      <div
        className={`relative flex aspect-[16/10] items-end bg-gradient-to-br p-5 ${item.accent}`}
      >
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${item.tagBg}`}>
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
      <a
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
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

export default function DiscoverStrip() {
  const cms = useCms();
  const discover = getSection(cms?.homepage, "discover");
  const cmsItems = sectionItems<{
    title?: string;
    date?: string;
    author?: string;
    href?: string;
    url?: string;
    tag?: string;
    external?: boolean;
  }>(discover, "items");

  const insights: InsightItem[] =
    cmsItems.length > 0
      ? cmsItems.map((item, index) => {
          const preset = ACCENT_PRESETS[index % ACCENT_PRESETS.length];
          const href = item.href ?? item.url ?? "/";
          const external =
            item.external ?? (href.startsWith("http://") || href.startsWith("https://"));
          return {
            title: item.title ?? "Update",
            date: item.date ?? "2026",
            author: item.author ?? "SMK",
            href,
            tag: item.tag ?? "News",
            accent: preset.accent,
            tagBg: preset.tagBg,
            external,
          };
        })
      : DEFAULT_INSIGHTS;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-surface-warm to-white py-12 md:py-16">
      <div className="brand-grid-pattern pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={sectionField(discover, "eyebrow", "Insights & Updates")}
          title={sectionField(discover, "title", "Research Highlights & Announcements")}
          description={sectionField(
            discover,
            "description",
            "Policy, research, and conclave updates from Shiksha Mahakumbh Abhiyan."
          )}
        />
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
