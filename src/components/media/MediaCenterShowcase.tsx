"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import { socialLinks } from "@/components/layout/footer-content";
import {
  MEDIA_CENTER_PAGE_HERO,
  MEDIA_CENTER_STATS,
  MEDIA_EDITION_CARDS,
  MEDIA_FEATURED_EDITION,
  MEDIA_QUICK_LINKS,
  MEDIA_RESOURCE_LINKS,
  PRESS_HIGHLIGHT_LINKS,
  mediaCategoryLabel,
  mediaEditionImageAlt,
  partitionMediaItems,
  type MediaCenterTab,
} from "@/data/media-center-hub";
import type { CmsMediaCenterItem } from "@/lib/cms/types";

const TABS: { id: MediaCenterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "editions", label: "Editions" },
  { id: "press", label: "Press" },
  { id: "gallery", label: "Gallery & Video" },
];

type Props = {
  cmsItems?: CmsMediaCenterItem[];
};

export default function MediaCenterShowcase({ cmsItems = [] }: Props) {
  const [tab, setTab] = useState<MediaCenterTab>("all");
  const { press, highlights } = useMemo(() => partitionMediaItems(cmsItems), [cmsItems]);

  const showEditions = tab === "all" || tab === "editions";
  const showEditionArchives = tab === "all" || tab === "editions" || tab === "gallery";
  const showPress = tab === "all" || tab === "press";
  const showGallery = tab === "all" || tab === "gallery";
  const showLatest = tab === "all" && highlights.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Media Centre" },
        ]}
        className="mb-6"
      />

      <HubGradientBanner
        id="media-center-banner"
        eyebrow={MEDIA_CENTER_PAGE_HERO.eyebrow}
        title={
          <>
            <span>Media &amp; Archives</span>
            <span className="mt-1 block text-xl text-brand-saffron md:text-2xl">
              झलकियाँ – शिक्षा महाकुंभ अभियान
            </span>
          </>
        }
        subtitle={MEDIA_CENTER_PAGE_HERO.subtitle}
        stats={MEDIA_CENTER_STATS}
        titleAs="h1"
      />

      <div
        className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Media categories"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition min-h-[44px] ${
              tab === t.id
                ? "bg-brand-navy text-white shadow-sm"
                : "bg-white text-brand-navy ring-1 ring-slate-200 hover:ring-brand-saffron/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(tab === "all" || tab === "gallery") && (
        <section className="mt-8" aria-labelledby="media-quick-links">
          <h2 id="media-quick-links" className="sr-only">
            Quick media links
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MEDIA_QUICK_LINKS.map((link) => {
              const external = "external" in link && link.external;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-saffron/40 hover:shadow-lg"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${link.accent}`} aria-hidden />
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-2xl" aria-hidden>
                      {link.icon}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-brand-navy group-hover:text-brand-blue md:text-base">
                      {link.label}
                      {external && <span className="ml-1 text-xs font-normal text-slate-400">↗</span>}
                    </h3>
                    <p className="mt-1 flex-1 text-xs text-slate-600 md:text-sm">{link.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {showEditions && (
        <section className="mt-10" aria-labelledby="featured-edition">
          <h2 id="featured-edition" className="text-lg font-bold text-brand-navy md:text-xl">
            Featured edition coverage
          </h2>
          <FeaturedEditionCard edition={MEDIA_FEATURED_EDITION} />
        </section>
      )}

      {showLatest && (
        <section className="mt-10" aria-labelledby="latest-media">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <h2 id="latest-media" className="text-lg font-bold text-brand-navy md:text-xl">
              Latest highlights
            </h2>
            <p className="text-xs text-slate-500">Curated from the media centre — no duplicates</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.slice(0, 6).map((item) => (
              <li key={item.id}>
                <CmsMediaCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {showEditionArchives && (
        <section className="mt-10" aria-labelledby="edition-archives">
          <h2 id="edition-archives" className="text-lg font-bold text-brand-navy md:text-xl">
            Edition archives
            <span className="mt-1 block text-sm font-normal text-slate-600">
              Digital &amp; print media — editions 1.0 through 5.0
            </span>
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MEDIA_EDITION_CARDS.map((edition) => (
              <EditionArchiveCard key={edition.id} edition={edition} />
            ))}
          </div>
        </section>
      )}

      {showGallery && (
        <section className="mt-10" aria-labelledby="gallery-resources">
          <h2 id="gallery-resources" className="text-lg font-bold text-brand-navy md:text-xl">
            Publications &amp; programme resources
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MEDIA_RESOURCE_LINKS.map((link) => {
              const external = "external" in link && link.external;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex min-h-[44px] items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-md"
                >
                  <span aria-hidden>{link.icon}</span>
                  {link.label}
                  {external && <span className="ml-auto text-xs text-slate-400">↗</span>}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {showPress && (
        <section className="mt-10" aria-labelledby="press-coverage">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <h2 id="press-coverage" className="text-lg font-bold text-brand-navy md:text-xl">
              Press coverage
            </h2>
            <Link href="/press" className="text-sm font-semibold text-brand-blue hover:text-brand-saffron">
              All releases →
            </Link>
          </div>

          {press.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {press.slice(0, 9).map((item) => (
                <li key={item.id}>
                  <CmsMediaCard item={item} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PRESS_HIGHLIGHT_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy shadow-sm transition hover:border-brand-saffron/40 hover:shadow-md"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section
        className="mt-10 rounded-2xl border border-brand-navy/10 bg-gradient-to-br from-brand-navy/5 to-brand-surface-warm p-5 md:p-8"
        aria-labelledby="social-media"
      >
        <h2 id="social-media" className="text-lg font-bold text-brand-navy">
          Follow Shiksha Mahakumbh
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          National coverage and global education dialogue — join us on social platforms.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
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
    </div>
  );
}

function FeaturedEditionCard({
  edition,
}: {
  edition: (typeof MEDIA_EDITION_CARDS)[number];
}) {
  const imageAlt = mediaEditionImageAlt(edition);
  return (
    <article className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="relative h-52 md:h-64">
        <Image
          src={edition.imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1152px"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${edition.accent} opacity-80`} />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            Edition {edition.edition} · {edition.year}
          </span>
          <h3 className="mt-2 text-xl font-bold md:text-2xl">{edition.title}</h3>
          <p className="mt-1 text-sm text-white/90 line-clamp-2">{edition.theme}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 p-4 md:p-5">
        <MediaAction href={edition.digitalHref} label="Digital Media" />
        <MediaAction href={edition.printHref} label="Print Media" />
        {edition.galleryHref && (
          <MediaAction href={edition.galleryHref} label="Photo Album" external />
        )}
        <MediaAction href={edition.eventHref} label="Edition Archive" variant="outline" />
      </div>
    </article>
  );
}

function EditionArchiveCard({
  edition,
}: {
  edition: (typeof MEDIA_EDITION_CARDS)[number];
}) {
  const imageAlt = mediaEditionImageAlt(edition);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`h-1.5 bg-gradient-to-r ${edition.accent}`} aria-hidden />
      <div className="relative h-36 w-full bg-slate-100">
        <Image
          src={edition.imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 50vw, 33vw"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${edition.accent} opacity-70`} />
        <div className="absolute bottom-2 left-3 right-3 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
            Edition {edition.edition}
          </p>
          <p className="text-sm font-bold line-clamp-1">{edition.venue}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-bold uppercase tracking-wide text-brand-saffron-dark">
          Edition {edition.edition} · {edition.year}
        </span>
        <h3 className="mt-1 text-sm font-bold text-brand-navy">{edition.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-600">{edition.theme}</p>
        <div className="mt-3 flex flex-col gap-2">
          <MediaAction href={edition.digitalHref} label="Digital" small />
          <MediaAction href={edition.printHref} label="Print" small />
          {edition.galleryHref && (
            <MediaAction href={edition.galleryHref} label="Photos" small external />
          )}
        </div>
        <Link
          href={edition.eventHref}
          className="mt-3 text-xs font-semibold text-brand-blue hover:text-brand-saffron"
        >
          View edition →
        </Link>
      </div>
    </article>
  );
}

function CmsMediaCard({ item }: { item: CmsMediaCenterItem }) {
  const external = item.href.startsWith("http");

  return (
    <Link
      href={item.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-saffron/40 hover:shadow-md"
    >
      {item.imageUrl ? (
        <div className="relative aspect-video bg-slate-100">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-1.5 bg-gradient-to-r from-brand-navy to-brand-saffron/80" aria-hidden />
      )}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[10px] font-bold uppercase tracking-wide text-brand-saffron-dark">
          {mediaCategoryLabel(item.category)}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-brand-navy group-hover:text-brand-blue md:text-base">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-xs text-slate-600">{item.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

function MediaAction({
  href,
  label,
  external,
  small,
  variant = "solid",
}: {
  href: string;
  label: string;
  external?: boolean;
  small?: boolean;
  variant?: "solid" | "outline";
}) {
  const className =
    variant === "outline"
      ? `inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white font-semibold text-brand-navy hover:border-brand-saffron/40 ${small ? "min-h-[40px] px-3 py-2 text-xs" : "min-h-[44px] px-4 py-2.5 text-sm"}`
      : `inline-flex items-center justify-center rounded-lg bg-brand-navy font-semibold text-white hover:bg-brand-navy-light ${small ? "min-h-[40px] px-3 py-2 text-xs" : "min-h-[44px] px-4 py-2.5 text-sm"}`;

  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label} ↗
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
