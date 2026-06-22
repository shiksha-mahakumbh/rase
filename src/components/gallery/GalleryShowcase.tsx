"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import HubGradientBanner from "@/components/ui/HubGradientBanner";
import {
  GALLERY_EDITIONS,
  GALLERY_PAGE_HERO,
  GALLERY_STATS,
  YOUTUBE_CHANNEL_URL,
  type GalleryTab,
} from "@/data/gallery-hub";

const TABS: { id: GalleryTab; label: string; description: string }[] = [
  {
    id: "photos",
    label: "Photos",
    description: "Google Drive albums & on-site galleries by edition",
  },
  {
    id: "videos",
    label: "Videos",
    description: "Documentaries & coverage on our YouTube channel",
  },
];

function tabFromParam(value: string | null): GalleryTab {
  return value === "videos" ? "videos" : "photos";
}

export default function GalleryShowcase() {
  const reduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = tabFromParam(searchParams.get("tab"));

  const setTab = (tab: GalleryTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "photos") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(query ? `/gallery?${query}` : "/gallery", { scroll: false });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <HubGradientBanner
        id="gallery-banner"
        eyebrow={GALLERY_PAGE_HERO.eyebrow}
        title={GALLERY_PAGE_HERO.title}
        subtitle={GALLERY_PAGE_HERO.subtitle}
        stats={GALLERY_STATS}
      />

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Gallery sections"
        className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        {TABS.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`gallery-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`gallery-panel-${tab.id}`}
              onClick={() => setTab(tab.id)}
              className={`flex flex-1 flex-col rounded-2xl border px-4 py-3 text-left transition md:px-5 md:py-4 ${
                selected
                  ? "border-brand-saffron bg-brand-saffron/10 shadow-sm ring-1 ring-brand-saffron/30"
                  : "border-slate-200 bg-white hover:border-brand-navy/20 hover:bg-slate-50"
              }`}
            >
              <span
                className={`text-sm font-bold md:text-base ${
                  selected ? "text-brand-navy" : "text-slate-700"
                }`}
              >
                {tab.label}
              </span>
              <span className="mt-1 text-xs text-slate-500 md:text-sm">{tab.description}</span>
            </button>
          );
        })}
      </div>

      {/* Photos panel */}
      <section
        role="tabpanel"
        id="gallery-panel-photos"
        aria-labelledby="gallery-tab-photos"
        hidden={activeTab !== "photos"}
        className="mt-8"
      >
        <h3 className="sr-only">Photo albums by edition</h3>
        <div className="grid gap-5 md:grid-cols-2">
          {GALLERY_EDITIONS.map((edition, index) => (
            <EditionPhotoCard
              key={edition.id}
              edition={edition}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </section>

      {/* Videos panel */}
      <section
        role="tabpanel"
        id="gallery-panel-videos"
        aria-labelledby="gallery-tab-videos"
        hidden={activeTab !== "videos"}
        className="mt-8"
      >
        <div className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-white p-5 md:p-6">
          <p className="text-sm font-semibold text-brand-navy">Official YouTube Channel</p>
          <p className="mt-1 text-sm text-slate-600">
            Tap any edition below to open{" "}
            <strong>@ShikshaMahakumbh</strong> — documentaries, conclave sessions, and national
            coverage.
          </p>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
          >
            Subscribe on YouTube
            <span aria-hidden>↗</span>
          </a>
        </div>
        <h3 className="sr-only">Videos by edition</h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_EDITIONS.map((edition, index) => (
            <EditionVideoCard
              key={edition.id}
              edition={edition}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

type EditionCardProps = {
  edition: (typeof GALLERY_EDITIONS)[number];
  index: number;
  reduceMotion: boolean | null;
};

function EditionPhotoCard({ edition, index, reduceMotion }: EditionCardProps) {
  const comingSoon = edition.status === "coming_soon";

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: reduceMotion ? 0 : index * 0.06 }}
      className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm ${
        comingSoon ? "border-slate-200 opacity-95" : "border-slate-200 hover:border-brand-saffron/30 hover:shadow-md"
      }`}
    >
      <div className={`h-2 bg-gradient-to-r ${edition.accent}`} aria-hidden />
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-navy">
            Edition {edition.edition}
          </span>
          {comingSoon && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
              Will be updated soon
            </span>
          )}
        </div>
        <h4 className="text-lg font-bold text-brand-navy">{edition.title}</h4>
        <p className="mt-1 text-sm text-slate-600">{edition.theme}</p>
        <dl className="mt-3 space-y-1 text-xs text-slate-500 md:text-sm">
          <div className="flex gap-2">
            <dt className="font-semibold text-brand-navy">Venue</dt>
            <dd>{edition.venue}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold text-brand-navy">Dates</dt>
            <dd>{edition.dates}</dd>
          </div>
        </dl>

        {comingSoon ? (
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Photo albums for Shiksha Mahakumbh 6.0 will be published after the programme at NIT
            Hamirpur.
          </p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {edition.photoLinks.map((link) => (
              <li key={`${edition.id}-${link.label}`}>
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="inline-flex rounded-full border border-brand-blue/25 bg-brand-blue/5 px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:bg-brand-saffron/10 md:text-sm"
                >
                  {link.label}
                  {link.external && <span className="ml-1 opacity-60" aria-hidden>↗</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {edition.pastEventHref && !comingSoon && (
          <Link
            href={edition.pastEventHref}
            className="mt-4 text-sm font-semibold text-brand-blue hover:underline"
          >
            View edition details →
          </Link>
        )}
      </div>
    </motion.article>
  );
}

function EditionVideoCard({ edition, index, reduceMotion }: EditionCardProps) {
  const comingSoon = edition.status === "coming_soon";

  const inner = (
    <>
      <div className={`h-2 bg-gradient-to-r ${edition.accent}`} aria-hidden />
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10px] font-bold uppercase tracking-wide text-brand-saffron-dark">
          Edition {edition.edition}
        </span>
        <h4 className="mt-1 text-base font-bold text-brand-navy">{edition.videoTitle}</h4>
        <p className="mt-2 flex-1 text-sm text-slate-600">{edition.videoDescription}</p>
        {!comingSoon && (
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-red-600">
            Watch on YouTube
            <span aria-hidden>↗</span>
          </span>
        )}
        {comingSoon && (
          <span className="mt-4 text-sm font-semibold text-amber-700">Will be updated soon</span>
        )}
      </div>
    </>
  );

  if (comingSoon) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: reduceMotion ? 0 : index * 0.05 }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50"
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <motion.a
      href={YOUTUBE_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: reduceMotion ? 0 : index * 0.05 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-lg"
      aria-label={`${edition.videoTitle} — open Shiksha Mahakumbh YouTube channel`}
    >
      {inner}
    </motion.a>
  );
}
