import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";

export const metadata = PUBLIC_PAGE_META.media;

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
