"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminButton,
  AdminLoading,
  AdminEmpty,
  AdminPagination,
} from "@/components/admin/cms/AdminUi";
import { OpsStatusBadge, formatInr, formatDateTime } from "@/components/admin/ops/OpsUi";

type DonationRow = {
  donationId: string;
  donationKind: string;
  fullName: string;
  email: string;
  phone: string;
  amount: number;
  receiptSentAt: string | null;
  createdAt: string;
  receiptDownloadUrl: string;
};

export default function AdminDonationsPage() {
  const [items, setItems] = useState<DonationRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (search.trim()) params.set("search", search.trim());
      const data = await adminCmsFetch<{ items: DonationRow[]; total: number }>(
        `donations?${params}`
      );
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load donations");
    } finally {
      setLoading(false);
    }
  }, [offset, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const resendReceipt = async (donationId: string) => {
    try {
      await adminCmsFetch(`donations/${encodeURIComponent(donationId)}/resend-receipt`, {
        method: "POST",
      });
      toast.success("Receipt email sent");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Resend failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Donations"
        description="80G donations and sponsorship payments — search, download receipts, resend email."
      />

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-3">
          <AdminInput
            label="Search ID / name / email / PAN"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-end gap-2 md:col-span-2">
            <AdminButton
              onClick={() => {
                setOffset(0);
                void load();
              }}
            >
              Apply
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No donations found." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-3">Donation ID</th>
                <th className="px-3 py-3">Donor</th>
                <th className="px-3 py-3">Kind</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Receipt email</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((row) => (
                <tr key={row.donationId} className="hover:bg-slate-50/80">
                  <td className="px-3 py-3 font-mono text-xs">{row.donationId}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-900">{row.fullName}</div>
                    <div className="text-xs text-slate-500">{row.email}</div>
                    <div className="text-xs text-slate-500">{row.phone}</div>
                  </td>
                  <td className="px-3 py-3">{row.donationKind}</td>
                  <td className="px-3 py-3 font-semibold">{formatInr(row.amount)}</td>
                  <td className="px-3 py-3">
                    <OpsStatusBadge
                      value={row.receiptSentAt ? "sent" : "pending"}
                      type="email"
                    />
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {formatDateTime(row.createdAt)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={row.receiptDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand-blue hover:underline"
                      >
                        PDF
                      </a>
                      <button
                        type="button"
                        onClick={() => void resendReceipt(row.donationId)}
                        className="text-xs font-semibold text-brand-navy hover:underline"
                      >
                        Resend email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}

      {!loading && total > limit && (
        <AdminPagination offset={offset} limit={limit} total={total} onPage={setOffset} />
      )}
    </div>
  );
}
