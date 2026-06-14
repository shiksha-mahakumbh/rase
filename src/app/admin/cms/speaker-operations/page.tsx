"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminLoading,
  AdminEmpty,
} from "@/components/admin/cms/AdminUi";
import { OpsStatusBadge } from "@/components/admin/ops/OpsUi";

type Speaker = {
  id: string;
  registrationId: string | null;
  name: string;
  sessionTitle: string | null;
  travelStatus: string | null;
  accommodationStatus: string | null;
  honorariumStatus: string;
  honorariumAmount: number | null;
};

export default function SpeakerOperationsPage() {
  const [items, setItems] = useState<Speaker[]>([]);
  const [schedule, setSchedule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    registrationId: "",
    travelStatus: "",
    accommodationStatus: "",
    honorariumStatus: "pending",
    honorariumAmount: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ items: Speaker[] }>("speaker-operations");
      setItems(data.items ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    try {
      await adminCmsFetch("speaker-operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          honorariumAmount: form.honorariumAmount ? Number(form.honorariumAmount) : undefined,
        }),
      });
      toast.success("Saved");
      setForm({ registrationId: "", travelStatus: "", accommodationStatus: "", honorariumStatus: "pending", honorariumAmount: "" });
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const loadSchedule = async () => {
    try {
      const data = await adminCmsFetch<{ schedule: string }>("speaker-operations?schedule=1");
      setSchedule(data.schedule);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Speaker Operations"
        description="Travel, accommodation, honorarium, and speaker schedules."
        actions={<AdminButton variant="secondary" onClick={() => void loadSchedule()}>Generate Schedule</AdminButton>}
      />
      {schedule && <AdminCard className="mb-4"><pre className="whitespace-pre-wrap text-xs">{schedule}</pre></AdminCard>}
      <AdminCard className="mb-4">
        <h2 className="mb-2 font-bold text-sm">Add / Update Speaker Ops</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <AdminInput label="Registration ID" value={form.registrationId} onChange={(e) => setForm({ ...form, registrationId: e.target.value })} />
          <AdminInput label="Travel" value={form.travelStatus} onChange={(e) => setForm({ ...form, travelStatus: e.target.value })} />
          <AdminInput label="Accommodation" value={form.accommodationStatus} onChange={(e) => setForm({ ...form, accommodationStatus: e.target.value })} />
          <AdminSelect
            label="Honorarium"
            options={[
              { value: "not_applicable", label: "N/A" },
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "paid", label: "Paid" },
            ]}
            value={form.honorariumStatus}
            onChange={(e) => setForm({ ...form, honorariumStatus: e.target.value })}
          />
          <AdminInput label="Amount (₹)" value={form.honorariumAmount} onChange={(e) => setForm({ ...form, honorariumAmount: e.target.value })} />
          <AdminButton onClick={() => void save()}>Save</AdminButton>
        </div>
      </AdminCard>
      {loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="No speaker operations records." /> : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase">
              <tr>
                <th className="px-3 py-3 text-left">Name</th>
                <th className="px-3 py-3">Session</th>
                <th className="px-3 py-3">Travel</th>
                <th className="px-3 py-3">Honorarium</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="px-3 py-2">{s.name}<br /><span className="font-mono text-xs">{s.registrationId}</span></td>
                  <td className="px-3 py-2">{s.sessionTitle ?? "—"}</td>
                  <td className="px-3 py-2">{s.travelStatus ?? "—"}</td>
                  <td className="px-3 py-2"><OpsStatusBadge value={s.honorariumStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </div>
  );
}
