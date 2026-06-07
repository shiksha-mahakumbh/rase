import { committeeYearMeta } from "@/lib/seo/publicPages";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata = committeeYearMeta(
  "shikshamahakumbh2025",
  "Shiksha Mahakumbh 5.0 — NIPER Mohali",
  "2025"
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Committee", path: "/committees" },
          { name: "Shiksha Mahakumbh 5.0", path: "/committee/shikshamahakumbh2025" },
        ]}
      />
      {children}
    </>
  );
}
