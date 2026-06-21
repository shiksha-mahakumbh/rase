import Image from "next/image";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL } from "@/config/site";
import type { CmsLoadedSpeaker } from "@/lib/cms/types";
import { buildPersonJsonLd } from "@/lib/seo/schemas";
import { ROUTES } from "@/constants/routes";
import { BRAND_HERO_IMAGE } from "@/lib/page-heroes";

export default function CmsSpeakerView({ speaker }: { speaker: CmsLoadedSpeaker }) {
  const role =
    [speaker.designation, speaker.institution].filter(Boolean).join(" — ") ||
    speaker.title ||
    undefined;

  const personJsonLd = buildPersonJsonLd({
    name: speaker.fullName,
    jobTitle: role,
    worksFor: speaker.institution ?? undefined,
    url: `${SITE_URL}/speakers/${speaker.slug}`,
  });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Speakers", path: ROUTES.speakers },
          { name: speaker.fullName, path: `/speakers/${speaker.slug}` },
        ]}
      />
      <JsonLd data={personJsonLd} />
      <PublicPageShell
        hero={{
          eyebrow: "Speaker Profile",
          title: speaker.fullName,
          subtitle: role,
          accent: "brand",
          imageSrc: speaker.photoUrl ?? BRAND_HERO_IMAGE,
        }}
        relatedPath={ROUTES.speakers}
        showCta={false}
        containerClassName="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12"
      >
        <article className="mx-auto max-w-3xl">
          {speaker.photoUrl && (
            <div className="relative mx-auto mb-8 h-48 w-48 overflow-hidden rounded-full border-4 border-brand-saffron/30 shadow-lg md:hidden">
              <Image
                src={speaker.photoUrl}
                alt={speaker.fullName}
                fill
                className="object-cover object-top"
                sizes="192px"
                priority
              />
            </div>
          )}
          {speaker.bio && (
            <div
              className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              dangerouslySetInnerHTML={{ __html: speaker.bio }}
            />
          )}
          {speaker.topics.length > 0 && (
            <section className="mt-8 rounded-2xl border border-brand-blue/15 bg-brand-surface-warm p-6">
              <h2 className="text-lg font-bold text-brand-navy">Topics</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {speaker.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full border border-brand-saffron/25 bg-white px-3 py-1 text-sm font-medium text-brand-navy"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </PublicPageShell>
    </>
  );
}
