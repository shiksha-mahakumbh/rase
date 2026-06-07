import { committeeYearMeta } from "@/lib/seo/publicPages";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata = committeeYearMeta("shikshamahakumbh2024", "Shiksha Mahakumbh 2024", "2024");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Committee", path: "/committeepage" },
          { name: "Shiksha Mahakumbh 2024", path: "/committee/shikshamahakumbh2024" },
        ]}
      />
      {children}
    </>
  );
}
