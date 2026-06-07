import { committeeYearMeta } from "@/lib/seo/publicPages";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata = committeeYearMeta("shikshamahakumbh2023", "Shiksha Mahakumbh 2023", "2023");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Committee", path: "/committeepage" },
          { name: "Shiksha Mahakumbh 2023", path: "/committee/shikshamahakumbh2023" },
        ]}
      />
      {children}
    </>
  );
}
