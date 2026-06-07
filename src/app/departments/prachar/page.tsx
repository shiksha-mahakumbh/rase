import PracharVibhag from "@/app/component/Vibhag/PracharVibhag";
import DepartmentPage from "@/components/departments/DepartmentPage";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function PracharDepartmentPage() {
  return (
    <DepartmentPage slug="Prachar24" canonicalPath={CANONICAL_ROUTES.departments.prachar}>
      <PracharVibhag />
    </DepartmentPage>
  );
}
