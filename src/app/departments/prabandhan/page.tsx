import PrabandhanVibhag from "@/components/vibhag/PrabandhanVibhag";
import DepartmentPage from "@/components/departments/DepartmentPage";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { renderDepartmentPage } from "@/lib/cms/department-page-loader";

export default async function PrabandhanDepartmentPage() {
  return renderDepartmentPage(
    "prabandhan",
    <DepartmentPage
      slug="Prabandhan24"
      canonicalPath={CANONICAL_ROUTES.departments.prabandhan}
    >
      <PrabandhanVibhag />
    </DepartmentPage>
  );
}
