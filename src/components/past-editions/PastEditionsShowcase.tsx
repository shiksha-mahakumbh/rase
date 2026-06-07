"use client";

import Image from "next/image";
import Link from "next/link";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";
import { PAST_EDITIONS } from "@/data/past-editions";
import PastEditionsJsonLd from "./PastEditionsJsonLd";

export default function PastEditionsShowcase() {
  return (
    <div className="bg-brand-surface">
      <PastEditionsJsonLd />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy px-4 py-14 text-white md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-saffron">
            Shiksha Mahakumbh Abhiyan
          </p>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl">
            Past Editions
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
            Five completed national editions — from NIT Jalandhar (1.0) to NIPER Mohali (5.0) —
            advancing school education, academic entrepreneurship, and global Indian education dialogue
            under the Department of Holistic Education.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/introduction"
              className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold hover:bg-white/10"
            >
              About the Movement
            </Link>
            <Link
              href="/gallery"
              className="rounded-full bg-brand-saffron px-5 py-2 text-sm font-bold text-brand-navy hover:opacity-90"
            >
              Photo Gallery
            </Link>
          </div>
        </div>
      </section>

      <ReservedAdSlot slotId="pastevent-mid" className="mx-auto max-w-5xl px-4 py-6" />

      {/* Timeline */}
      <section
        aria-labelledby="editions-timeline"
        className="mx-auto max-w-6xl px-4 py-12 md:py-16"
      >
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-saffron">
            2023 — 2025
          </p>
          <h2 id="editions-timeline" className="mt-2 text-2xl font-bold text-brand-navy md:text-3xl">
            Edition Timeline
          </h2>
        </div>

        <div className="relative space-y-10">
          <div
            aria-hidden
            className="absolute bottom-0 left-4 top-0 hidden w-0.5 bg-brand-saffron/30 md:left-1/2 md:block md:-translate-x-1/2"
          />
          {PAST_EDITIONS.map((edition, index) => (
            <article
              key={edition.id}
              className={`relative md:flex md:w-[calc(50%-2rem)] ${
                index % 2 === 0
                  ? "md:mr-auto md:pr-8"
                  : "md:ml-auto md:pl-8"
              }`}
            >
              <span
                aria-hidden
                className="absolute -left-1 top-8 hidden h-4 w-4 rounded-full border-4 border-white bg-brand-saffron shadow md:left-auto md:right-0 md:top-10 md:block md:translate-x-1/2"
                style={index % 2 === 0 ? { right: "-1rem" } : { left: "-1rem" }}
              />

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
                {edition.imageSrc ? (
                  <div className="relative h-44 w-full bg-slate-100 md:h-52">
                    <Image
                      src={edition.imageSrc}
                      alt={edition.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="rounded-full bg-brand-saffron px-3 py-1 text-xs font-bold text-brand-navy">
                        Edition {edition.edition}
                      </span>
                      <h3 className="mt-2 text-xl font-bold text-white">{edition.title}</h3>
                    </div>
                  </div>
                ) : null}

                <div className="p-6">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="rounded-lg bg-brand-navy/5 px-3 py-1 font-medium text-brand-navy">
                      📍 {edition.venue}
                    </span>
                    <span className="rounded-lg bg-brand-navy/5 px-3 py-1 font-medium text-brand-navy">
                      📅 {edition.dates}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-saffron">
                    Theme
                  </p>
                  <p className="mt-1 text-brand-navy">{edition.theme}</p>

                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-saffron">
                    Core Essence (Mool Tatva)
                  </p>
                  <p className="mt-1 text-slate-700">{edition.coreEssence}</p>

                  <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-saffron">
                    Impact &amp; Outcomes
                  </p>
                  <p className="mt-1 text-slate-700">{edition.impact}</p>

                  {/* Gallery placeholder structure */}
                  <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-brand-navy">Gallery</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Official photographs and media from {edition.title}.
                    </p>
                    {edition.galleryUrl ? (
                      <a
                        href={edition.galleryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sm font-semibold text-brand-saffron hover:underline"
                      >
                        View photo archive →
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">Archive link coming soon.</p>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={edition.href}
                      className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-light"
                    >
                      Edition details
                    </Link>
                    {edition.campaignPdf ? (
                      <a
                        href={edition.campaignPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-brand-navy/20 px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5"
                      >
                        Campaign PDF
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Quick reference table — accessible fallback */}
      <section className="border-t border-slate-200 bg-white px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-xl font-bold text-brand-navy">
            Editions at a Glance
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-brand-navy text-white">
                  <th className="px-4 py-3">Edition</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Theme</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {[...PAST_EDITIONS].reverse().map((e) => (
                  <tr key={e.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-semibold text-brand-navy">{e.title}</td>
                    <td className="px-4 py-3">{e.dates}</td>
                    <td className="px-4 py-3">{e.venue}</td>
                    <td className="px-4 py-3">{e.theme}</td>
                    <td className="px-4 py-3">
                      <Link href={e.href} className="font-semibold text-brand-saffron hover:underline">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
