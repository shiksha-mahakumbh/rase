import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import AbhiyanPhotoFrameGallery from "@/components/abhiyan/AbhiyanPhotoFrameGallery";
import PersonPhotoGrid from "@/components/abhiyan/PersonPhotoGrid";
import { ABIYAN_PHOTO_FRAME, EDITION_CHIEF_GUESTS, EDITION_HONORED_GOVERNORS, EDITION_HONORED_MINISTERS, EDITION_STATE_MINISTERS, EDITION_UNION_MINISTERS } from "@/data/abhiyan-photo-frame";
import { ABIYAN_FRAME_IMAGES, EDITION_FRAME_IMAGES } from "@/data/abhiyan-photo-frame-images";
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
  items: Array<{ name: string; role: string; organization?: string; imageSrc?: string }>;
}) {
  return <PersonPhotoGrid items={items} columns={2} />;
}

export default function AbhiyanPhotoFramePage() {
  const { patron, advisors, coordinators, conclaveTypes, dedication, taglineHindi, coverImageSrc } =
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

        <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
          <div className="relative aspect-[16/9] w-full bg-slate-100">
            <Image
              src={coverImageSrc}
              alt="Shiksha Mahakumbh Abhiyan Photo Frame cover"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        </div>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-bold text-brand-navy">संरक्षक (Patron)</h2>
          <div className="mt-3 flex flex-col gap-4 rounded-lg border border-brand-saffron/30 bg-white p-4 sm:flex-row sm:items-center">
            {patron.imageSrc ? (
              <div className="relative mx-auto h-36 w-36 shrink-0 overflow-hidden rounded-full border-4 border-brand-saffron/40 sm:mx-0">
                <Image
                  src={patron.imageSrc}
                  alt={patron.name}
                  fill
                  className="object-cover"
                  sizes="144px"
                />
              </div>
            ) : null}
            <div>
              <p className="font-semibold text-brand-navy">{patron.name}</p>
              <p className="text-sm text-slate-600">
                {patron.role} · {patron.organization}
              </p>
              <p className="mt-1 text-sm text-slate-500">{patron.nameEn}</p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">परामर्शदाता (Advisors)</h2>
          <PersonList items={[...advisors]} />
        </section>

        <section className="mb-10 space-y-6">
          <h2 className="text-lg font-bold text-brand-navy">संस्करण — Photo Frame Pages</h2>
          {PAST_EDITIONS.map((edition) => {
            const frame = EDITION_FRAME_IMAGES[edition.edition];
            if (!frame) return null;
            return (
              <div key={edition.id} className="overflow-hidden rounded-xl border border-slate-200">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <Image
                      src={frame.hero}
                      alt={`${edition.title} photo frame`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-4">
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
                </div>
              </div>
            );
          })}
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
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="relative aspect-[16/9] w-full bg-slate-50">
              <Image
                src={ABIYAN_FRAME_IMAGES.honoredChiefMinistersPage}
                alt="Honored chief ministers from photo frame"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
          <PersonList items={[...EDITION_HONORED_MINISTERS]} />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">गरिमामयी राज्यपाल</h2>
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="relative aspect-[16/9] w-full bg-slate-50">
              <Image
                src={ABIYAN_FRAME_IMAGES.honoredGovernorsPage}
                alt="Honored governors from photo frame"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
          <PersonList items={[...EDITION_HONORED_GOVERNORS]} />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">केंद्रीय मंत्री</h2>
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="relative aspect-[16/9] w-full bg-slate-50">
              <Image
                src={ABIYAN_FRAME_IMAGES.unionMinistersPage}
                alt="Union ministers from photo frame"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
          <PersonList items={[...EDITION_UNION_MINISTERS]} />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">राज्य मंत्री</h2>
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="relative aspect-[16/9] w-full bg-slate-50">
              <Image
                src={ABIYAN_FRAME_IMAGES.stateMinistersPage}
                alt="State ministers from photo frame"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
          <PersonList items={[...EDITION_STATE_MINISTERS]} />
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">सह-आयोजक एवं सहयोगी</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="relative aspect-[4/3] bg-slate-50">
                <Image
                  src={ABIYAN_FRAME_IMAGES.coOrganizersPage}
                  alt="Co-organizers from photo frame"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="relative aspect-[4/3] bg-slate-50">
                <Image
                  src={ABIYAN_FRAME_IMAGES.partnersPage}
                  alt="Partners from photo frame"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">कॉनक्लेव प्रकार</h2>
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="relative aspect-[16/9] w-full bg-slate-50">
              <Image
                src={ABIYAN_FRAME_IMAGES.conclavesPage}
                alt="Conclave types from photo frame"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
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
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="relative aspect-[16/9] w-full bg-slate-50">
              <Image
                src={ABIYAN_FRAME_IMAGES.olympiadPage}
                alt="Olympiad centres from photo frame"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
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
          <h2 className="mb-4 text-lg font-bold text-brand-navy">शोध प्रस्तुतियाँ एवं मीडिया</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="relative aspect-[4/3] bg-slate-50">
                <Image
                  src={ABIYAN_FRAME_IMAGES.researchPapersPage}
                  alt="Research papers from photo frame"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="relative aspect-[4/3] bg-slate-50">
                <Image
                  src={ABIYAN_FRAME_IMAGES.mediaCoveragePage1}
                  alt="Media coverage from photo frame"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-brand-navy">संपर्क</h2>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="relative aspect-[16/9] w-full bg-slate-50">
              <Image
                src={ABIYAN_FRAME_IMAGES.contactPage}
                alt="Contact page from photo frame"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-600">
            <a href={`mailto:${ABIYAN_PHOTO_FRAME.contact.email}`} className="font-semibold text-brand-navy hover:underline">
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

        <AbhiyanPhotoFrameGallery />

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
