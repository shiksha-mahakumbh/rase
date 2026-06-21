import { createPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Brochures & Downloads",
  description:
    "Official Shiksha Mahakumbh Abhiyan edition brochures and downloadable resources for delegates worldwide.",
  path: "/downloads",
  keywords: ["brochures", "downloads", "Shiksha Mahakumbh", "PDF"],
});

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Brochures & Downloads",
      item: `${SITE_URL}/downloads`,
    },
  ],
};

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
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
