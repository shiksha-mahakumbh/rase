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
import { formatDateTime } from "@/components/admin/ops/OpsUi";

type AuditRow = {
  id: string;
  action: string;
  timestamp: string;
  registrationId: string;
  orderId: string;
  paymentId: string;
  userEmail: string;
};

export default function PaymentAuditPage() {
  const [items, setItems] = useState<AuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [registrationId, setRegistrationId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const limit = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (registrationId.trim()) params.set("registrationId", registrationId.trim());
      if (paymentId.trim()) params.set("paymentId", paymentId.trim());
      const data = await adminCmsFetch<{ items: AuditRow[]; total: number }>(
        `payment-audit?${params}`
      );
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load audit trail");
    } finally {
      setLoading(false);
    }
  }, [offset, registrationId, paymentId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <AdminPageHeader
        title="Payment Audit Trail"
        description="End-to-end trace: order created → payment verified → registration saved → receipt/QR/email."
      />

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-3">
          <AdminInput
            label="Registration ID"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
          />
          <AdminInput
            label="Payment ID"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
          />
          <div className="flex items-end">
            <AdminButton
              onClick={() => {
                setOffset(0);
                void load();
              }}
            >
              Filter
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No audit events found." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-3">Timestamp</th>
                <th className="px-3 py-3">Action</th>
                <th className="px-3 py-3">Registration ID</th>
                <th className="px-3 py-3">Order ID</th>
                <th className="px-3 py-3">Payment ID</th>
                <th className="px-3 py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {formatDateTime(row.timestamp)}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{row.action}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.registrationId}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.orderId}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.paymentId}</td>
                  <td className="px-3 py-2 text-xs">{row.userEmail}</td>
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
