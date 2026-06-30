import type { Metadata } from "next";
import { Suspense } from "react";
import CheckInClient from "@/app/event/checkin/CheckInClient";
import { NO_INDEX_META } from "@/lib/seo/publicPages";

export const metadata: Metadata = {
  ...NO_INDEX_META.admin,
  title: "Event Check-In | Shiksha Mahakumbh",
  description: "Mobile QR check-in gate for venue staff.",
};

export default function EventCheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-sm text-slate-500">Loading check-in gate…</div>
      }
    >
      <CheckInClient standalone />
    </Suspense>
  );
}
