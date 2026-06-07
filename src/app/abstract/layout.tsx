import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";

export const metadata = PUBLIC_PAGE_META.abstract;

export default function AbstractLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
