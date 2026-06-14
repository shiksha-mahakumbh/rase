"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminLoading,
  AdminEmpty,
} from "@/components/admin/cms/AdminUi";

type Volunteer = {
  registrationId: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  shiftStart: string | null;
  supervisorName: string | null;
  attendedAt: string | null;
};

export default function VolunteersPage() {
  const [items, setItems] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [dept, setDept] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [roster, setRoster] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ items: Volunteer[] }>("volunteers?limit=100");
      setItems(data.items ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const assign = async (registrationId: string) => {
    if (!dept.trim()) { toast.error("Department required"); return; }
    try {
      await adminCmsFetch("volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, department: dept, supervisorName: supervisor }),
      });
      toast.success("Assigned");
      setAssigning(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const loadRoster = async () => {
    try {
      const data = await adminCmsFetch<{ roster: string }>("volunteers?roster=1");
      setRoster(data.roster);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Volunteer Management"
        description="Assignments, departments, shifts, and duty rosters."
        actions={<AdminButton variant="secondary" onClick={() => void loadRoster()}>Generate Roster</AdminButton>}
      />
      {roster && (
        <AdminCard className="mb-4">
          <pre className="whitespace-pre-wrap text-xs">{roster}</pre>
        </AdminCard>
      )}
      {loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="No volunteers." /> : (
        <div className="space-y-3">
          {items.map((v) => (
            <AdminCard key={v.registrationId} className="!p-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-bold">{v.registrationId}</p>
                  <p className="font-semibold">{v.name}</p>
                  <p className="text-sm text-slate-600">{v.role} · {v.email}</p>
                  {v.department && <p className="text-sm">Dept: {v.department} · Supervisor: {v.supervisorName ?? "—"}</p>}
                  {v.attendedAt && <p className="text-xs text-emerald-700">Attended {new Date(v.attendedAt).toLocaleString("en-IN")}</p>}
                </div>
                <AdminButton size="sm" onClick={() => setAssigning(v.registrationId)}>Assign</AdminButton>
              </div>
              {assigning === v.registrationId && (
                <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                  <AdminInput label="Department" value={dept} onChange={(e) => setDept(e.target.value)} />
                  <AdminInput label="Supervisor" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} />
                  <AdminButton onClick={() => void assign(v.registrationId)}>Save</AdminButton>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
