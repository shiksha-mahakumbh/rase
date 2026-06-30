"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminLoading,
  AdminPagination,
  AdminInput,
  AdminButton,
} from "@/components/admin/cms/AdminUi";
import { formatRegistrationDate } from "@/lib/format-date";

type AuditLog = {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
  actorUserId: string | null;
};

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [actionFilter, setActionFilter] = useState("");
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });
      if (actionFilter.trim()) params.set("action", actionFilter.trim());
      const data = await adminCmsFetch<{ items: AuditLog[]; total: number }>(
        `audit-logs?${params.toString()}`
      );
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [offset, actionFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <AdminPageHeader
        title="Audit Logs"
        description="Recent CMS and system actions recorded by the v2 admin API."
      />
      <AdminCard className="mb-4">
        <div className="flex flex-wrap items-end gap-3">
          <AdminInput
            label="Filter by action"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            placeholder="e.g. notice_published"
            className="min-w-[220px]"
          />
          <AdminButton
            variant="secondary"
            onClick={() => {
              setOffset(0);
              void load();
            }}
          >
            Apply filter
          </AdminButton>
        </div>
      </AdminCard>
      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminCard>
          <p className="text-sm text-slate-500">No audit log entries found.</p>
        </AdminCard>
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Entity ID</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap px-4 py-2 text-slate-600">
                    {formatRegistrationDate(log.createdAt)}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-2">{log.entityType ?? "—"}</td>
                  <td className="max-w-[200px] truncate px-4 py-2 font-mono text-xs">
                    {log.entityId ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 pb-4">
            <AdminPagination offset={offset} limit={limit} total={total} onPage={setOffset} />
          </div>
        </AdminCard>
      )}
    </div>
  );
}
