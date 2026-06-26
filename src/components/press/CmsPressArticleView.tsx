import PressArticleJsonLd from "@/components/seo/PressArticleJsonLd";
import PressArticleShell from "@/components/press/PressArticleShell";
import PressArticleBody from "@/components/press/PressArticleBody";
import SafeHtml from "@/components/common/SafeHtml";
import type { CmsLoadedPage } from "@/lib/cms/types";
import { SITE_URL } from "@/config/site";

type ArticleSection = {
  title?: string;
  body?: string;
};

function parseArticleMeta(cms: CmsLoadedPage) {
  const section = cms.page.sections.find((s) => s.sectionKey === "article");
  const content = section?.content ?? {};
  const heroImage =
    typeof content.heroImage === "string" ? content.heroImage : undefined;
  const pressNumber =
    typeof content.pressNumber === "number" ? content.pressNumber : undefined;
  const shareText =
    typeof content.shareText === "string" ? content.shareText : cms.page.title;
  const sections = Array.isArray(content.sections)
    ? (content.sections as ArticleSection[])
    : [];

  return { heroImage, pressNumber, shareText, sections };
}

export default function CmsPressArticleView({
  cms,
  slug,
}: {
  cms: CmsLoadedPage;
  slug: string;
}) {
  const canonicalPath = `/press/${slug}`;
  const shareUrl = `${SITE_URL}${canonicalPath}`;
  const { heroImage, pressNumber, shareText, sections } = parseArticleMeta(cms);

  return (
    <>
      {pressNumber ? <PressArticleJsonLd pressNumber={pressNumber} /> : null}
      <PressArticleShell
        title={cms.page.title}
        subtitle={cms.page.excerpt ?? undefined}
        canonicalPath={canonicalPath}
        shareUrl={shareUrl}
        shareText={shareText}
        shareImage={heroImage ?? cms.seo?.ogImageUrl ?? undefined}
      >
        {cms.page.content ? (
          <SafeHtml
            html={cms.page.content}
            className="prose prose-slate mb-8 max-w-none"
          />
        ) : null}
        <PressArticleBody
          title={cms.page.title}
          heroImage={heroImage ?? cms.seo?.ogImageUrl ?? undefined}
          sections={sections.map((s) => ({
            title: s.title ?? "",
            body: s.body ?? "",
          }))}
        />
      </PressArticleShell>
    </>
  );
}
