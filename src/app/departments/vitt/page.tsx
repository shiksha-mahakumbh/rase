import VittVibhag from "@/components/vibhag/VittVibhag";
import DepartmentPage from "@/components/departments/DepartmentPage";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { renderDepartmentPage } from "@/lib/cms/department-page-loader";

export default async function VittDepartmentPage() {
  return renderDepartmentPage(
    "vitt",
    <DepartmentPage
      slug="Vitt24"
      canonicalPath={CANONICAL_ROUTES.departments.vitt}
    >
      <VittVibhag />
    </DepartmentPage>
  );
}
