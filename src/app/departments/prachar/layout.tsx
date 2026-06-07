import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";
import VibhagJsonLd from "@/components/vibhag/VibhagJsonLd";

export const metadata = PUBLIC_PAGE_META.vibhagPrachar;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <VibhagJsonLd slug="Prachar24" />
      {children}
    </>
  );
}
