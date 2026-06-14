"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import { AdminPageHeader, AdminCard, AdminLoading, AdminEmpty } from "@/components/admin/cms/AdminUi";
import { OpsStatusBadge } from "@/components/admin/ops/OpsUi";

type Log = {
  id: string;
  phone: string;
  template: string;
  status: string;
  sentAt: string | null;
  errorMessage: string | null;
  registration: { registrationId: string; fullName: string } | null;
};

export default function WhatsAppLogsPage() {
  const [items, setItems] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ items: Log[] }>("whatsapp-logs");
      setItems(data.items ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return (
    <div>
      <AdminPageHeader
        title="WhatsApp Logs"
        description="Delivery tracking for registration, payment, accommodation, and campaign messages."
      />
      <AdminCard className="mb-4 text-sm text-slate-600">
        Configure <code className="rounded bg-slate-100 px-1">WHATSAPP_API_URL</code>,{" "}
        <code className="rounded bg-slate-100 px-1">WHATSAPP_API_TOKEN</code>, and optionally{" "}
        <code className="rounded bg-slate-100 px-1">WHATSAPP_PHONE_NUMBER_ID</code> for Meta Cloud API.
      </AdminCard>
      {loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="No WhatsApp messages yet." /> : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase">
              <tr>
                <th className="px-3 py-3 text-left">Phone</th>
                <th className="px-3 py-3">Template</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Recipient</th>
                <th className="px-3 py-3">Sent</th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id} className="border-b">
                  <td className="px-3 py-2 font-mono text-xs">{l.phone}</td>
                  <td className="px-3 py-2">{l.template}</td>
                  <td className="px-3 py-2"><OpsStatusBadge value={l.status} /></td>
                  <td className="px-3 py-2">{l.registration?.fullName ?? "—"}</td>
                  <td className="px-3 py-2">{l.sentAt ? new Date(l.sentAt).toLocaleString("en-IN") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </div>
  );
}
