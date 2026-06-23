import SpeakersDirectoryJsonLd from "@/components/seo/SpeakersDirectoryJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  SPEAKERS_DIRECTORY_KEYWORDS,
  SPEAKERS_DIRECTORY_OG_IMAGE,
  SPEAKERS_DIRECTORY_PATH,
  speakersDirectoryMetaDescription,
} from "@/data/speakers-directory-content";

export const metadata = createPageMetadata({
  title: "Speaker Directory — Shiksha Mahakumbh Editions 1.0–5.0",
  description: speakersDirectoryMetaDescription(),
  path: SPEAKERS_DIRECTORY_PATH,
  keywords: [...SPEAKERS_DIRECTORY_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: SPEAKERS_DIRECTORY_OG_IMAGE,
});

export default function SpeakersDirectoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SpeakersDirectoryJsonLd />
      {children}
    </>
  );
}
