import { committeeYearMeta } from "@/lib/seo/publicPages";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata = committeeYearMeta("shikshakumbh2023", "Shiksha Kumbh 2023", "2023");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Committee", path: "/committees" },
          { name: "Shiksha Kumbh 2023", path: "/committee/shikshakumbh2023" },
        ]}
      />
      {children}
    </>
  );
}
