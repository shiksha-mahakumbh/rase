import CheckInClient from "@/app/event/checkin/CheckInClient";
import { AdminCard, AdminPageHeader } from "@/components/admin/cms/AdminUi";

export default function AdminCheckInPage() {
  return (
    <div>
      <AdminPageHeader
        title="Event Check-In"
        description="QR gate for on-site attendee check-in. Same tool as /event/checkin — use this route from the CMS sidebar."
      />
      <AdminCard className="mb-4 border-blue-200 bg-blue-50 text-sm text-blue-900">
        This page embeds the live check-in scanner. For a standalone mobile view, open{" "}
        <a href="/event/checkin" className="font-semibold underline">
          /event/checkin
        </a>
        . Accommodation check-in is managed separately under Accommodation.
      </AdminCard>
      <CheckInClient />
    </div>
  );
}
