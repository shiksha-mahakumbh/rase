import PrabandhanVibhag from "@/app/component/Vibhag/PrabandhanVibhag";
import DepartmentPage from "@/components/departments/DepartmentPage";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function PrabandhanDepartmentPage() {
  return (
    <DepartmentPage
      slug="Prabandhan24"
      canonicalPath={CANONICAL_ROUTES.departments.prabandhan}
    >
      <PrabandhanVibhag />
    </DepartmentPage>
  );
}
