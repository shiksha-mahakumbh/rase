"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

type Dashboard = {
  registrationId: string;
  fullName: string;
  category: string;
  institution: string;
  paymentStatus: string;
  checkInStatus: string;
  receiptAvailable: boolean;
  badgeAvailable: boolean;
  qrAvailable: boolean;
  accommodation: {
    status: string;
    building?: string;
    roomNumber?: string;
    bedNumber?: string;
  } | null;
  certificate: { certificateNo: string; verifyUrl: string | null } | null;
  sessions: Array<{ name: string; attendedAt: string }>;
  profile: { contactNumber: string; whatsappNumber: string | null; address: string };
};

export default function ParticipantDashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
      <ParticipantDashboardInner />
    </Suspense>
  );
}

function ParticipantDashboardInner() {
  const searchParams = useSearchParams();
  const [registrationId, setRegistrationId] = useState("");
  const [email, setEmail] = useState("");
  const [lookupToken, setLookupToken] = useState("");
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [contact, setContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const id =
      searchParams.get("id") ??
      (typeof window !== "undefined" ? sessionStorage.getItem("smk_registration_id") : null);
    const mail =
      searchParams.get("email") ??
      (typeof window !== "undefined" ? sessionStorage.getItem("smk_registration_email") : null);
    const token =
      searchParams.get("token") ??
      (typeof window !== "undefined" ? sessionStorage.getItem("smk_lookup_token") : null);

    if (id) setRegistrationId(id);
    if (mail) setEmail(mail);
    if (token) setLookupToken(token);
  }, [searchParams]);

  const login = async () => {
    setLoading(true);
    try {
      let captchaToken: string | undefined;
      if (!lookupToken.trim()) {
        const { executeRecaptcha, isRecaptchaConfigured, waitForRecaptcha } =
          await import("@/lib/security/recaptcha-client");
        if (isRecaptchaConfigured()) {
          const ready = await waitForRecaptcha();
          if (!ready) throw new Error("Security check could not load. Refresh and try again.");
          captchaToken = (await executeRecaptcha("participant_dashboard")) ?? undefined;
          if (!captchaToken) throw new Error("Captcha verification failed");
        } else if (process.env.NODE_ENV === "production") {
          throw new Error("Confirmation link or security check required");
        } else {
          captchaToken = "dev-bypass";
        }
      }

      const res = await fetch("/api/participant/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: registrationId.trim(),
          email: email.trim(),
          lookupToken: lookupToken.trim() || undefined,
          captchaToken,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Login failed");
      if (json.lookupToken) {
        setLookupToken(json.lookupToken);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("smk_lookup_token", json.lookupToken);
        }
      }
      setData(json);
      setContact(json.profile.contactNumber);
      setWhatsapp(json.profile.whatsappNumber ?? "");
      setAddress(json.profile.address);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to load dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await fetch("/api/participant/dashboard", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: data?.registrationId,
          email,
          lookupToken: lookupToken.trim() || undefined,
          contactNumber: contact,
          whatsappNumber: whatsapp,
          address,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Profile updated");
      setEditing(false);
      await login();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  const downloadQuery = (type: string) => {
    const params = new URLSearchParams({
      type,
      registrationId: data!.registrationId,
      email: email.trim(),
      token: lookupToken.trim(),
    });
    return `/api/participant/download?${params.toString()}`;
  };

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-xl font-bold text-brand-navy">Participant Portal</h1>
          <p className="mt-1 text-sm text-slate-500">Shiksha Mahakumbh — view your registration</p>
          <div className="mt-6 space-y-3">
            <label className="block text-sm">
              Registration ID
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} placeholder="SMK2026-000001" />
            </label>
            <label className="block text-sm">
              Email used during registration
              <input className="mt-1 w-full rounded-lg border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <button
              className="w-full rounded-lg bg-brand-navy py-2.5 font-semibold text-white disabled:opacity-50"
              onClick={() => void login()}
              disabled={loading || !registrationId || !email}
            >
              {loading ? "Loading…" : "Access Dashboard"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-xl font-bold text-brand-navy">{data.fullName}</h1>
          <p className="font-mono text-sm text-slate-600">{data.registrationId}</p>
          <p className="text-sm">{data.category} · {data.institution}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-3 py-1">Payment: {data.paymentStatus}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Check-in: {data.checkInStatus}</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {data.receiptAvailable && lookupToken && (
            <a
              href={downloadQuery("receipt")}
              className="rounded-xl border bg-white p-4 text-center font-semibold text-brand-navy hover:bg-slate-50"
            >
              Download Receipt
            </a>
          )}
          {data.badgeAvailable && lookupToken && (
            <a
              href={downloadQuery("badge")}
              className="rounded-xl border bg-white p-4 text-center font-semibold text-brand-navy hover:bg-slate-50"
            >
              Download Badge
            </a>
          )}
          {data.certificate && lookupToken && (
            <>
              <a href={data.certificate.verifyUrl ?? "#"} className="rounded-xl border bg-white p-4 text-center font-semibold text-brand-navy hover:bg-slate-50" target="_blank" rel="noreferrer">
                Verify Certificate
              </a>
              <a
                href={downloadQuery("certificate")}
                className="rounded-xl border bg-white p-4 text-center font-semibold text-brand-navy hover:bg-slate-50"
              >
                Download Certificate
              </a>
            </>
          )}
        </div>

        {data.accommodation && (
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="font-bold">Accommodation</h2>
            <p className="text-sm mt-1">Status: {data.accommodation.status}</p>
            {data.accommodation.building && (
              <p className="text-sm">{data.accommodation.building} / {data.accommodation.roomNumber} {data.accommodation.bedNumber ? `#${data.accommodation.bedNumber}` : ""}</p>
            )}
          </div>
        )}

        {data.sessions.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="font-bold">Sessions Attended</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {data.sessions.map((s, i) => (
                <li key={i}>{s.name} — {new Date(s.attendedAt).toLocaleString("en-IN")}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Profile</h2>
            <button className="text-sm text-brand-navy underline" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</button>
          </div>
          {editing ? (
            <div className="mt-3 space-y-2">
              <input className="w-full rounded border px-3 py-2 text-sm" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Contact" />
              <input className="w-full rounded border px-3 py-2 text-sm" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp" />
              <textarea className="w-full rounded border px-3 py-2 text-sm" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
              <button className="rounded-lg bg-brand-navy px-4 py-2 text-sm text-white" onClick={() => void saveProfile()}>Save</button>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-600">{data.profile.contactNumber} · {data.profile.address}</p>
          )}
        </div>

        <button className="text-sm text-slate-500 underline" onClick={() => setData(null)}>Sign out</button>
      </div>
    </div>
  );
}
