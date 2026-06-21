"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAdmin } from "@/lib/adminAuth";
import { adminCmsFetch } from "@/lib/admin-cms-api";

type AttendeeLookup = {
  registrationId: string;
  name: string;
  category: string;
  institution: string;
  paymentStatus: string;
  checkInStatus: string;
  isFirstCheckIn: boolean;
  kitDistributed: boolean;
  certificateEligible: boolean;
  sessions: Array<{ name: string; attendedAt: string }>;
};

export default function CheckInClient() {
  const { user, loading, login, logout, isAdmin } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scanInput, setScanInput] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [attendee, setAttendee] = useState<AttendeeLookup | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const lookup = async (raw?: string) => {
    const id = (raw ?? scanInput).trim();
    if (!id) return;
    setBusy(true);
    setBanner(null);
    try {
      const data = await adminCmsFetch<AttendeeLookup>(`checkin?id=${encodeURIComponent(id)}`);
      setAttendee(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Not found");
      setAttendee(null);
    } finally {
      setBusy(false);
    }
  };

  const act = async (action: "check_in" | "kit" | "certificate_eligible" | "session") => {
    if (!attendee) return;
    setBusy(true);
    try {
      const res = await adminCmsFetch<{ message?: string; duplicate?: boolean; attendee?: AttendeeLookup }>(
        "checkin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId: attendee.registrationId,
            action,
            sessionName: action === "session" ? sessionName : undefined,
            location: "Main Gate",
          }),
        }
      );
      if (res.message) setBanner(res.message);
      setAttendee(res.attendee ?? attendee);
      toast.success(action.replace(/_/g, " "));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">Loading…</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-navy p-4">
        <form
          className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-6 shadow-xl"
          onSubmit={(e) => {
            e.preventDefault();
            void login(email, password).catch(() => toast.error("Login failed"));
          }}
        >
          <h1 className="text-xl font-bold text-brand-navy">Event Check-In</h1>
          <p className="text-sm text-slate-600">Admin login required</p>
          <input className="w-full rounded-lg border px-3 py-3 text-base" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-lg border px-3 py-3 text-base" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full min-h-[48px] rounded-xl bg-brand-saffron font-bold text-brand-navy">Sign in</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-8">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-brand-navy px-4 py-3 text-white">
        <div>
          <p className="text-xs opacity-80">Shiksha Mahakumbh</p>
          <h1 className="text-lg font-bold">Event Check-In</h1>
        </div>
        <button type="button" className="text-sm underline" onClick={() => void logout()}>Logout</button>
      </header>

      <div className="mx-auto max-w-lg space-y-4 p-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700">Enter Registration ID</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-4 text-lg font-mono"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void lookup()}
            placeholder="SMK2026-000001"
            autoFocus
          />
          <button
            type="button"
            disabled={busy}
            className="mt-3 w-full min-h-[52px] rounded-xl bg-brand-navy text-lg font-bold text-white disabled:opacity-60"
            onClick={() => void lookup()}
          >
            Look up
          </button>
        </div>

        {banner && (
          <div className={`rounded-2xl px-4 py-6 text-center text-xl font-extrabold ${banner.includes("ALREADY") ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}>
            {banner}
          </div>
        )}

        {attendee && (
          <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
            <div>
              <p className="font-mono text-sm text-slate-500">{attendee.registrationId}</p>
              <h2 className="text-2xl font-bold text-brand-navy">{attendee.name}</h2>
              <p className="text-slate-600">{attendee.category} · {attendee.institution}</p>
              <p className="mt-1 text-sm">Payment: <strong>{attendee.paymentStatus}</strong> · Check-in: <strong>{attendee.checkInStatus}</strong></p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" disabled={busy} className="min-h-[52px] rounded-xl bg-emerald-600 font-bold text-white" onClick={() => void act("check_in")}>Mark Check-In</button>
              <button type="button" disabled={busy || attendee.kitDistributed} className="min-h-[52px] rounded-xl bg-brand-saffron font-bold text-brand-navy hover:bg-brand-saffron-dark hover:text-white disabled:opacity-50" onClick={() => void act("kit")}>Kit Distributed</button>
              <button type="button" disabled={busy || attendee.certificateEligible} className="min-h-[52px] rounded-xl bg-violet-600 font-bold text-white disabled:opacity-50" onClick={() => void act("certificate_eligible")}>Certificate Eligible</button>
            </div>

            <div className="flex gap-2">
              <input className="flex-1 rounded-lg border px-3 py-3" placeholder="Session name" value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
              <button type="button" disabled={busy || !sessionName.trim()} className="rounded-xl bg-slate-800 px-4 font-bold text-white disabled:opacity-50" onClick={() => void act("session")}>Session</button>
            </div>

            {attendee.sessions.length > 0 && (
              <div className="text-sm text-slate-600">
                <p className="font-semibold">Sessions attended:</p>
                <ul className="mt-1 list-disc pl-5">{attendee.sessions.map((s) => <li key={s.name}>{s.name}</li>)}</ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
