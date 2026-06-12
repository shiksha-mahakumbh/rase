import DepartmentPage from "@/components/departments/DepartmentPage";
import type { CmsLoadedPage } from "@/lib/cms/types";

export default function CmsDepartmentPage({
  cms,
}: {
  cms: CmsLoadedPage;
}) {
  const path = `/departments/${cms.page.slug}`;
  return (
    <DepartmentPage slug={cms.page.slug} canonicalPath={path} showRelatedNav={false}>
      {cms.page.content ? (
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: cms.page.content }}
        />
      ) : (
        <p className="text-slate-600">Department content is being updated.</p>
      )}
    </DepartmentPage>
  );
}
