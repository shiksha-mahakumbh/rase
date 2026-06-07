import JsonLd from "@/components/seo/JsonLd";
import { buildNewsArticleJsonLd } from "@/lib/seo/schemas";
import { getPressArticleContent } from "@/lib/seo/publicPages";

export default function PressArticleJsonLd({
  pressNumber,
}: {
  pressNumber: number;
}) {
  const article = getPressArticleContent(pressNumber);
  return (
    <JsonLd
      data={buildNewsArticleJsonLd({
        headline: article.title,
        description: article.description,
        path: article.path,
        image: article.image,
      })}
    />
  );
}
