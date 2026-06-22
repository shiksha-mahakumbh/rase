import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import { buildBreadcrumbSchema, buildCollectionPageSchema, buildItemListSchema } from "@/lib/seo/schema";
import { PRESS_COVERAGE_LINKS } from "@/data/media-archives";

export default function PressJsonLd() {
  const collection = buildCollectionPageSchema({
    name: "Shiksha Mahakumbh Press Releases",
    description:
      "Official press releases and national coverage from Shiksha Mahakumbh Abhiyan national education summits.",
    path: "/press",
  });

  const itemList = buildItemListSchema({
    name: "Press releases",
    items: PRESS_COVERAGE_LINKS.filter((p) => p.href !== "/press").map((p) => ({
      name: p.label,
      url: `${SITE_URL}${p.href}`,
    })),
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Media Centre", path: "/media-center" },
    { name: "Press Releases", path: "/press" },
  ]);

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbs} />
    </>
  );
}
