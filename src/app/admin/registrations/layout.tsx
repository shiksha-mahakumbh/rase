import AdminRegistrationsShell from "@/components/admin/cms/AdminRegistrationsShell";

export default function RegistrationsLayout({ children }: { children: React.ReactNode }) {
  return <AdminRegistrationsShell>{children}</AdminRegistrationsShell>;
}
