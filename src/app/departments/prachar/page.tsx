import PracharVibhag from "@/components/vibhag/PracharVibhag";
import DepartmentPage from "@/components/departments/DepartmentPage";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { renderDepartmentPage } from "@/lib/cms/department-page-loader";

export default async function PracharDepartmentPage() {
  return renderDepartmentPage(
    "prachar",
    <DepartmentPage
      slug="Prachar24"
      canonicalPath={CANONICAL_ROUTES.departments.prachar}
    >
      <PracharVibhag />
    </DepartmentPage>
  );
}
