import { AdminProvider } from "@/lib/adminAuth";
import CheckInClient from "./CheckInClient";

export default function EventCheckInPage() {
  return (
    <AdminProvider>
      <CheckInClient />
    </AdminProvider>
  );
}
