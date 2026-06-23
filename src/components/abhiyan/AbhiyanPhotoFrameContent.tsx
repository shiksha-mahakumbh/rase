import Image from "next/image";
import Link from "next/link";
import BreadcrumbNav from "@/components/ui/BreadcrumbNav";
import {
  ABIYAN_PHOTO_FRAME,
  EDITION_CHIEF_GUESTS,
  INVITATION_CAMPAIGN_GROUPS,
  getInvitationGroupItems,
  type EditionDignitary,
} from "@/data/abhiyan-photo-frame";
import {
  PHOTO_FRAME_BREADCRUMBS,
  PHOTO_FRAME_QUICK_LINKS,
  PHOTO_FRAME_SECTION_NAV,
  PHOTO_FRAME_UPCOMING_CTA,
  buildPhotoFrameStats,
} from "@/data/abhiyan-photo-frame-hub";
import { PAST_EDITIONS } from "@/data/past-editions";

const HONORIFIC_PREFIXES = [
  "श्रीमती ",
  "श्री ",
  "डॉ. ",
  "डॉ ",
  "Prof. ",
  "Prof ",
  "कैप्टन ",
  "स्वामी ",
  "सरदार ",
  "लेफ्टिनेंट ",
  "अधिवक्ता ",
  "मेजर ",
  "प्रो. ",
  "प्रो ",
];

function stripHonorific(name: string) {
  for (const prefix of HONORIFIC_PREFIXES) {
    if (name.startsWith(prefix)) {
      return name.slice(prefix.length).trim();
    }
  }
  return name;
}

function personInitial(name: string) {
  const trimmed = stripHonorific(name).replace(/^[\s\d./]+/, "");
  const ch = trimmed.charAt(0);
  return ch || "?";
}

function PersonCard({ person, accent }: { person: EditionDignitary; accent?: string }) {
  return (
    <li className="group flex gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-saffron/40 hover:shadow-md sm:p-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-brand-navy sm:h-12 sm:w-12 ${accent ?? "bg-gradient-to-br from-brand-saffron/30 to-brand-blue/20"}`}
        aria-hidden
      >
        {personInitial(person.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug text-brand-navy">{person.name}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
          {[person.role, person.organization].filter(Boolean).join(" · ")}
        </p>
      </div>
    </li>
  );
}

function SectionHeading({
  id,
  headingId,
  titleEn,
  titleHi,
  description,
}: {
  id: string;
  headingId: string;
  titleEn: string;
  titleHi?: string;
  description?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      {titleHi ? (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-saffron">{titleHi}</p>
      ) : null}
      <h2 id={headingId} className="mt-1 text-xl font-bold text-brand-navy md:text-2xl">
        {titleEn}
      </h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">{description}</p>
      ) : null}
    </div>
  );
}

function PersonGrid({ items, accent }: { items: EditionDignitary[]; accent?: string }) {
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <PersonCard key={`${p.name}-${p.role}`} person={p} accent={accent} />
      ))}
    </ul>
  );
}

export default function AbhiyanPhotoFrameContent() {
  const { patron, advisors, coordinators, dedication, taglineHindi, taglineEn, introParagraphs } =
    ABIYAN_PHOTO_FRAME;
  const stats = buildPhotoFrameStats(coordinators.length);

  return (
    <div className="space-y-12 md:space-y-16">
      <BreadcrumbNav
        items={PHOTO_FRAME_BREADCRUMBS.map((item, index, arr) => ({
          label: item.name,
          href: index < arr.length - 1 ? item.path : undefined,
        }))}
        className="-mt-2 mb-2"
      />

      <section id="overview" className="scroll-mt-24" aria-labelledby="overview-heading">
        <div className="overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-surface-warm via-white to-brand-blue/5 p-6 shadow-sm md:p-8">
          <p className="text-center text-sm italic text-slate-500">{dedication}</p>
          <h2 id="overview-heading" className="sr-only">
            Abhiyan Photo Frame overview
          </h2>
          <p className="mt-3 text-center text-base font-medium leading-relaxed text-brand-navy md:text-lg">
            {taglineEn}
          </p>
          <p lang="hi" className="mt-3 text-center text-sm leading-relaxed text-slate-600 md:text-base">
            {taglineHindi}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PHOTO_FRAME_QUICK_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center gap-2 rounded-xl border border-brand-navy/20 bg-brand-navy px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy/90"
                >
                  <span aria-hidden>{link.icon}</span>
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:shadow-sm"
                >
                  <span aria-hidden>{link.icon}</span>
                  {link.label}
                </Link>
              )
            )}
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/80 bg-white/70 px-3 py-4 text-center shadow-sm backdrop-blur-sm"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-xl font-bold text-brand-navy sm:text-2xl">{stat.value}</dd>
                <dd className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">{stat.hint}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 md:p-6">
          {introParagraphs.map((p) => (
            <p
              key={p.slice(0, 40)}
              lang="hi"
              className="text-justify text-sm leading-relaxed text-slate-700 md:text-base"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      <nav
        aria-label="Page sections"
        className="sticky top-[4.5rem] z-20 -mx-1 overflow-x-auto rounded-xl border border-slate-200/80 bg-white/95 px-2 py-2 shadow-sm backdrop-blur-md md:top-20"
      >
        <ul className="flex min-w-max gap-2 px-1">
          {PHOTO_FRAME_SECTION_NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="inline-flex min-h-[36px] items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:bg-brand-saffron/15 sm:text-sm"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="leadership-heading">
        <SectionHeading
          id="leadership"
          headingId="leadership-heading"
          titleEn="Leadership"
          titleHi="नेतृत्व"
          description="Patron and advisory council guiding Shiksha Mahakumbh Abhiyan."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <article className="lg:col-span-2 overflow-hidden rounded-2xl border border-brand-saffron/30 bg-gradient-to-br from-brand-saffron/10 to-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-saffron-dark">Patron</p>
            <p className="mt-1 text-xs text-slate-500">संरक्षक</p>
            <div className="mt-4 flex items-start gap-4">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-brand-saffron/40 bg-white text-xl font-bold text-brand-navy shadow"
                aria-hidden
              >
                {personInitial(patron.name)}
              </div>
              <div>
                <p className="text-lg font-bold text-brand-navy">{patron.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {patron.role} · {patron.organization}
                </p>
                <p className="mt-1 text-sm text-slate-500">{patron.nameEn}</p>
              </div>
            </div>
          </article>

          <article className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-blue">Advisors</p>
            <p className="mt-1 text-xs text-slate-500">परामर्शदाता</p>
            <PersonGrid items={[...advisors]} accent="bg-brand-blue/15" />
          </article>
        </div>
      </section>

      <section aria-labelledby="editions-heading">
        <SectionHeading
          id="editions"
          headingId="editions-heading"
          titleEn="Editions 1.0 – 5.0"
          titleHi="संस्करण"
          description="Five national editions of Shiksha Mahakumbh across premier institutions."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PAST_EDITIONS.map((edition) => (
            <article
              key={edition.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-saffron/40 hover:shadow-md"
            >
              {edition.imageSrc ? (
                <div className="relative h-36 bg-slate-100">
                  <Image
                    src={edition.imageSrc}
                    alt={`${edition.title} — ${edition.venue} ${edition.year}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="rounded-full bg-brand-saffron px-2.5 py-0.5 text-xs font-bold text-brand-navy">
                      Edition {edition.edition}
                    </span>
                    <h3 className="mt-1 text-sm font-semibold text-white line-clamp-1">{edition.title}</h3>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-brand-navy to-brand-navy/85 px-4 py-3">
                  <span className="rounded-full bg-brand-saffron px-2.5 py-0.5 text-xs font-bold text-brand-navy">
                    Edition {edition.edition}
                  </span>
                  <h3 className="mt-2 font-semibold text-white">{edition.title}</h3>
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <p className="text-sm text-slate-600">
                  {edition.venue} · {edition.dates}
                </p>
                <p className="mt-2 flex-1 text-sm font-medium text-brand-navy">{edition.theme}</p>
                <Link
                  href={edition.href}
                  className="mt-4 inline-flex text-sm font-semibold text-brand-saffron hover:underline"
                >
                  Edition details →
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center sm:text-left">
          <Link href="/past-events" className="font-semibold text-brand-blue hover:underline">
            Explore full past editions archive →
          </Link>
        </p>
      </section>

      <section aria-labelledby="guests-heading">
        <SectionHeading
          id="chief-guests"
          headingId="guests-heading"
          titleEn="Chief Guests by Edition"
          titleHi="प्रमुख अतिथि"
          description="Distinguished guests who graced each Shiksha Mahakumbh edition."
        />
        <div className="mt-6 space-y-4">
          {PAST_EDITIONS.map((edition) => {
            const guests = EDITION_CHIEF_GUESTS[edition.edition] ?? [];
            if (guests.length === 0) return null;
            return (
              <article
                key={edition.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
                  <h3 className="font-semibold text-brand-saffron">{edition.title}</h3>
                  <p className="text-sm text-slate-600">
                    {edition.venue} · {edition.dates}
                  </p>
                </div>
                <div className="p-4 sm:p-5">
                  <PersonGrid items={guests} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="invitation-heading">
        <div className="overflow-hidden rounded-2xl border border-brand-saffron/30 bg-gradient-to-br from-brand-saffron/5 via-white to-brand-blue/5 p-6 md:p-8">
          <SectionHeading
            id="invitation"
            headingId="invitation-heading"
            titleEn="Invitation Campaign"
            titleHi="निमंत्रण अभियान"
            description="National and state dignitaries honoured through the Shiksha Mahakumbh invitation outreach."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {INVITATION_CAMPAIGN_GROUPS.map((group) => (
              <article
                key={group.id}
                className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${group.accent} shadow-sm`}
              >
                <header className="flex items-center gap-3 border-b border-white/60 bg-white/50 px-4 py-3 backdrop-blur-sm sm:px-5">
                  <span className="text-2xl" aria-hidden>
                    {group.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-brand-navy">{group.titleEn}</h3>
                    <p className="text-xs text-slate-600">{group.titleHi}</p>
                  </div>
                </header>
                <ul className="space-y-2 p-4 sm:p-5">
                  {getInvitationGroupItems(group.items).map((person) => (
                    <li
                      key={`${group.id}-${person.name}`}
                      className="flex gap-3 rounded-lg border border-white/70 bg-white/80 px-3 py-2.5 text-sm backdrop-blur-sm"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-xs font-bold text-brand-navy"
                        aria-hidden
                      >
                        {personInitial(person.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-brand-navy">{person.name}</span>
                        <span className="block text-xs text-slate-600">
                          {[person.role, person.organization].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="coordinators-heading">
        <SectionHeading
          id="coordinators"
          headingId="coordinators-heading"
          titleEn="Coordinators"
          titleHi="समन्वयक"
          description="Programme leads across conferences, olympiads, exhibitions, and core operations."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coordinators.map((c, i) => (
            <article
              key={`${c.name}-${c.role}`}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-saffron/35 hover:shadow-md"
            >
              <span className="absolute right-3 top-3 rounded-full bg-brand-saffron/15 px-2 py-0.5 text-[10px] font-bold text-brand-navy">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-navy/10 to-brand-saffron/20 text-sm font-bold text-brand-navy"
                  aria-hidden
                >
                  {personInitial(c.name)}
                </div>
                <div className="min-w-0 pr-6">
                  <p className="font-semibold leading-snug text-brand-navy">{c.name}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-saffron-dark">
                    {c.role}
                  </p>
                  {c.organization ? (
                    <p className="mt-1 text-sm text-slate-600">{c.organization}</p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="overflow-hidden rounded-2xl border border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 via-white to-brand-saffron/5 p-6 text-center md:p-10"
        aria-labelledby="upcoming-heading"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-saffron">Next edition</p>
        <h2 id="upcoming-heading" className="mt-2 text-2xl font-bold text-brand-navy md:text-3xl">
          {PHOTO_FRAME_UPCOMING_CTA.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          {PHOTO_FRAME_UPCOMING_CTA.venue} · {PHOTO_FRAME_UPCOMING_CTA.dates}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={PHOTO_FRAME_UPCOMING_CTA.registrationHref}
            className="inline-flex min-h-[48px] items-center rounded-xl bg-brand-saffron px-8 py-3 text-sm font-bold text-brand-navy shadow-lg transition hover:bg-brand-saffron-dark hover:text-white"
          >
            Register for SMK 6.0
          </Link>
          <Link
            href={PHOTO_FRAME_UPCOMING_CTA.learnMoreHref}
            className="inline-flex min-h-[48px] items-center rounded-xl border border-brand-navy/30 bg-white px-8 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/5"
          >
            Upcoming events
          </Link>
        </div>
      </section>

      <section aria-labelledby="pdf-heading">
        <SectionHeading
          id="pdf"
          headingId="pdf-heading"
          titleEn="Full Photo Frame (PDF)"
          titleHi="संपूर्ण फोटो फ्रेम"
          description="Browse or download the complete official photo frame document."
        />
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
          <iframe
            src={ABIYAN_PHOTO_FRAME.pdfEmbedUrl}
            title="Shiksha Mahakumbh Abhiyan Photo Frame PDF"
            className="h-[min(80vh,720px)] min-h-[360px] w-full sm:min-h-[480px]"
            loading="lazy"
          />
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
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
    </div>
  );
}
