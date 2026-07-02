import Image from "next/image";
import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import { EDITION_YOUTUBE_URLS } from "@/data/gallery-hub";
import { getSpeakersForEdition } from "@/data/mahakumbh-abhiyan-speakers";
import {
  editionGalleryLinks,
  PAST_EVENTS_BREADCRUMBS,
  PAST_EVENTS_QUICK_LINKS,
  PAST_EVENTS_STATS,
  PAST_EVENTS_UPCOMING_CTA,
  souvenirHrefForEdition,
} from "@/data/past-events-hub";
import { PAST_EDITIONS } from "@/data/past-editions";
import EditionSpeakersList from "./EditionSpeakersList";
import EditionChiefGuests from "./EditionChiefGuests";

const actionBtn =
  "inline-flex min-h-[44px] items-center rounded-lg px-4 py-2 text-sm font-semibold transition";

export default function PastEditionsShowcase() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-2 md:px-6">
        <BreadcrumbNav
          items={PAST_EVENTS_BREADCRUMBS.map((item, index, arr) => ({
            label: item.name,
            href: index < arr.length - 1 ? item.path : undefined,
          }))}
          className="mb-2"
        />
      </div>

      <section className="border-b border-brand-saffron/15 bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm px-4 py-6">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PAST_EVENTS_QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
            >
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-label="National reach"
        className="border-b border-brand-saffron/15 bg-white px-4 py-8"
      >
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAST_EVENTS_STATS.map((item) => (
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
            2023 — 2025 · delegates from {PAST_EVENTS_STATS[1]!.value} states &amp; UTs at peak
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
          {PAST_EDITIONS.map((edition, index) => {
            const gallery = editionGalleryLinks(edition.edition);
            const youtubeUrl = EDITION_YOUTUBE_URLS[edition.edition];
            const souvenirHref = souvenirHrefForEdition(edition.edition);

            return (
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
                        alt={`${edition.title} — ${edition.venue} ${edition.year}`}
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
                      <p className="text-sm font-semibold text-brand-navy">Gallery &amp; media</p>
                      <p className="mt-1 text-sm text-slate-600">
                        Official photographs and media from {edition.title}.
                      </p>
                      <ul className="mt-3 flex flex-col gap-2">
                        <li>
                          <Link
                            href={gallery?.siteGallery ?? "/gallery"}
                            className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-blue hover:underline"
                          >
                            View on site gallery →
                          </Link>
                        </li>
                        {gallery?.drive ? (
                          <li>
                            <a
                              href={gallery.drive}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-saffron hover:underline"
                            >
                              Google Drive photo archive →
                            </a>
                          </li>
                        ) : null}
                        {gallery ? (
                          <li className="flex flex-wrap gap-x-4 gap-y-1">
                            <Link
                              href={gallery.digital}
                              className="text-sm font-semibold text-brand-navy hover:underline"
                            >
                              Digital media →
                            </Link>
                            <Link
                              href={gallery.print}
                              className="text-sm font-semibold text-brand-navy hover:underline"
                            >
                              Print media →
                            </Link>
                          </li>
                        ) : null}
                        {youtubeUrl ? (
                          <li>
                            <a
                              href={youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-[44px] items-center text-sm font-semibold text-brand-navy hover:underline"
                            >
                              Watch on YouTube →
                            </a>
                          </li>
                        ) : null}
                      </ul>
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
                      {souvenirHref ? (
                        <Link
                          href={souvenirHref}
                          className={`${actionBtn} border border-brand-blue/25 text-brand-blue hover:bg-brand-blue/5`}
                        >
                          Souvenir abstracts
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
            );
          })}
        </div>
      </section>

      <section
        className="border-t border-brand-saffron/15 bg-gradient-to-br from-brand-blue/5 via-white to-brand-saffron/5 px-4 py-12"
        aria-labelledby="upcoming-edition-heading"
      >
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-saffron">
            Next edition
          </p>
          <h2 id="upcoming-edition-heading" className="mt-2 text-2xl font-bold text-brand-navy md:text-3xl">
            {PAST_EVENTS_UPCOMING_CTA.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            {PAST_EVENTS_UPCOMING_CTA.venue} · {PAST_EVENTS_UPCOMING_CTA.dates}
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-brand-navy">{PAST_EVENTS_UPCOMING_CTA.theme}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={PAST_EVENTS_UPCOMING_CTA.registrationHref}
              className="inline-flex min-h-[48px] items-center rounded-xl bg-brand-saffron px-8 py-3 text-sm font-bold text-brand-navy shadow-lg transition hover:bg-brand-saffron-dark hover:text-white"
            >
              Register for SMK 6.0
            </Link>
            <Link
              href={PAST_EVENTS_UPCOMING_CTA.learnMoreHref}
              className="inline-flex min-h-[48px] items-center rounded-xl border border-brand-navy/30 bg-white px-8 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/5"
            >
              Upcoming events
            </Link>
          </div>
        </div>
      </section>

      <section
        lang="hi"
        className="border-t border-brand-saffron/15 bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm px-4 py-12"
        aria-labelledby="speakers-directory-heading"
      >
        <div className="mx-auto max-w-6xl text-center">
          <h2 id="speakers-directory-heading" className="text-2xl font-bold text-brand-navy">
            सभी संस्करणों के वक्ता
          </h2>
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

      <section className="border-t border-slate-200 bg-white px-4 py-10" aria-labelledby="editions-glance-heading">
        <div className="mx-auto max-w-6xl">
          <h2 id="editions-glance-heading" className="text-center text-xl font-bold text-brand-navy">
            Editions at a Glance
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">
                Shiksha Mahakumbh Abhiyan completed editions 1.0 through 5.0 — dates, venues, themes,
                and links
              </caption>
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
                      ) : souvenirHrefForEdition(e.edition) ? (
                        <Link
                          href={souvenirHrefForEdition(e.edition)!}
                          className="font-semibold text-brand-blue hover:underline"
                        >
                          Souvenir →
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
