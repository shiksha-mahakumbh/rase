import { PUBLIC_PAGE_META } from "@/lib/seo/publicPages";
import { SITE_URL } from "@/config/site";

export const metadata = PUBLIC_PAGE_META.merchandise;

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Merchandise",
      item: `${SITE_URL}/merchandise`,
    },
  ],
};

const store = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Shiksha Mahakumbh Official Merchandise",
  description:
    "Official merchandise of Shiksha Mahakumbh Abhiyan — T-shirts, mugs, caps, and conference bags.",
  url: `${SITE_URL}/merchandise`,
};

export default function MerchandiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(store) }}
      />
      {children}
    </>
  );
}
