import AcademicCouncil from "@/app/component/Vibhag/AcademicCouncil24";
import DepartmentPage from "@/components/departments/DepartmentPage";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function AcademicCouncilDepartmentPage() {
  return (
    <DepartmentPage
      slug="AcademicCouncil24"
      canonicalPath={CANONICAL_ROUTES.departments.academicCouncil}
      showRelatedNav={false}
    >
      <AcademicCouncil />
    </DepartmentPage>
  );
}
