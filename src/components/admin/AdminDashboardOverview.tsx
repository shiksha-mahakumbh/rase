"use client";

import type { RegistrationAdminStats } from "@/types/admin-dashboard";

export type AdminDashboardStats = RegistrationAdminStats;

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

function NotificationCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">{title}</p>
      <p className="text-3xl font-bold text-primary">{value}</p>
      <p className="text-xs text-amber-800">{hint}</p>
    </div>
  );
}

export default function AdminDashboardOverview({
  stats,
}: {
  stats: AdminDashboardStats;
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <NotificationCard
          title="New Registrations"
          value={stats.today}
          hint="Submitted today"
        />
        <NotificationCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          hint="Registration status pending"
        />
        <NotificationCard
          title="Pending Accommodation"
          value={stats.pendingAccommodation}
          hint="Awaiting confirmation"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Delegate" value={stats.delegate} />
        <StatCard label="Conclave" value={stats.conclave} />
        <StatCard label="Olympiad" value={stats.olympiad} />
        <StatCard label="Awards" value={stats.awards} />
        <StatCard label="Best Practices" value={stats.bestPractices} />
        <StatCard label="Accommodation" value={stats.accommodation} />
        <StatCard label="Today" value={stats.today} />
        <StatCard label="Pending Payments" value={stats.pendingPayments} />
        <StatCard label="Free Submitted" value={stats.submittedFree} />
        <StatCard label="Completed Payments" value={stats.completedPayments} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Verified" value={stats.verified} />
      </div>

      {stats.revenue > 0 && (
        <p className="text-sm text-gray-600">
          Revenue (paid registrations): ₹
          {stats.revenue.toLocaleString("en-IN")}
        </p>
      )}
    </>
  );
}
