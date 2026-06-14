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

type Session = {
  id: string;
  title: string;
  sessionType: string;
  venue: string | null;
  capacity: number;
  startAt: string;
  endAt: string;
  speakerName: string | null;
  qrToken: string | null;
  _count: { attendances: number };
};

export default function SessionsPage() {
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    sessionType: "conclave",
    venue: "",
    capacity: "100",
    startAt: "",
    endAt: "",
    speakerName: "",
  });
  const [attendanceRegId, setAttendanceRegId] = useState("");
  const [attendanceSession, setAttendanceSession] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await adminCmsFetch<Session[]>("sessions?all=1"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const create = async () => {
    try {
      await adminCmsFetch("sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
      });
      toast.success("Session created");
      setShowForm(false);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const markAttendance = async () => {
    try {
      await adminCmsFetch("sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "attendance",
          registrationId: attendanceRegId,
          sessionId: attendanceSession,
        }),
      });
      toast.success("Attendance recorded");
      setAttendanceRegId("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Session Management"
        description="Conclaves, workshops, presentations — capacity and QR attendance."
        actions={<AdminButton onClick={() => setShowForm(!showForm)}>New Session</AdminButton>}
      />
      {showForm && (
        <AdminCard className="mb-4">
          <div className="grid gap-3 md:grid-cols-2">
            <AdminInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <AdminSelect
              label="Type"
              options={[
                { value: "conclave", label: "Conclave" },
                { value: "workshop", label: "Workshop" },
                { value: "paper_presentation", label: "Paper Presentation" },
                { value: "cultural", label: "Cultural" },
              ]}
              value={form.sessionType}
              onChange={(e) => setForm({ ...form, sessionType: e.target.value })}
            />
            <AdminInput label="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
            <AdminInput label="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            <AdminInput label="Start" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
            <AdminInput label="End" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
            <AdminInput label="Speaker" value={form.speakerName} onChange={(e) => setForm({ ...form, speakerName: e.target.value })} />
            <AdminButton onClick={() => void create()}>Create</AdminButton>
          </div>
        </AdminCard>
      )}
      <AdminCard className="mb-4">
        <h2 className="mb-2 font-bold text-sm">Mark Session Attendance</h2>
        <div className="flex flex-wrap gap-2">
          <AdminInput placeholder="Registration ID" value={attendanceRegId} onChange={(e) => setAttendanceRegId(e.target.value)} />
          <AdminSelect
            label=""
            options={[{ value: "", label: "Select session" }, ...items.map((s) => ({ value: s.id, label: s.title }))]}
            value={attendanceSession}
            onChange={(e) => setAttendanceSession(e.target.value)}
          />
          <AdminButton onClick={() => void markAttendance()}>Record</AdminButton>
        </div>
      </AdminCard>
      {loading ? <AdminLoading /> : items.length === 0 ? <AdminEmpty message="No sessions." /> : (
        <div className="space-y-3">
          {items.map((s) => (
            <AdminCard key={s.id} className="!p-4">
              <p className="font-bold text-brand-navy">{s.title}</p>
              <p className="text-sm">{s.sessionType.replace(/_/g, " ")} · {s.venue ?? "TBD"}</p>
              <p className="text-sm">{new Date(s.startAt).toLocaleString("en-IN")} — {new Date(s.endAt).toLocaleTimeString("en-IN")}</p>
              <p className="text-sm">Attendance: {s._count.attendances}/{s.capacity} {s.speakerName ? `· ${s.speakerName}` : ""}</p>
              {s.qrToken && <p className="mt-1 font-mono text-xs text-slate-500">QR: {s.qrToken.slice(0, 16)}…</p>}
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
