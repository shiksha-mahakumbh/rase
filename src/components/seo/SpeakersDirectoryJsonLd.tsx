import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import {
  MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS,
  totalAbhiyanSpeakerCount,
} from "@/data/mahakumbh-abhiyan-speakers";
import { getEditionByNumber } from "@/data/past-editions";
import {
  SPEAKERS_DIRECTORY_CANONICAL_URL,
  SPEAKERS_DIRECTORY_HERO,
  SPEAKERS_DIRECTORY_HERO_IMAGE,
  SPEAKERS_DIRECTORY_PATH,
  speakersDirectoryMetaDescription,
} from "@/data/speakers-directory-content";
import { committeePathForEdition } from "@/lib/committee/edition-slugs";
import {
  buildCollectionPageSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function SpeakersDirectoryJsonLd() {
  const total = totalAbhiyanSpeakerCount();

  const collection = buildCollectionPageSchema({
    name: `${SPEAKERS_DIRECTORY_HERO.title} — ${SPEAKERS_DIRECTORY_HERO.titleEditionLine}`,
    description: speakersDirectoryMetaDescription(),
    path: SPEAKERS_DIRECTORY_PATH,
  });

  const editionsList = buildItemListSchema({
    name: "Shiksha Mahakumbh speaker editions",
    items: MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS.map((edition) => {
      const past = getEditionByNumber(edition.edition);
      return {
        name: `${edition.title} (${edition.speakers.length} speakers)`,
        url: past
          ? `${SITE_URL}${past.href}`
          : `${SPEAKERS_DIRECTORY_CANONICAL_URL}#edition-${edition.edition.replace(".", "-")}`,
      };
    }),
  });

  const committeeList = buildItemListSchema({
    name: "Edition organising committees",
    items: MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS.map((edition) => ({
      name: `Edition ${edition.edition} committee`,
      url: `${SITE_URL}${committeePathForEdition(edition.edition)}`,
    })),
  });

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SPEAKERS_DIRECTORY_HERO.title} — Shiksha Mahakumbh Editions 1.0–5.0`,
    description: speakersDirectoryMetaDescription(),
    url: SPEAKERS_DIRECTORY_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${SPEAKERS_DIRECTORY_HERO_IMAGE}`,
    isPartOf: orgReference(),
    about: {
      "@type": "EventSeries",
      name: "Shiksha Mahakumbh Abhiyan",
      description: "National multidisciplinary education summit series",
    },
    abstract: `${total} speaker listings across editions 1.0 through 5.0.`,
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={editionsList} />
      <JsonLd data={committeeList} />
      <JsonLd data={webPage} />
    </>
  );
}
