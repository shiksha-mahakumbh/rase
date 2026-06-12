import PressArticleShell from "@/components/press/PressArticleShell";
import type { CmsLoadedPage } from "@/lib/cms/types";
import { SITE_URL } from "@/config/site";

type ArticleSection = {
  title?: string;
  body?: string;
  type?: string;
};

function parseArticleMeta(cms: CmsLoadedPage) {
  const section = cms.page.sections.find((s) => s.sectionKey === "article");
  const content = section?.content ?? {};
  const heroImage =
    typeof content.heroImage === "string" ? content.heroImage : undefined;
  const sections = Array.isArray(content.sections)
    ? (content.sections as ArticleSection[])
    : [];

  return { heroImage, sections };
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
  const { heroImage, sections } = parseArticleMeta(cms);

  return (
    <PressArticleShell
      title={cms.page.title}
      subtitle={cms.page.excerpt ?? undefined}
      canonicalPath={canonicalPath}
      shareUrl={shareUrl}
      shareText={cms.page.title}
      shareImage={heroImage ?? cms.seo?.ogImageUrl ?? undefined}
    >
      {cms.page.content && (
        <div
          className="mb-8"
          dangerouslySetInnerHTML={{ __html: cms.page.content }}
        />
      )}
      {sections.map((section, index) => (
        <section key={`${section.title ?? "section"}-${index}`} className="mb-8">
          {section.title && <h2>{section.title}</h2>}
          {section.body && (
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: section.body }}
            />
          )}
        </section>
      ))}
    </PressArticleShell>
  );
}
