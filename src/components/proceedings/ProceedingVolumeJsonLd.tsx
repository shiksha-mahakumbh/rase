import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import type { ProceedingsVolumeEntry } from "@/data/proceedings-hub";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";

type Props = {
  volume: ProceedingsVolumeEntry;
};

export default function ProceedingVolumeJsonLd({ volume }: Props) {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Publications", path: "/publications" },
    { name: "Proceedings", path: "/proceedings" },
    { name: `Volume ${volume.volume}`, path: volume.readHref },
  ]);

  const publication = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: volume.label,
    description: volume.theme,
    url: `${SITE_URL}${volume.readHref}`,
    datePublished: volume.year,
    publisher: {
      "@type": "Organization",
      name: "Department of Holistic Education",
      url: SITE_URL,
    },
    numberOfPages: volume.paperCount,
    bookFormat: "https://schema.org/EBook",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${volume.pdfHref}`,
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={publication} />
    </>
  );
}
