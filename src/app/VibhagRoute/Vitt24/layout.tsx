import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";
import VibhagJsonLd from "@/components/vibhag/VibhagJsonLd";

export const metadata = PUBLIC_PAGE_META.vibhagVitt;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <VibhagJsonLd slug="Vitt24" />
      {children}
    </>
  );
}
