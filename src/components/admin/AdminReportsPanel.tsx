"use client";

import { useMemo } from "react";
import { RegistrationRow } from "@/lib/exportRegistrations";

interface AdminReportsPanelProps {
  rows: RegistrationRow[];
}

export default function AdminReportsPanel({ rows }: AdminReportsPanelProps) {
  const reports = useMemo(() => {
    const payment = { Paid: 0, Pending: 0, Failed: 0, Other: 0 };
    const accommodation = {
      Requested: 0,
      Confirmed: 0,
      Allocated: 0,
      Approved: 0,
      Other: 0,
    };
    const email = { sent: 0, failed: 0, skipped: 0, pending: 0, none: 0 };
    let volunteer = 0;
    let revenue = 0;

    for (const r of rows) {
      const ps = r.paymentStatus ?? "Other";
      if (ps in payment) payment[ps as keyof typeof payment]++;
      else payment.Other++;

      const ac = r.accommodationStatus ?? "Other";
      if (ac in accommodation) accommodation[ac as keyof typeof accommodation]++;
      else if (r.accommodationRequired === "Yes") accommodation.Requested++;
      else accommodation.Other++;

      const es = (r.emailDeliveryStatus as string) ?? "none";
      if (es in email) email[es as keyof typeof email]++;
      else email.none++;

      const type = String(r.registrationType ?? "");
      if (/volunteer/i.test(type) || /volunteer/i.test(String(r.category ?? ""))) {
        volunteer++;
      }

      const amt = Number(r.paymentAmount ?? r.amount ?? 0);
      if (r.paymentStatus === "Paid" && !Number.isNaN(amt)) revenue += amt;
    }

    return { payment, accommodation, email, volunteer, revenue };
  }, [rows]);

  return (
    <section className="space-y-4" aria-label="Admin reports">
      <h2 className="text-lg font-bold text-primary">Reports</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReportCard title="Payments">
          <ReportRow label="Paid" value={reports.payment.Paid} />
          <ReportRow label="Pending" value={reports.payment.Pending} />
          <ReportRow label="Failed" value={reports.payment.Failed} />
          {reports.revenue > 0 && (
            <p className="mt-2 text-xs text-gray-600">
              Revenue (loaded): ₹{reports.revenue.toLocaleString("en-IN")}
            </p>
          )}
        </ReportCard>

        <ReportCard title="Accommodation">
          <ReportRow label="Requested" value={reports.accommodation.Requested} />
          <ReportRow label="Confirmed" value={reports.accommodation.Confirmed} />
          <ReportRow label="Allocated" value={reports.accommodation.Allocated} />
          <ReportRow label="Approved" value={reports.accommodation.Approved} />
        </ReportCard>

        <ReportCard title="Email delivery">
          <ReportRow label="Sent" value={reports.email.sent} />
          <ReportRow label="Failed" value={reports.email.failed} />
          <ReportRow label="Skipped" value={reports.email.skipped} />
          <ReportRow label="Pending" value={reports.email.pending} />
          <ReportRow label="Not logged" value={reports.email.none} />
        </ReportCard>

        <ReportCard title="Volunteers">
          <p className="text-3xl font-bold text-primary">{reports.volunteer}</p>
          <p className="text-xs text-gray-500">
            Rows matching volunteer type/category in loaded data
          </p>
        </ReportCard>
      </div>
    </section>
  );
}

function ReportCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h3>
      <div className="mt-3 space-y-1">{children}</div>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
