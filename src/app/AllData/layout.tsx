import { datadekhMeta } from "@/lib/seo/publicPages";

export const metadata = datadekhMeta("AllData");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
