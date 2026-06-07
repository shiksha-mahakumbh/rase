import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";

export const metadata = PUBLIC_PAGE_META.feedback;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
