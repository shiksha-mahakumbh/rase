import LegalPageShell from "@/components/layouts/LegalPageShell";
import type { CmsLoadedPage } from "@/lib/cms/types";

export default function CmsLegalPage({ cms }: { cms: CmsLoadedPage }) {
  return (
    <LegalPageShell title={cms.page.title}>
      {cms.page.content ? (
        <div dangerouslySetInnerHTML={{ __html: cms.page.content }} />
      ) : (
        <p>Content not available.</p>
      )}
    </LegalPageShell>
  );
}
