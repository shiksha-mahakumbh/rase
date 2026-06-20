import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import PersonPhotoGrid from "@/components/abhiyan/PersonPhotoGrid";
import {
  ABIYAN_PHOTO_FRAME,
  EDITION_CHIEF_GUESTS,
  EDITION_HONORED_GOVERNORS,
  EDITION_HONORED_MINISTERS,
  EDITION_STATE_MINISTERS,
  EDITION_UNION_MINISTERS,
} from "@/data/abhiyan-photo-frame";
import { PAST_EDITIONS } from "@/data/past-editions";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "शिक्षा महाकुंभ अभियान — Photo Frame",
  description:
    "Official Shiksha Mahakumbh Abhiyan photo frame — patron, advisors, edition dignitaries, coordinators, and programme highlights across editions 1.0–5.0.",
  path: "/abhiyaninphotoframe",
});

function PersonList({
  items,
}: {
  items: Array<{ name: string; role: string; organization?: string }>;
}) {
  return <PersonPhotoGrid items={items} columns={2} />;
}

export default function AbhiyanPhotoFramePage() {
  const { patron, advisors, coordinators, conclaveTypes, dedication, taglineHindi, introParagraphs } =
    ABIYAN_PHOTO_FRAME;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Photo Frame", path: "/abhiyaninphotoframe" },
        ]}
      />
      <PublicPageShell
        hero={{
          eyebrow: "शिक्षा महाकुंभ अभियान",
          title: "Abhiyan Photo Frame",
          subtitle: dedication,
          accent: "brand",
          imageSrc: "/branding/shiksha-mahakumbh-brand-hero.png",
        }}
        relatedPath="/abhiyaninphotoframe"
        showCta={false}
        containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10"
      >
        <p className="mb-8 text-center text-slate-700 md:text-lg">{taglineHindi}</p>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <a
            href={ABIYAN_PHOTO_FRAME.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            View / Download PDF
          </a>
          <Link
            href="/past-events"
            className="rounded-lg border border-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5"
          >
            Past Editions
          </Link>
          <Link
            href="/speakers/directory"
            className="rounded-lg border border-brand-saffron px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-saffron/10"
          >
            वक्ता सूची
          </Link>
        </div>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="space-y-4 text-justify text-slate-700 leading-relaxed">
            {introParagraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-bold text-brand-navy">संरक्षक (Patron)</h2>
          <div className="mt-3 rounded-lg border border-brand-saffron/30 bg-white p-4">
            <p className="font-semibold text-brand-navy">{patron.name}</p>
            <p className="text-sm text-slate-600">
              {patron.role} · {patron.organization}
            </p>
            <p className="mt-1 text-sm text-slate-500">{patron.nameEn}</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">परामर्शदाता (Advisors)</h2>
          <PersonList items={[...advisors]} />
        </section>

        <section className="mb-10 space-y-4">
          <h2 className="text-lg font-bold text-brand-navy">संस्करण (Editions 1.0–5.0)</h2>
          {PAST_EDITIONS.map((edition) => (
            <div key={edition.id} className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-brand-saffron">{edition.title}</h3>
              <p className="text-sm text-slate-600">
                {edition.venue} · {edition.dates}
              </p>
              <p className="mt-2 text-sm text-brand-navy">{edition.theme}</p>
              <Link
                href={edition.href}
                className="mt-3 inline-block text-sm font-semibold text-brand-navy hover:underline"
              >
                Edition details →
              </Link>
            </div>
          ))}
        </section>

        <section className="mb-10 space-y-6">
          <h2 className="text-lg font-bold text-brand-navy">प्रमुख अतिथि — संस्करणवार</h2>
          {PAST_EDITIONS.map((edition) => {
            const guests = EDITION_CHIEF_GUESTS[edition.edition] ?? [];
            if (guests.length === 0) return null;
            return (
              <div key={edition.id} className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-semibold text-brand-saffron">
                  {edition.title} · {edition.dates}
                </h3>
                <p className="text-sm text-slate-600">{edition.venue}</p>
                <div className="mt-3">
                  <PersonList items={guests} />
                </div>
              </div>
            );
          })}
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">गरिमामयी मुख्यमंत्री</h2>
          <PersonList items={[...EDITION_HONORED_MINISTERS]} />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">गरिमामयी राज्यपाल</h2>
          <PersonList items={[...EDITION_HONORED_GOVERNORS]} />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">केंद्रीय मंत्री</h2>
          <PersonList items={[...EDITION_UNION_MINISTERS]} />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">राज्य मंत्री</h2>
          <PersonList items={[...EDITION_STATE_MINISTERS]} />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">कॉनक्लेव प्रकार</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {conclaveTypes.map((c) => (
              <li
                key={c}
                className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-700"
              >
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">ओलंपियाड केंद्र</h2>
          <ul className="flex flex-wrap gap-2">
            {ABIYAN_PHOTO_FRAME.olympiadCities.map((city) => (
              <li
                key={city}
                className="rounded-full border border-brand-saffron/40 bg-brand-saffron/5 px-3 py-1 text-sm text-brand-navy"
              >
                {city}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">संपर्क</h2>
          <p className="text-center text-sm text-slate-600">
            <a
              href={`mailto:${ABIYAN_PHOTO_FRAME.contact.email}`}
              className="font-semibold text-brand-navy hover:underline"
            >
              {ABIYAN_PHOTO_FRAME.contact.email}
            </a>
            {" · "}
            {ABIYAN_PHOTO_FRAME.contact.websites.join(" · ")}
          </p>
          <p className="mt-2 text-center text-sm italic text-slate-500">
            {ABIYAN_PHOTO_FRAME.contact.patronMessage}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">समन्वयक (Coordinators)</h2>
          <PersonList items={[...coordinators]} />
        </section>

        <section className="mb-6">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">Full Photo Frame (PDF)</h2>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <iframe
              src={ABIYAN_PHOTO_FRAME.pdfEmbedUrl}
              title="Shiksha Mahakumbh Abhiyan Photo Frame"
              className="h-[80vh] min-h-[480px] w-full"
              allow="autoplay"
            />
          </div>
          <p className="mt-3 text-center text-sm text-slate-500">
            PDF not loading?{" "}
            <a
              href={ABIYAN_PHOTO_FRAME.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-navy underline"
            >
              Open on Google Drive
            </a>
          </p>
        </section>
      </PublicPageShell>
    </>
  );
}
