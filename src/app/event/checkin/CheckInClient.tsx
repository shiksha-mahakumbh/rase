"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAdmin, canPerformCheckIn } from "@/lib/adminAuth";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import CheckInQrScanner from "@/components/admin/checkin/CheckInQrScanner";

type AttendeeLookup = {
  registrationId: string;
  name: string;
  category: string;
  institution: string;
  registrationStatus: string;
  paymentStatus: string;
  checkInStatus: string;
  kitDistributed: boolean;
  certificateEligible: boolean;
  isFirstCheckIn: boolean;
  contactHint: string;
  warnings: string[];
  blockReason: string | null;
  canCheckIn: boolean;
  canReceiveKit: boolean;
  canMarkCertificate: boolean;
  sessions: Array<{ name: string; attendedAt: string }>;
};

type RecentCheckIn = {
  registrationId: string;
  name: string;
  location: string | null;
  checkedInAt: string;
};

type EventSession = { id: string; title: string };

const CHECKIN_LOCATIONS = ["Main Gate", "Registration Desk", "Conclave Hall", "Exhibition"] as const;

const RECENT_LOCAL_KEY = "smk_checkin_recent";

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // optional feedback
  }
}

function pushLocalRecent(entry: RecentCheckIn) {
  try {
    const raw = sessionStorage.getItem(RECENT_LOCAL_KEY);
    const list: RecentCheckIn[] = raw ? (JSON.parse(raw) as RecentCheckIn[]) : [];
    const next = [entry, ...list.filter((r) => r.registrationId !== entry.registrationId)].slice(0, 8);
    sessionStorage.setItem(RECENT_LOCAL_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

export default function CheckInClient({ standalone = false }: { standalone?: boolean }) {
  const searchParams = useSearchParams();
  const { role, permissions } = useAdmin();
  const canPerformActions = canPerformCheckIn(role, permissions);

  const [scanInput, setScanInput] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [eventSessions, setEventSessions] = useState<EventSession[]>([]);
  const [location, setLocation] = useState<(typeof CHECKIN_LOCATIONS)[number]>("Main Gate");
  const [attendee, setAttendee] = useState<AttendeeLookup | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [scannerOn, setScannerOn] = useState(false);
  const [recent, setRecent] = useState<RecentCheckIn[]>([]);
  const lastScanRef = useRef("");
  const scanCooldownRef = useRef(0);

  const loadRecent = useCallback(async () => {
    try {
      const data = await adminCmsFetch<{ items: RecentCheckIn[] }>("checkin?recent=1");
      setRecent(data.items ?? []);
    } catch {
      try {
        const raw = sessionStorage.getItem(RECENT_LOCAL_KEY);
        if (raw) setRecent(JSON.parse(raw) as RecentCheckIn[]);
      } catch {
        setRecent([]);
      }
    }
  }, []);

  useEffect(() => {
    void loadRecent();
    void (async () => {
      try {
        const data = await adminCmsFetch<{ items?: EventSession[] } | EventSession[]>("sessions");
        const items = Array.isArray(data) ? data : (data.items ?? []);
        setEventSessions(items.map((s) => ({ id: s.id, title: s.title })));
      } catch {
        setEventSessions([]);
      }
    })();
  }, [loadRecent]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setScanInput(id);
      void lookup(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const lookup = async (raw?: string) => {
    const id = (raw ?? scanInput).trim();
    if (!id) return;
    setBusy(true);
    setBanner(null);
    try {
      const data = await adminCmsFetch<AttendeeLookup>(`checkin?id=${encodeURIComponent(id)}`);
      setAttendee(data);
      setScanInput(data.registrationId);
      playBeep();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Not found");
      setAttendee(null);
    } finally {
      setBusy(false);
    }
  };

  const act = async (action: "check_in" | "kit" | "certificate_eligible" | "session") => {
    if (!attendee || !canPerformActions) return;
    setBusy(true);
    try {
      const res = await adminCmsFetch<{
        message?: string;
        duplicate?: boolean;
        attendee?: AttendeeLookup;
      }>("checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: attendee.registrationId,
          action,
          sessionName: action === "session" ? sessionName : undefined,
          location,
        }),
      });
      if (res.message) setBanner(res.message);
      if (res.attendee) setAttendee(res.attendee);
      playBeep();
      toast.success(res.message ?? action.replace(/_/g, " "));

      if (action === "check_in" && !res.duplicate && res.attendee) {
        const entry: RecentCheckIn = {
          registrationId: res.attendee.registrationId,
          name: res.attendee.name,
          location,
          checkedInAt: new Date().toISOString(),
        };
        setRecent(pushLocalRecent(entry));
        void loadRecent();
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const onQrScan = (text: string) => {
    const now = Date.now();
    if (text === lastScanRef.current && now - scanCooldownRef.current < 2000) return;
    lastScanRef.current = text;
    scanCooldownRef.current = now;
    setScanInput(text);
    void lookup(text);
  };

  return (
    <div>
      {!standalone && (
        <p className="mb-4 text-sm text-slate-600">
          Scan QR or enter ID at the gate.{" "}
          <Link href="/event/checkin" className="font-semibold text-brand-navy underline">
            Open mobile gate view →
          </Link>
        </p>
      )}

      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-slate-700">Camera scanner</label>
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold"
              onClick={() => setScannerOn((v) => !v)}
            >
              {scannerOn ? "Stop camera" : "Start camera"}
            </button>
          </div>
          <CheckInQrScanner active={scannerOn} onScan={onQrScan} />

          <label className="mt-4 block text-sm font-semibold text-slate-700">Check-in location</label>
          <select
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value as (typeof CHECKIN_LOCATIONS)[number])}
          >
            {CHECKIN_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-semibold text-slate-700">Registration ID</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-4 text-lg font-mono"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void lookup()}
            placeholder="SMK2026-000001 or scan QR"
            autoFocus={!scannerOn}
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
          <div
            className={`rounded-2xl px-4 py-6 text-center text-xl font-extrabold ${
              banner.includes("ALREADY") || banner.includes("KIT ALREADY")
                ? "bg-amber-100 text-amber-900"
                : "bg-emerald-100 text-emerald-900"
            }`}
          >
            {banner}
          </div>
        )}

        {attendee && (
          <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
            <div>
              <p className="font-mono text-sm text-slate-500">{attendee.registrationId}</p>
              <h2 className="text-2xl font-bold text-brand-navy">{attendee.name}</h2>
              <p className="text-slate-600">
                {attendee.category} · {attendee.institution}
              </p>
              <p className="mt-1 text-sm">
                Status: <strong>{attendee.registrationStatus}</strong> · Payment:{" "}
                <strong>{attendee.paymentStatus}</strong> · Check-in:{" "}
                <strong>{attendee.checkInStatus}</strong>
              </p>
              <p className="text-xs text-slate-500">Contact hint: {attendee.contactHint}</p>
            </div>

            {attendee.blockReason && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-900">
                {attendee.blockReason}
              </p>
            )}

            {attendee.warnings.length > 0 && !attendee.blockReason && (
              <ul className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {attendee.warnings.map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            )}

            {!canPerformActions ? (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Lookup only — your account cannot mark check-in. Contact an Admin or Super Admin for
                gate actions.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={busy || !attendee.canCheckIn}
                    className="min-h-[52px] rounded-xl bg-emerald-600 font-bold text-white disabled:opacity-50"
                    onClick={() => void act("check_in")}
                  >
                    Mark Check-In
                  </button>
                  <button
                    type="button"
                    disabled={busy || !attendee.canReceiveKit}
                    className="min-h-[52px] rounded-xl bg-brand-saffron font-bold text-brand-navy hover:bg-brand-saffron-dark hover:text-white disabled:opacity-50"
                    onClick={() => void act("kit")}
                  >
                    Kit Distributed
                  </button>
                  <button
                    type="button"
                    disabled={busy || !attendee.canMarkCertificate}
                    className="col-span-2 min-h-[52px] rounded-xl bg-violet-600 font-bold text-white disabled:opacity-50"
                    onClick={() => void act("certificate_eligible")}
                  >
                    Certificate Eligible
                  </button>
                </div>

                <div className="flex gap-2">
                  {eventSessions.length > 0 ? (
                    <select
                      className="flex-1 rounded-lg border px-3 py-3 text-sm"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                    >
                      <option value="">Select session</option>
                      {eventSessions.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="flex-1 rounded-lg border px-3 py-3"
                      placeholder="Session name"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                    />
                  )}
                  <button
                    type="button"
                    disabled={busy || !sessionName.trim() || Boolean(attendee.blockReason)}
                    className="rounded-xl bg-slate-800 px-4 font-bold text-white disabled:opacity-50"
                    onClick={() => void act("session")}
                  >
                    Session
                  </button>
                </div>
              </>
            )}

            {attendee.sessions.length > 0 && (
              <div className="text-sm text-slate-600">
                <p className="font-semibold">Sessions attended:</p>
                <ul className="mt-1 list-disc pl-5">
                  {attendee.sessions.map((s) => (
                    <li key={`${s.name}-${s.attendedAt}`}>
                      {s.name}{" "}
                      <span className="text-xs text-slate-400">
                        {new Date(s.attendedAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {recent.length > 0 && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-bold text-brand-navy">Recent check-ins</h3>
            <ul className="divide-y text-sm">
              {recent.map((r) => (
                <li key={`${r.registrationId}-${r.checkedInAt}`} className="flex justify-between py-2">
                  <button
                    type="button"
                    className="text-left font-mono text-brand-navy hover:underline"
                    onClick={() => {
                      setScanInput(r.registrationId);
                      void lookup(r.registrationId);
                    }}
                  >
                    {r.registrationId}
                  </button>
                  <span className="truncate pl-2 text-slate-500">{r.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
