import { committeeYearMeta } from "@/lib/seo/publicPages";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata = committeeYearMeta("shikshakumbh2024", "Shiksha Kumbh 2024", "2024");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Committee", path: "/committees" },
          { name: "Shiksha Kumbh 2024", path: "/committee/shikshakumbh2024" },
        ]}
      />
      {children}
    </>
  );
}
