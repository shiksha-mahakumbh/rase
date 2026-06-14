"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminSelect,
  AdminButton,
  AdminLoading,
  AdminEmpty,
  AdminPagination,
} from "@/components/admin/cms/AdminUi";
import { OpsStatusBadge, formatDateTime } from "@/components/admin/ops/OpsUi";

type WebhookRow = {
  id: string;
  eventName: string;
  razorpayEventId: string | null;
  status: string;
  timestamp: string;
  payloadSize: number;
  retryCount: number;
  errorMessage: string | null;
};

const STATUS_OPTS = [
  { value: "all", label: "All events" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

export default function WebhookLogsPage() {
  const [items, setItems] = useState<WebhookRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState("all");
  const [busy, setBusy] = useState<string | null>(null);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        status,
      });
      const data = await adminCmsFetch<{ items: WebhookRow[]; total: number }>(
        `webhooks?${params}`
      );
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load webhooks");
    } finally {
      setLoading(false);
    }
  }, [offset, status]);

  useEffect(() => {
    void load();
  }, [load]);

  const retry = async (id: string) => {
    setBusy(id);
    try {
      await adminCmsFetch(`webhooks/${id}/retry`, { method: "POST" });
      toast.success("Webhook reprocessed");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Retry failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Webhook Logs"
        description="Razorpay webhook events — monitor delivery and retry failed processing."
      />

      <AdminCard className="mb-4 max-w-xs">
        <AdminSelect
          label="Filter"
          options={STATUS_OPTS}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setOffset(0);
          }}
        />
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No webhook events recorded yet." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-3">Event</th>
                <th className="px-3 py-3">Razorpay Event ID</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Timestamp</th>
                <th className="px-3 py-3">Payload</th>
                <th className="px-3 py-3">Retries</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-2">{row.eventName}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.razorpayEventId ?? "—"}</td>
                  <td className="px-3 py-2">
                    <OpsStatusBadge value={row.status} />
                  </td>
                  <td className="px-3 py-2 text-xs">{formatDateTime(row.timestamp)}</td>
                  <td className="px-3 py-2 text-xs">{row.payloadSize} bytes</td>
                  <td className="px-3 py-2">{row.retryCount}</td>
                  <td className="px-3 py-2">
                    <AdminButton
                      size="sm"
                      variant="secondary"
                      disabled={busy === row.id}
                      onClick={() => void retry(row.id)}
                    >
                      Retry
                    </AdminButton>
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
