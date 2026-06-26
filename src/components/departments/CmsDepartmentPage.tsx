import DepartmentPage from "@/components/departments/DepartmentPage";
import SafeHtml from "@/components/common/SafeHtml";
import type { CmsLoadedPage } from "@/lib/cms/types";
import { cmsSlugToVibhagSlug } from "@/data/departments-hub";

export default function CmsDepartmentPage({
  cms,
}: {
  cms: CmsLoadedPage;
}) {
  const path = `/departments/${cms.page.slug}`;
  const vibhagSlug = cmsSlugToVibhagSlug(cms.page.slug);
  return (
    <DepartmentPage slug={vibhagSlug} canonicalPath={path} showRelatedNav={false}>
      {cms.page.content ? (
        <SafeHtml html={cms.page.content} className="prose prose-slate max-w-none" />
      ) : (
        <p className="text-slate-600">Department content is being updated.</p>
      )}
    </DepartmentPage>
  );
}
