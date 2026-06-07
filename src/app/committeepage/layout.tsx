import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";

export const metadata = PUBLIC_PAGE_META.committeepage;

export default function CommitteePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
