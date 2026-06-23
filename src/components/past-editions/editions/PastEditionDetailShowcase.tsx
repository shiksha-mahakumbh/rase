import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import EditionGallery from "@/components/past-editions/editions/EditionGallery";
import EditionPrevNext from "@/components/past-editions/editions/EditionPrevNext";
import type { EditionDetailContent } from "@/data/editions/types";
import { editionTitle, getAdjacentEditions } from "@/data/past-editions";

const primaryBtn =
  "inline-flex min-h-[44px] items-center rounded-xl bg-brand-saffron px-5 py-2.5 text-sm font-bold text-brand-navy shadow-md transition hover:bg-brand-saffron-dark hover:text-white";
const secondaryBtn =
  "inline-flex min-h-[44px] items-center rounded-xl border border-brand-blue/25 bg-white px-5 py-2.5 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue/5";

type Props = {
  content: EditionDetailContent;
};

export default function PastEditionDetailShowcase({ content }: Props) {
  const title = editionTitle(content.editionNumber);
  const { prev, next } = getAdjacentEditions(content.editionNumber);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Past Editions", href: "/past-events" },
          { label: title },
        ]}
        className="mb-2"
      />

      <EditionPrevNext prev={prev} next={next} />

      {content.galleryImages?.length ? (
        <EditionGallery images={content.galleryImages} eventTitle={title} />
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Edition quick facts">
        {[
          { label: "Dates", value: content.dates },
          { label: "Venue", value: content.venueShort },
          { label: "Theme", value: content.theme },
          { label: "Year", value: content.year },
        ].map((fact) => (
          <div
            key={fact.label}
            className="rounded-2xl border border-brand-saffron/20 bg-brand-surface-warm p-4 shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {fact.label}
            </p>
            <p className="mt-1 text-sm font-bold text-brand-navy">{fact.value}</p>
          </div>
        ))}
      </section>

      {(content.introduction || content.objective) && (
        <section className="rounded-2xl border border-brand-saffron/20 bg-white p-6 shadow-sm md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-saffron-dark">
            Report · {content.year}
          </p>
          {content.introduction ? (
            <>
              <h2 className="mt-2 text-xl font-bold text-brand-navy md:text-2xl">Introduction</h2>
              <p className="mt-3 leading-relaxed text-slate-700">{content.introduction}</p>
            </>
          ) : null}
          {content.objective ? (
            <>
              <h2
                className={`${content.introduction ? "mt-6" : "mt-2"} text-xl font-bold text-brand-navy md:text-2xl`}
              >
                Objective
              </h2>
              <p className="mt-3 text-base font-semibold text-brand-blue">{content.objective}</p>
            </>
          ) : null}
          {content.objectiveExtended ? (
            <p className="mt-3 leading-relaxed text-slate-700">{content.objectiveExtended}</p>
          ) : null}
          <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Organised by</dt>
              <dd className="mt-1 text-sm text-slate-700">
                {content.organisers.map((org) => (
                  <span key={org} className="block">
                    {org}
                  </span>
                ))}
              </dd>
            </div>
            {content.contactEmail ? (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Contact</dt>
                <dd className="mt-1 text-sm">
                  <a
                    href={`mailto:${content.contactEmail}`}
                    className="font-semibold text-brand-blue hover:text-brand-saffron"
                  >
                    {content.contactEmail}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      )}

      {content.campaignStats?.length ? (
        <section aria-labelledby="campaign-glance">
          <h2 id="campaign-glance" className="text-lg font-bold text-brand-navy md:text-xl">
            Campaign &amp; outreach
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.campaignStats.map((stat) => (
              <li
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-2xl font-extrabold text-brand-navy">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {content.turnaroundStats?.length ? (
        <section aria-labelledby="turnaround">
          <h2 id="turnaround" className="text-lg font-bold text-brand-navy md:text-xl">
            Key highlights
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.turnaroundStats.map((stat) => (
              <li
                key={stat.label}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-1 bg-gradient-to-r from-brand-blue to-brand-saffron" aria-hidden />
                <div className="p-4">
                  <p className="text-xl font-extrabold text-brand-navy">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {content.venueAbout ? (
        <section className="rounded-2xl border border-brand-blue/15 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-bold text-brand-navy">{content.venueShort}</h2>
          <p className="mt-3 leading-relaxed text-slate-700">{content.venueAbout}</p>
          <p className="mt-3 text-slate-700">
            <strong className="text-brand-navy">Address:</strong> {content.venueAddress}
          </p>
        </section>
      ) : null}

      {content.highlights?.length ? (
        <section aria-labelledby="outcomes">
          <h2 id="outcomes" className="text-lg font-bold text-brand-navy md:text-xl">
            Outcomes &amp; impact
          </h2>
          <ul className="mt-4 space-y-3">
            {content.highlights.map((item) => (
              <li
                key={item.slice(0, 48)}
                className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-700"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-saffron" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {content.declarations?.length ? (
        <section className="rounded-2xl border border-brand-blue/20 bg-brand-surface-warm p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-navy md:text-xl">Declaration &amp; resolutions</h2>
          <ul className="mt-4 space-y-3">
            {content.declarations.map((item) => (
              <li key={item.slice(0, 48)} className="text-sm leading-relaxed text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {content.leadership ? (
        <section className="rounded-2xl border border-brand-saffron/20 bg-gradient-to-br from-brand-surface-warm to-white p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-navy md:text-xl">The story behind</h2>
          {content.leadership.story ? (
            <p className="mt-3 leading-relaxed text-slate-700">{content.leadership.story}</p>
          ) : null}
          {content.leadership.people?.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {content.leadership.people.map((person) => (
                <div key={person.name} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {person.role}
                  </p>
                  <p className="mt-1 font-bold text-brand-navy">{person.name}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {content.proceedingHref ? (
        <section className="rounded-2xl border border-brand-blue/20 bg-gradient-to-r from-brand-blue/5 to-brand-saffron/5 p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">Proceedings</p>
          <p className="mt-2 text-sm text-slate-700">
            Peer-reviewed papers from this edition are published in the Shiksha Mahakumbh proceedings series.
          </p>
          <Link href={content.proceedingHref} className={`${primaryBtn} mt-4`}>
            Read proceedings online
          </Link>
        </section>
      ) : null}

      {content.relatedLinks?.length ? (
        <section aria-labelledby="edition-related">
          <h2 id="edition-related" className="text-lg font-bold text-brand-navy md:text-xl">
            Related resources
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.relatedLinks.map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
                  >
                    {link.label}
                    <span className="ml-auto text-xs text-slate-400">↗</span>
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="flex min-h-[44px] items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap justify-center gap-3 pb-2">
        {content.galleryUrl ? (
          <a href={content.galleryUrl} target="_blank" rel="noopener noreferrer" className={primaryBtn}>
            Visit Gallery
          </a>
        ) : null}
        <Link href="/past-events" className={secondaryBtn}>
          All past editions
        </Link>
      </div>
    </div>
  );
}
