import VittVibhag from "@/app/component/Vibhag/VittVibhag";
import DepartmentPage from "@/components/departments/DepartmentPage";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function VittDepartmentPage() {
  return (
    <DepartmentPage slug="Vitt24" canonicalPath={CANONICAL_ROUTES.departments.vitt}>
      <VittVibhag />
    </DepartmentPage>
  );
}
