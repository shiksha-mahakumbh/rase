import SamparkVibhag from "@/app/component/Vibhag/SamparkVibhag";
import DepartmentPage from "@/components/departments/DepartmentPage";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function SamparkDepartmentPage() {
  return (
    <DepartmentPage slug="Sampark24" canonicalPath={CANONICAL_ROUTES.departments.sampark}>
      <SamparkVibhag />
    </DepartmentPage>
  );
}
