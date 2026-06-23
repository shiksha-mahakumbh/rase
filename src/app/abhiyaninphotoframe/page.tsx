import PublicPageShell from "@/components/layouts/PublicPageShell";
import AbhiyanPhotoFrameContent from "@/components/abhiyan/AbhiyanPhotoFrameContent";
import {
  PHOTO_FRAME_BREADCRUMBS,
  PHOTO_FRAME_HERO_IMAGE,
  PHOTO_FRAME_HERO_IMAGE_ALT,
  PHOTO_FRAME_PAGE_HERO,
} from "@/data/abhiyan-photo-frame-hub";
import { ABIYAN_PHOTO_FRAME } from "@/data/abhiyan-photo-frame";

export default function AbhiyanPhotoFramePage() {
  return (
    <PublicPageShell
      hero={{
        eyebrow: PHOTO_FRAME_PAGE_HERO.eyebrow,
        title: PHOTO_FRAME_PAGE_HERO.title,
        subtitle: PHOTO_FRAME_PAGE_HERO.subtitle,
        accent: "brand",
        imageSrc: PHOTO_FRAME_HERO_IMAGE,
        imageAlt: PHOTO_FRAME_HERO_IMAGE_ALT,
      }}
      breadcrumbs={[...PHOTO_FRAME_BREADCRUMBS]}
      relatedPath={ABIYAN_PHOTO_FRAME.pagePath}
      showCta={false}
      containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10"
    >
      <AbhiyanPhotoFrameContent />
    </PublicPageShell>
  );
}
