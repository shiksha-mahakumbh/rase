import { Suspense } from "react";
import CheckInClient from "@/app/event/checkin/CheckInClient";

export default function AdminCheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-slate-500">Loading check-in gate…</div>
      }
    >
      <CheckInClient />
    </Suspense>
  );
}
