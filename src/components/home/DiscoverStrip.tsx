import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/ui";
import { EDITION_FRAME_IMAGES } from "@/data/abhiyan-photo-frame-images";

const insights = [
  {
    title: "NEP 2020 Implementation Frameworks",
    date: "2026",
    author: "Academic Council",
    href: "/departments/academic-council",
    tag: "Policy",
    accent: "bg-brand-blue",
    image: "/abhiyan-photo-frame/pages/page-03.jpg",
  },
  {
    title: "Research Proceedings & Souvenir",
    date: "2025",
    author: "SMK Proceedings",
    href: "/proceedings",
    tag: "Research",
    accent: "bg-brand-saffron",
    image: "/abhiyan-photo-frame/pages/page-31.jpg",
  },
  {
    title: "Multi Track Conference",
    date: "Open",
    author: "Research Track",
    href: "https://cmt3.research.microsoft.com/ShikshaMahakumbh2025/",
    tag: "Submit",
    accent: "bg-brand-emerald",
    image: "/abhiyan-photo-frame/pages/page-30.jpg",
  },
  {
    title: "Upcoming Edition — NIT Hamirpur",
    date: "Oct 2026",
    author: "Events",
    href: "/upcoming-events",
    tag: "Event",
    accent: "bg-violet-600",
    image: EDITION_FRAME_IMAGES["5.0"].hero,
  },
];

export default function DiscoverStrip() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-surface-warm to-white py-12 md:py-16">
      <div className="brand-grid-pattern pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Insights & Updates"
          title="Research Highlights & Announcements"
          description="Policy, research, conclaves, and edition updates — curated from the Abhiyan photo frame."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {insights.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-saffron/40 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover object-top transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${item.accent}`}
                >
                  {item.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-saffron">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500">
                  <time dateTime="2026">{item.date}</time> · {item.author}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
