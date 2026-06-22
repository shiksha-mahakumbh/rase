"use client";

import Image from "next/image";
import Link from "next/link";
import ReservedAdSlot from "@/components/ads/ReservedAdSlot";
import { PAST_EDITIONS } from "@/data/past-editions";
import { getSpeakersForEdition } from "@/data/mahakumbh-abhiyan-speakers";
import EditionSpeakersList from "./EditionSpeakersList";
import EditionChiefGuests from "./EditionChiefGuests";
import PastEditionsJsonLd from "./PastEditionsJsonLd";

const actionBtn =
  "inline-flex min-h-[44px] items-center rounded-lg px-4 py-2 text-sm font-semibold transition";

export default function PastEditionsShowcase() {
  return (
    <div className="bg-white">
      <PastEditionsJsonLd />

      <section className="border-b border-brand-saffron/15 bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-2 sm:gap-3">
          <Link
            href="/introduction"
            className="rounded-full border border-brand-blue/25 bg-white px-4 py-2 text-sm font-semibold text-brand-navy shadow-sm hover:border-brand-blue/40 hover:bg-brand-blue/5 sm:px-5"
          >
            About the Movement
          </Link>
          <Link
            href="/proceedings"
            className="rounded-full border border-brand-blue/25 bg-white px-4 py-2 text-sm font-semibold text-brand-navy shadow-sm hover:border-brand-blue/40 hover:bg-brand-blue/5 sm:px-5"
          >
            Proceedings
          </Link>
          <Link
            href="/abhiyaninphotoframe"
            className="rounded-full border border-brand-blue/25 bg-white px-4 py-2 text-sm font-semibold text-brand-navy shadow-sm hover:border-brand-blue/40 hover:bg-brand-blue/5 sm:px-5"
          >
            Abhiyan Photo Frame
          </Link>
          <Link
            href="/gallery"
            className="rounded-full bg-brand-saffron px-4 py-2 text-sm font-bold text-brand-navy shadow-sm hover:bg-brand-saffron-dark hover:text-white sm:px-5"
          >
            Photo & Video Gallery
          </Link>
        </div>
      </section>

      <ReservedAdSlot slotId="pastevent-mid" className="mx-auto max-w-5xl px-4 py-6" />

      <section
        aria-label="National reach"
        className="border-b border-brand-saffron/15 bg-white px-4 py-8"
      >
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "5", label: "National editions", hint: "2023 — 2025" },
            { value: "14+", label: "States & UTs", hint: "Delegates nationwide" },
            { value: "500+", label: "Research papers", hint: "Across all editions" },
            { value: "10,000+", label: "Participants", hint: "Physical & digital reach" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-brand-blue/15 bg-gradient-to-br from-brand-surface-warm to-white p-5 text-center shadow-sm"
            >
              <p className="text-3xl font-extrabold text-brand-navy">{item.value}</p>
              <p className="mt-1 text-sm font-bold text-brand-saffron-dark">{item.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{item.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="editions-timeline"
        className="mx-auto max-w-6xl px-4 py-10 md:py-16"
      >
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-saffron">
            2023 — 2025 · 14 states &amp; UTs
          </p>
          <h2 id="editions-timeline" className="mt-2 text-2xl font-bold text-brand-navy md:text-3xl">
            Edition Timeline
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Five national editions across NITs and universities — advancing school education, academic
            entrepreneurship, and global Indian education dialogue.
          </p>
        </div>

        <div className="relative space-y-8 pl-6 md:space-y-10 md:pl-0">
          <div
            aria-hidden
            className="absolute bottom-0 left-[7px] top-0 w-0.5 bg-brand-saffron/30 md:left-1/2 md:-translate-x-1/2"
          />
          {PAST_EDITIONS.map((edition, index) => (
            <article
              key={edition.id}
              className={`relative md:flex md:w-[calc(50%-2rem)] ${
                index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
              }`}
            >
              <span
                aria-hidden
                className="absolute -left-6 top-8 h-3.5 w-3.5 rounded-full border-4 border-white bg-brand-saffron shadow md:hidden"
              />
              <span
                aria-hidden
                className="absolute top-10 hidden h-4 w-4 rounded-full border-4 border-white bg-brand-saffron shadow md:block md:translate-x-1/2"
                style={index % 2 === 0 ? { right: "-1rem" } : { left: "-1rem" }}
              />

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:shadow-lg">
                {edition.imageSrc ? (
                  <div className="relative aspect-[21/9] w-full bg-slate-100">
                    <Image
                      src={edition.imageSrc}
                      alt={`${edition.title} — ${edition.venue}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <span className="rounded-full bg-brand-saffron px-3 py-1 text-xs font-bold text-brand-navy">
                        Edition {edition.edition}
                      </span>
                      <h3 className="mt-2 text-lg font-bold text-white sm:text-xl">{edition.title}</h3>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-brand-navy to-brand-navy/80 px-5 py-5 sm:px-6">
                    <span className="rounded-full bg-brand-saffron px-3 py-1 text-xs font-bold text-brand-navy">
                      Edition {edition.edition}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-white sm:text-xl">{edition.title}</h3>
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="rounded-lg bg-brand-navy/5 px-3 py-1.5 font-medium text-brand-navy">
                      {edition.venue}
                    </span>
                    <span className="rounded-lg bg-brand-navy/5 px-3 py-1.5 font-medium text-brand-navy">
                      {edition.dates}
                    </span>
                  </div>

                  {edition.featuredStats?.length ? (
                    <ul className="mt-4 grid grid-cols-3 gap-2">
                      {edition.featuredStats.map((stat) => (
                        <li
                          key={stat.label}
                          className="rounded-xl border border-brand-saffron/15 bg-brand-surface-warm px-2 py-2.5 text-center sm:px-3"
                        >
                          <p className="text-base font-extrabold text-brand-navy sm:text-lg">{stat.value}</p>
                          <p className="mt-0.5 text-[10px] leading-tight text-slate-600 sm:text-xs">
                            {stat.label}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-saffron">
                    Theme
                  </p>
                  <p className="mt-1 text-sm text-brand-navy sm:text-base">{edition.theme}</p>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-saffron">
                    Core Essence (Mool Tatva)
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{edition.coreEssence}</p>

                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-saffron">
                    Impact &amp; Outcomes
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{edition.impact}</p>

                  <EditionChiefGuests edition={edition.edition} />

                  <EditionSpeakersList
                    edition={edition.edition}
                    speakers={getSpeakersForEdition(edition.edition)}
                  />

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
                        className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-saffron hover:underline"
                      >
                        View photo archive →
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">Archive link coming soon.</p>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                    <Link
                      href={edition.href}
                      className={`${actionBtn} bg-brand-saffron text-brand-navy hover:bg-brand-saffron-dark hover:text-white`}
                    >
                      Edition details
                    </Link>
                    {edition.proceedingHref ? (
                      <Link
                        href={edition.proceedingHref}
                        className={`${actionBtn} border border-brand-blue/25 text-brand-blue hover:bg-brand-blue/5`}
                      >
                        Proceedings
                      </Link>
                    ) : null}
                    {edition.campaignPdf ? (
                      <a
                        href={edition.campaignPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${actionBtn} border border-brand-blue/25 text-brand-blue hover:bg-brand-blue/5`}
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

      <section className="border-t border-brand-saffron/15 bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm px-4 py-12">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold text-brand-navy">सभी संस्करणों के वक्ता</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            शिक्षा महाकुंभ 1.0 से 5.0 तक के गरिमामयी वक्ता, नेतृत्वकर्ता एवं विशेषज्ञों की संपूर्ण सूची।
          </p>
          <Link
            href="/speakers/directory"
            className="mt-6 inline-block rounded-lg bg-brand-saffron px-6 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-saffron-dark hover:text-white"
          >
            पूर्ण वक्ता सूची देखें →
          </Link>
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
                <tr className="bg-gradient-to-r from-brand-saffron/20 to-brand-blue/10 text-brand-navy">
                  <th className="px-4 py-3">Edition</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Theme</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Proceedings</th>
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
                    <td className="hidden px-4 py-3 sm:table-cell">
                      {e.proceedingHref ? (
                        <Link href={e.proceedingHref} className="font-semibold text-brand-blue hover:underline">
                          Read →
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
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
