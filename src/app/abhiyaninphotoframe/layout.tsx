import AbhiyanPhotoFrameJsonLd from "@/components/seo/AbhiyanPhotoFrameJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { ABIYAN_PHOTO_FRAME } from "@/data/abhiyan-photo-frame";
import {
  PHOTO_FRAME_OG_IMAGE,
  PHOTO_FRAME_PAGE_HERO,
  PHOTO_FRAME_SEO_KEYWORDS,
} from "@/data/abhiyan-photo-frame-hub";

export const metadata = createPageMetadata({
  title: "Shiksha Mahakumbh Abhiyan Photo Frame",
  description:
    "Official Shiksha Mahakumbh Abhiyan photo frame — patron, advisors, edition chief guests, invitation campaign dignitaries, coordinators, and PDF across editions 1.0–5.0. National education movement, NEP 2020 aligned.",
  path: ABIYAN_PHOTO_FRAME.pagePath,
  keywords: [...PHOTO_FRAME_SEO_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: PHOTO_FRAME_OG_IMAGE,
});

export default function AbhiyanPhotoFrameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AbhiyanPhotoFrameJsonLd />
      {children}
    </>
  );
}
