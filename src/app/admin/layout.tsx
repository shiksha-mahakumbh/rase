import { NO_INDEX_META } from "@/lib/seo/publicPages";

export const metadata = NO_INDEX_META.admin;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
