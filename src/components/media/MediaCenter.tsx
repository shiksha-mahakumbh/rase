"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import ShowcaseHero from "@/components/showcase/ShowcaseHero";
import AdSlotRegion from "@/components/showcase/AdSlotRegion";
import { socialLinks } from "@/app/component/footer-content";
import {
  MEDIA_ARCHIVE_ITEMS,
  MEDIA_HUB_LINKS,
  PRESS_COVERAGE_LINKS,
  type MediaFilter,
} from "@/data/media-archives";

const FILTERS: { id: MediaFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "editions", label: "Editions" },
  { id: "digital", label: "Digital Media" },
  { id: "print", label: "Print Media" },
  { id: "press", label: "Press" },
  { id: "gallery", label: "Gallery" },
];

export default function MediaCenter() {
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<MediaFilter>("all");

  const toggle = (label: string) => setOpen(open === label ? null : label);

  const showEditions = filter === "all" || filter === "editions" || filter === "digital" || filter === "print";
  const showPress = filter === "all" || filter === "press";
  const showGallery = filter === "all" || filter === "gallery";

  const featured = MEDIA_ARCHIVE_ITEMS[0];

  const editionItems = useMemo(() => {
    if (filter === "digital") {
      return MEDIA_ARCHIVE_ITEMS.map((item) => ({
        ...item,
        children: item.children.filter((c) => c.label === "Digital Media"),
      }));
    }
    if (filter === "print") {
      return MEDIA_ARCHIVE_ITEMS.map((item) => ({
        ...item,
        children: item.children.filter((c) => c.label === "Print Media"),
      }));
    }
    return MEDIA_ARCHIVE_ITEMS;
  }, [filter]);

  return (
    <>
      <ShowcaseHero
        eyebrow="Media Centre"
        title={
          <>
            झलकियाँ – शिक्षा महाकुंभ अभियान
            <span className="mt-2 block text-2xl font-semibold text-white/90 md:text-3xl">
              Glimpses of Shiksha Mahakumbh Abhiyan
            </span>
          </>
        }
        subtitle={
          <p>
            <span className="font-semibold">Shiksha Mahakumbh Abhiyan</span> is a
            national initiative uniting thinkers, academicians, innovators, and youth —
            building Bharat&apos;s educational vision for a global future.
          </p>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Education", href: "/education" },
            { label: "Media & Press" },
          ]}
          className="mb-8"
        />

        {/* Category filters */}
        <div
          className="mb-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Media categories"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`min-h-[40px] rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f.id
                  ? "bg-brand-navy text-white"
                  : "bg-white text-brand-navy ring-1 ring-slate-200 hover:ring-brand-saffron/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Featured */}
        {showEditions && (
          <section className="mb-12" aria-labelledby="featured-media">
            <h2 id="featured-media" className="mb-6 text-2xl font-bold text-brand-navy">
              Featured Coverage
            </h2>
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
              <div className="relative h-56 md:h-72">
                <Image
                  src={featured.image}
                  alt={`${featured.engLabel} Glimpses`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${featured.color} opacity-75`}
                />
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-wider text-brand-saffron/90">
                    Featured Edition
                  </p>
                  <h3 className="text-2xl font-bold md:text-3xl">{featured.label}</h3>
                  <p className="mt-1 text-sm opacity-90">{featured.theme}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 p-6">
                {featured.children.map((child, i) => (
                  <Link
                    key={i}
                    href={child.link}
                    className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-light"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <AdSlotRegion />

        {/* Edition archives */}
        {showEditions && (
          <section className="mb-12" aria-labelledby="media-archives">
            <h2
              id="media-archives"
              className="mb-8 text-center text-2xl font-bold text-brand-navy md:text-3xl"
            >
              Media Archives – <span className="text-brand-saffron-dark">शिक्षा महाकुंभ अभियान</span>
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {editionItems.map((item, index) => (
                <article
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <Image
                      src={item.image}
                      alt={`${item.engLabel} Glimpses`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-80`}
                    />
                    <div className="absolute bottom-3 left-0 w-full text-center text-white">
                      <h3 className="text-lg font-semibold">{item.label}</h3>
                      <p className="text-xs opacity-90">{item.theme}</p>
                      <span className="mt-1 inline-block rounded-full bg-white/30 px-3 py-0.5 text-xs">
                        {item.year}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col gap-2">
                      {item.children.map((child, i) => (
                        <Link
                          key={i}
                          href={child.link}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-navy text-sm font-medium text-white hover:bg-brand-navy-light"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                    {item.archive && item.archive.length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => toggle(item.label)}
                          className="mt-4 w-full text-sm font-semibold text-brand-saffron-dark hover:underline"
                          aria-expanded={open === item.label}
                        >
                          {open === item.label
                            ? "Hide Archived Media ▲"
                            : "View Archived Media ▼"}
                        </button>
                        {open === item.label && (
                            <div className="animate-fade-in mt-4 border-t border-slate-100 pt-4">
                              {item.archive.map((arch, j) => (
                                <div key={j} className="mb-4">
                                  <h4 className="mb-2 text-center text-sm font-semibold text-brand-navy">
                                    {arch.label} ({arch.year})
                                  </h4>
                                  <div className="flex flex-col gap-2">
                                    {arch.children.map((child, k) => (
                                      <Link
                                        key={k}
                                        href={child.link}
                                        className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-gray-700 hover:bg-slate-100"
                                      >
                                        {child.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Press coverage */}
        {showPress && (
          <section className="mb-12" aria-labelledby="press-coverage">
            <h2 id="press-coverage" className="mb-6 text-2xl font-bold text-brand-navy">
              Press Coverage
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PRESS_COVERAGE_LINKS.map((press) => (
                <Link
                  key={press.href}
                  href={press.href}
                  className="rounded-xl border border-slate-100 bg-white p-4 text-sm font-semibold text-brand-navy shadow-sm transition hover:border-brand-saffron/40 hover:shadow-md"
                >
                  📰 {press.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Gallery & publications hub */}
        {showGallery && (
          <section className="mb-12" aria-labelledby="media-hub">
            <h2 id="media-hub" className="mb-6 text-2xl font-bold text-brand-navy">
              Photo, Video & Publications
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MEDIA_HUB_LINKS.map((hub) => (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-saffron/40 hover:shadow-md"
                >
                  <span className="text-2xl" aria-hidden>
                    {hub.icon}
                  </span>
                  <span className="font-semibold text-brand-navy">{hub.label}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Social */}
        <section className="mb-8 rounded-2xl border border-brand-navy/10 bg-gradient-to-br from-brand-navy/5 to-brand-surface-warm p-6 md:p-8" aria-labelledby="social-media">
          <h2 id="social-media" className="mb-4 text-xl font-bold text-brand-navy">
            Follow Shiksha Mahakumbh
          </h2>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-light"
              >
                {s.label}
              </a>
            ))}
          </div>
        </section>

        <p className="text-center text-base leading-relaxed text-gray-600">
          Discover the inspiring journey of{" "}
          <span className="font-semibold text-brand-navy">शिक्षा महाकुंभ अभियान</span> —
          where education meets innovation and culture. Join us in building Bharat&apos;s
          educational vision for the world.
        </p>
      </div>
    </>
  );
}
