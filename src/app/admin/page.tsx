import AdminShell from "@/components/admin/cms/AdminShell";
import RegistrationDashboard from "@/components/admin/RegistrationDashboard";

export default function AdminPage() {
  return (
    <AdminShell>
      <RegistrationDashboard />
    </AdminShell>
  );
}
