import { createPageMetadata } from "@/lib/seo/metadata";
import {
  GALLERY_OG_IMAGE,
  GALLERY_PAGE_HERO,
  GALLERY_SEO_KEYWORDS,
} from "@/data/gallery-hub";

export const metadata = createPageMetadata({
  title: "Photo & Video Gallery — Shiksha Mahakumbh 1.0 to 6.0",
  description: GALLERY_PAGE_HERO.subtitle,
  path: "/gallery",
  keywords: [...GALLERY_SEO_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: GALLERY_OG_IMAGE,
});

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
