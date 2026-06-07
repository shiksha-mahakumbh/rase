import { createPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Wishes Received — Shiksha Mahakumbh 2024",
  description:
    "Best wishes and greetings from dignitaries, governors, ministers, and institutional leaders for Shiksha Mahakumbh 2024.",
  path: "/wishes-received",
});

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Best Wishes", item: `${SITE_URL}/Best_Wishes` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Wishes Received",
      item: `${SITE_URL}/Wishes_Received`,
    },
  ],
};

export default function WishesReceivedLayout({
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
      {children}
    </>
  );
}
