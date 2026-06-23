import LegalPageShell from "@/components/layouts/LegalPageShell";
import type { CmsLoadedPage } from "@/lib/cms/types";

export default function CmsLegalPage({ cms }: { cms: CmsLoadedPage }) {
  const path = cms.page.slug.startsWith("/") ? cms.page.slug : `/${cms.page.slug}`;
  return (
    <LegalPageShell title={cms.page.title} path={path}>
      {cms.page.content ? (
        <div dangerouslySetInnerHTML={{ __html: cms.page.content }} />
      ) : (
        <p>Content not available.</p>
      )}
    </LegalPageShell>
  );
}
