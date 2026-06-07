import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";

export const metadata = PUBLIC_PAGE_META.proceedings;

export default function ProceedingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
