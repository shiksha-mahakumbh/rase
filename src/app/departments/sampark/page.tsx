import SamparkVibhag from "@/components/vibhag/SamparkVibhag";
import DepartmentPage from "@/components/departments/DepartmentPage";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { renderDepartmentPage } from "@/lib/cms/department-page-loader";

export default async function SamparkDepartmentPage() {
  return renderDepartmentPage(
    "sampark",
    <DepartmentPage
      slug="Sampark24"
      canonicalPath={CANONICAL_ROUTES.departments.sampark}
    >
      <SamparkVibhag />
    </DepartmentPage>
  );
}
