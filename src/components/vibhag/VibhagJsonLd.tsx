import { SITE_URL } from "@/config/site";
import { getVibhagBySlug } from "@/data/vibhag-pages";

interface VibhagJsonLdProps {
  slug: string;
}

export default function VibhagJsonLd({ slug }: VibhagJsonLdProps) {
  const page = getVibhagBySlug(slug);
  if (!page) return null;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Departments",
        item: `${SITE_URL}/VibhagRoute/AcademicCouncil24`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.title,
        item: `${SITE_URL}${page.path}`,
      },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${page.title} — Shiksha Mahakumbh`,
    description: page.description,
    url: `${SITE_URL}${page.path}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Shiksha Mahakumbh Abhiyan",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
    </>
  );
}
