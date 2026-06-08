"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CtaButton } from "@/components/ui";

const items = [
  {
    label: "शिक्षा महाकुंभ 4.0",
    engLabel: "Shiksha Mahakumbh 4.0",
    year: "2024",
    theme: "Indian Education System for Global Development",
    color: "from-brand-navy to-brand-navy-light",
    image: "/images/smk4.jpg",
    children: [
      { label: "Digital Media", link: "/media/shiksha-mahakumbh/2024/digital" },
      { label: "Print Media", link: "/media/shiksha-mahakumbh/2024/print" },
    ],
    archive: [
      {
        year: "2023",
        label: "शिक्षा महाकुंभ 1.0",
        engLabel: "Shiksha Mahakumbh 1.0",
        children: [
          { label: "Digital Media", link: "/media/shiksha-mahakumbh/2023/digital" },
          { label: "Print Media", link: "/media/shiksha-mahakumbh/2023/print" },
        ],
      },
    ],
  },
  {
    label: "शिक्षा महाकुंभ 3.0",
    engLabel: "Shiksha Mahakumbh 3.0",
    year: "2024",
    theme: "Role of Startups in Developing Economy",
    color: "from-brand-saffron-dark to-brand-saffron",
    image: "/images/smk3.jpg",
    children: [
      { label: "Digital Media", link: "/media/shiksha-kumbh/2024/digital" },
      { label: "Print Media", link: "/media/shiksha-kumbh/2024/print" },
    ],
    archive: [
      {
        year: "2023",
        label: "शिक्षा महाकुंभ 2.0",
        engLabel: "Shiksha Mahakumbh 2.0",
        children: [
          { label: "Digital Media", link: "/media/shiksha-kumbh/2023/digital" },
          { label: "Print Media", link: "/media/shiksha-kumbh/2023/print" },
        ],
      },
    ],
  },
];

export default function GlimpsesContent() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (label: string) => setOpen(open === label ? null : label);

  return (
    <div>
      <h2 className="home-section-title mb-10 text-center">
        Media Archives — <span className="text-brand-saffron">शिक्षा महाकुंभ अभियान</span>
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.label}
            className="home-card-hover overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative">
              <Image
                src={item.image}
                alt={`${item.engLabel} Glimpses`}
                width={800}
                height={400}
                className="h-52 w-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-80`}
                aria-hidden
              />
              <div className="absolute bottom-3 left-0 w-full text-center text-white">
                <h3 className="text-xl font-semibold">{item.label}</h3>
                <p className="text-sm opacity-90">{item.theme}</p>
                <span className="mt-1 inline-block rounded-full bg-white/30 px-3 py-1 text-xs">
                  {item.year}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-3">
                {item.children.map((child) => (
                  <CtaButton
                    key={child.link}
                    href={child.link}
                    variant="secondary"
                    className="w-full"
                  >
                    {child.label}
                  </CtaButton>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => toggle(item.label)}
                  className="text-sm font-semibold text-brand-navy transition hover:text-brand-saffron"
                  aria-expanded={open === item.label}
                >
                  {open === item.label ? "Hide Archived Media ▲" : "View Archived Media ▼"}
                </button>
              </div>

              {open === item.label && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  {item.archive.map((arch) => (
                    <div key={arch.label} className="mb-3">
                      <h4 className="mb-2 text-center text-sm font-semibold text-brand-navy">
                        {arch.label} ({arch.year})
                      </h4>
                      <div className="flex flex-col gap-2">
                        {arch.children.map((child) => (
                          <Link
                            key={child.link}
                            href={child.link}
                            className="block rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-center text-sm font-medium text-brand-navy transition hover:border-brand-saffron/40 hover:bg-white"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-14 max-w-3xl text-center text-base leading-relaxed text-slate-600">
        Discover the inspiring journey of{" "}
        <strong className="text-brand-navy">शिक्षा महाकुंभ अभियान</strong> — where education
        meets innovation and culture.
      </p>
    </div>
  );
}
