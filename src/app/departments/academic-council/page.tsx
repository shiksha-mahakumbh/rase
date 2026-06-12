import AcademicCouncil from "@/app/component/Vibhag/AcademicCouncil24";
import DepartmentPage from "@/components/departments/DepartmentPage";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { renderDepartmentPage } from "@/lib/cms/department-page-loader";

export default async function AcademicCouncilDepartmentPage() {
  return renderDepartmentPage(
    "academic-council",
    <DepartmentPage
      slug="AcademicCouncil24"
      canonicalPath={CANONICAL_ROUTES.departments.academicCouncil}
      showRelatedNav={false}
    >
      <AcademicCouncil />
    </DepartmentPage>
  );
}
