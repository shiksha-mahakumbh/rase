"use client";

import Image from "next/image";
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
  imageSrc: string;
  imageAlt: string;
  external: boolean;
};

const DEFAULT_INSIGHTS: InsightItem[] = [
  {
    title: "NEP 2020 Implementation Frameworks",
    date: "2026",
    author: "Academic Council",
    href: "/departments/academic-council",
    tag: "Policy",
    accent: "from-brand-blue/60 to-brand-blue/20",
    tagBg: "bg-brand-blue",
    imageSrc: "/2024M/Press8.jpg",
    imageAlt: "NEP 2020 policy session at Shiksha Mahakumbh",
    external: false,
  },
  {
    title: "Research Proceedings & Souvenir",
    date: "2025",
    author: "SMK Proceedings",
    href: "/publications/souvenir-abstracts-mtc",
    tag: "Research",
    accent: "from-brand-saffron/50 to-brand-saffron/15",
    tagBg: "bg-brand-saffron",
    imageSrc: "/2024M/Vyakhanmala.jpg",
    imageAlt: "Research proceedings release at Shiksha Mahakumbh",
    external: false,
  },
  {
    title: "Multi Track Conference",
    date: "Open",
    author: "Research Track",
    href: CMT_SUBMISSION_URL,
    tag: "Submit",
    accent: "from-brand-emerald/50 to-brand-emerald/15",
    tagBg: "bg-brand-emerald",
    imageSrc: "/2024M/Press7.jpg",
    imageAlt: "Multi Track Conference inauguration",
    external: true,
  },
  {
    title: "Past Editions & Proceedings",
    date: "Archive",
    author: "SMK History",
    href: "/past-events",
    tag: "Editions",
    accent: "from-brand-violet/50 to-brand-violet/15",
    tagBg: "bg-brand-violet",
    imageSrc: "/2024K/k6.jpg",
    imageAlt: "Past Shiksha Mahakumbh edition ceremony",
    external: false,
  },
];

const ACCENT_PRESETS = [
  {
    accent: "from-brand-blue/60 to-brand-blue/20",
    tagBg: "bg-brand-blue",
    imageSrc: "/2024M/Press8.jpg",
    imageAlt: "Shiksha Mahakumbh highlight",
  },
  {
    accent: "from-brand-saffron/50 to-brand-saffron/15",
    tagBg: "bg-brand-saffron",
    imageSrc: "/2024M/Vyakhanmala.jpg",
    imageAlt: "Shiksha Mahakumbh highlight",
  },
  {
    accent: "from-brand-emerald/50 to-brand-emerald/15",
    tagBg: "bg-brand-emerald",
    imageSrc: "/2024M/Press7.jpg",
    imageAlt: "Shiksha Mahakumbh highlight",
  },
  {
    accent: "from-brand-violet/50 to-brand-violet/15",
    tagBg: "bg-brand-violet",
    imageSrc: "/2024K/k6.jpg",
    imageAlt: "Shiksha Mahakumbh highlight",
  },
];

function InsightCard({ item }: { item: InsightItem }) {
  const inner = (
    <>
      <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${item.accent}`}>
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 via-transparent to-transparent" />
        <span
          className={`absolute bottom-4 left-4 rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${item.tagBg}`}
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
    imageSrc?: string;
    imageAlt?: string;
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
            imageSrc: item.imageSrc ?? preset.imageSrc,
            imageAlt: item.imageAlt ?? item.title ?? "Shiksha Mahakumbh update",
            external,
          };
        })
      : DEFAULT_INSIGHTS;

  return (
    <section
      id="discover"
      className="bg-gradient-to-b from-brand-surface-warm to-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
