import Image from "next/image";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { SITE_URL } from "@/config/site";
import type { CmsLoadedSpeaker } from "@/lib/cms/types";
import { buildPersonJsonLd } from "@/lib/seo/schemas";

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
          { name: "Speakers", path: "/speakers" },
          { name: speaker.fullName, path: `/speakers/${speaker.slug}` },
        ]}
      />
      <JsonLd data={personJsonLd} />
      <PublicPageShell
        hero={{
          eyebrow: "Speaker Profile",
          title: speaker.fullName,
          subtitle: role,
          accent: "navy",
        }}
        relatedPath="/speakers"
        showCta={false}
      >
        <article className="mx-auto max-w-3xl">
          {speaker.photoUrl && (
            <div className="relative mx-auto mb-8 h-48 w-48 overflow-hidden rounded-full">
              <Image
                src={speaker.photoUrl}
                alt={speaker.fullName}
                fill
                className="object-cover"
                sizes="192px"
                priority
              />
            </div>
          )}
          {speaker.bio && (
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: speaker.bio }}
            />
          )}
          {speaker.topics.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-brand-navy">Topics</h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {speaker.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-full bg-brand-surface-warm px-3 py-1 text-sm text-brand-navy"
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
