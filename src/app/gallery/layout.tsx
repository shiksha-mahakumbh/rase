import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";

export const metadata = PUBLIC_PAGE_META.gallery;

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
