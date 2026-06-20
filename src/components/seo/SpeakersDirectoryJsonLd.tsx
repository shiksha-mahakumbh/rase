import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/config/site";
import {
  MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS,
  totalAbhiyanSpeakerCount,
} from "@/data/mahakumbh-abhiyan-speakers";
import { SPEAKERS_DIRECTORY_HERO } from "@/data/speakers-directory-content";

export default function SpeakersDirectoryJsonLd() {
  const total = totalAbhiyanSpeakerCount();

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${SPEAKERS_DIRECTORY_HERO.title} — Shiksha Mahakumbh Editions 1.0–5.0`,
        description: SPEAKERS_DIRECTORY_HERO.subtitle,
        url: `${SITE_URL}/speakers/directory`,
        inLanguage: ["en-IN", "hi-IN"],
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        },
        about: {
          "@type": "EventSeries",
          name: "Shiksha Mahakumbh",
          description: "National multidisciplinary education summit series",
        },
        numberOfItems: total,
        hasPart: MAHAKUMBH_ABHIYAN_SPEAKER_EDITIONS.map((edition) => ({
          "@type": "ItemList",
          name: `Shiksha Mahakumbh ${edition.edition} Speakers`,
          numberOfItems: edition.speakers.length,
        })),
      }}
    />
  );
}
