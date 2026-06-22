import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { PAST_EDITIONS_SEO_KEYWORDS } from "@/data/past-editions";

export const metadata = {
  ...PUBLIC_PAGE_META.pastEvents,
  keywords: PAST_EDITIONS_SEO_KEYWORDS,
};

export default function PastEventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Past Editions", path: CANONICAL_ROUTES.pastEvents },
        ]}
      />
      {children}
    </>
  );
}
