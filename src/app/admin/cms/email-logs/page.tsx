"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminButton,
  AdminLoading,
  AdminEmpty,
  AdminPagination,
} from "@/components/admin/cms/AdminUi";
import { OpsStatusBadge, formatDateTime } from "@/components/admin/ops/OpsUi";

type EmailRow = {
  id: string;
  registrationId: string | null;
  email: string;
  template: string | null;
  subject: string;
  status: string;
  sentAt: string | null;
  errorMessage: string | null;
  retryCount: number;
  createdAt: string;
  applicantName: string | null;
};

const STATUS_OPTS = [
  { value: "", label: "All statuses" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "queued", label: "Pending / Queued" },
  { value: "skipped", label: "Skipped" },
];

export default function EmailLogsPage() {
  const [items, setItems] = useState<EmailRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (status) params.set("status", status);
      if (search.trim()) params.set("search", search.trim());
      const data = await adminCmsFetch<{ items: EmailRow[]; total: number }>(
        `email-logs?${params}`
      );
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load email logs");
    } finally {
      setLoading(false);
    }
  }, [offset, status, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const resend = async (id: string) => {
    try {
      await adminCmsFetch(`email-logs/${id}/resend`, { method: "POST" });
      toast.success("Email resent");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Resend failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Email Monitoring"
        description="Track confirmation emails — sent, failed, and pending delivery."
      />

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-3">
          <AdminInput
            label="Search email / subject / template"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AdminSelect
            label="Status"
            options={STATUS_OPTS}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setOffset(0);
            }}
          />
          <div className="flex items-end">
            <AdminButton onClick={() => void load()}>Apply</AdminButton>
          </div>
        </div>
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No email logs found." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-3">Registration</th>
                <th className="px-3 py-3">Recipient</th>
                <th className="px-3 py-3">Template</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Sent at</th>
                <th className="px-3 py-3">Error</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-mono text-xs">
                    {row.registrationId ?? "—"}
                    {row.applicantName && (
                      <div className="font-sans text-slate-500">{row.applicantName}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs">{row.email}</td>
                  <td className="px-3 py-2 text-xs">{row.template ?? "—"}</td>
                  <td className="px-3 py-2">
                    <OpsStatusBadge value={row.status} type="email" />
                  </td>
                  <td className="px-3 py-2 text-xs">{formatDateTime(row.sentAt ?? row.createdAt)}</td>
                  <td className="px-3 py-2 max-w-[200px] truncate text-xs text-red-600">
                    {row.errorMessage ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    {row.registrationId && (
                      <AdminButton size="sm" variant="secondary" onClick={() => void resend(row.id)}>
                        Resend
                      </AdminButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}

      <AdminPagination offset={offset} limit={limit} total={total} onPage={setOffset} />
    </div>
  );
}
