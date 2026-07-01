import AdminRegistrationsShell from "@/components/admin/cms/AdminRegistrationsShell";
import RegistrationDashboard from "@/components/admin/RegistrationDashboard";

export default function AdminPage() {
  return (
    <AdminRegistrationsShell>
      <RegistrationDashboard />
    </AdminRegistrationsShell>
  );
}
