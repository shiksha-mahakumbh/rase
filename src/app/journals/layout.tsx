import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";

export const metadata = PUBLIC_PAGE_META.journals;

export default function JournalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
