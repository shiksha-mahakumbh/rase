import PressArticleJsonLd from "@/components/seo/PressArticleJsonLd";
import PressArticleShell from "@/components/press/PressArticleShell";
import PressArticleBody from "@/components/press/PressArticleBody";
import { SITE_URL } from "@/config/site";
import type { PressArticleRecord } from "@/lib/press/articles";

export default function StaticPressArticleView({
  article,
}: {
  article: PressArticleRecord;
}) {
  const canonicalPath = `/press/${article.slug}`;
  const shareUrl = `${SITE_URL}${canonicalPath}`;

  return (
    <>
      <PressArticleJsonLd pressNumber={article.pressNumber} />
      <PressArticleShell
        title={article.title}
        subtitle={article.excerpt}
        canonicalPath={canonicalPath}
        shareUrl={shareUrl}
        shareText={article.shareText}
        shareImage={article.heroImage}
      >
        <PressArticleBody
          title={article.title}
          heroImage={article.heroImage}
          sections={article.sections}
        />
      </PressArticleShell>
    </>
  );
}
