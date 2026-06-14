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

type AttendeeRow = {
  registrationId: string;
  name: string;
  email: string;
  mobile: string;
  category: string;
  institution: string;
  state: string;
  paymentStatus: string;
  checkInStatus: string;
  accommodationStatus: string;
  certificateStatus: string;
  qrStatus: string;
  createdAt: string;
};

const CHECKIN_OPTS = [
  { value: "", label: "All check-in statuses" },
  { value: "Checked In", label: "Checked In" },
  { value: "Not Checked In", label: "Not Checked In" },
];

export default function AttendeesPage() {
  const [items, setItems] = useState<AttendeeRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [checkInStatus, setCheckInStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (search.trim()) params.set("search", search.trim());
      if (checkInStatus) params.set("checkInStatus", checkInStatus);
      if (paymentStatus) params.set("paymentStatus", paymentStatus);
      const data = await adminCmsFetch<{ items: AttendeeRow[]; total: number }>(
        `attendees?${params}`
      );
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load attendees");
    } finally {
      setLoading(false);
    }
  }, [offset, search, checkInStatus, paymentStatus]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulk = async (action: string) => {
    const registrationIds = selected.size ? Array.from(selected) : items.map((i) => i.registrationId);
    try {
      const res = await adminCmsFetch<unknown>("attendees/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, registrationIds }),
      });
      toast.success(`${action} completed`);
      console.info(res);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bulk action failed");
    }
  };

  const exportCsv = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (checkInStatus) params.set("checkInStatus", checkInStatus);
    window.open(`/api/admin/gateway/attendees/export?${params}`, "_blank");
  };

  return (
    <div>
      <AdminPageHeader
        title="Attendees"
        description="Unified attendee registry across all registration categories."
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton variant="secondary" onClick={exportCsv}>
              Export CSV
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => void bulk("generate-badges")}>
              Generate Badges
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => void bulk("generate-certificates")}>
              Generate Certificates
            </AdminButton>
            <AdminButton onClick={() => void bulk("send-email")}>Send Email</AdminButton>
          </div>
        }
      />

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-4">
          <AdminInput label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ID, name, email, mobile" />
          <AdminSelect label="Check-in" options={CHECKIN_OPTS} value={checkInStatus} onChange={(e) => setCheckInStatus(e.target.value)} />
          <AdminSelect label="Payment" options={[{ value: "", label: "All" }, { value: "Paid", label: "Paid" }, { value: "Pending Payment", label: "Pending" }]} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} />
          <div className="flex items-end"><AdminButton onClick={() => void load()}>Apply</AdminButton></div>
        </div>
      </AdminCard>

      {loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="No attendees found." /> : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-2 py-3" />
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">Name</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Institution</th>
                <th className="px-3 py-3">State</th>
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3">Check-in</th>
                <th className="px-3 py-3">Accommodation</th>
                <th className="px-3 py-3">Certificate</th>
                <th className="px-3 py-3">QR</th>
                <th className="px-3 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.registrationId} className="border-b border-slate-100">
                  <td className="px-2 py-2"><input type="checkbox" checked={selected.has(row.registrationId)} onChange={() => toggle(row.registrationId)} /></td>
                  <td className="px-3 py-2 font-mono text-xs">{row.registrationId}</td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2 text-xs"><div>{row.email}</div><div className="text-slate-500">{row.mobile}</div></td>
                  <td className="px-3 py-2">{row.category}</td>
                  <td className="px-3 py-2">{row.institution}</td>
                  <td className="px-3 py-2">{row.state}</td>
                  <td className="px-3 py-2"><OpsStatusBadge value={row.paymentStatus} type="payment" /></td>
                  <td className="px-3 py-2"><OpsStatusBadge value={row.checkInStatus} /></td>
                  <td className="px-3 py-2">{row.accommodationStatus}</td>
                  <td className="px-3 py-2">{row.certificateStatus}</td>
                  <td className="px-3 py-2"><OpsStatusBadge value={row.qrStatus} type="qr" /></td>
                  <td className="px-3 py-2 text-xs">{formatDateTime(row.createdAt)}</td>
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
