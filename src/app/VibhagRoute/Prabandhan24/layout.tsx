import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";
import VibhagJsonLd from "@/components/vibhag/VibhagJsonLd";

export const metadata = PUBLIC_PAGE_META.vibhagPrabandhan;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <VibhagJsonLd slug="Prabandhan24" />
      {children}
    </>
  );
}
