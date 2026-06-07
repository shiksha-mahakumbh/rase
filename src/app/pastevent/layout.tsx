import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";

export const metadata = PUBLIC_PAGE_META.pastevent;

export default function PastEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
