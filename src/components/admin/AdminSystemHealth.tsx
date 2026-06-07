"use client";

import { useEffect, useState } from "react";

type HealthState = "loading" | "ok" | "error";

export default function AdminSystemHealth() {
  const [apiHealth, setApiHealth] = useState<HealthState>("loading");
  const [healthDetail, setHealthDetail] = useState<string>("");
  const [sentryConfigured, setSentryConfigured] = useState(false);

  useEffect(() => {
    setSentryConfigured(Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN));
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "ok") {
          setApiHealth("ok");
          setHealthDetail(data.timestamp ?? "");
        } else {
          setApiHealth("error");
        }
      })
      .catch(() => setApiHealth("error"));
  }, []);

  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm" aria-label="System health">
      <h2 className="text-lg font-bold text-primary">System Health</h2>
      <ul className="mt-3 space-y-2 text-sm">
        <HealthRow label="API /api/health" status={apiHealth} detail={healthDetail} />
        <HealthRow
          label="Error reporting"
          status={sentryConfigured ? "ok" : "warn"}
          detail={sentryConfigured ? "Sentry DSN set" : "Client-error API only"}
        />
        <HealthRow label="Firestore rules" status="warn" detail="Verify deployed in Console" />
        <HealthRow label="reCAPTCHA" status="warn" detail="Verify production keys" />
      </ul>
    </section>
  );
}

function HealthRow({
  label,
  status,
  detail,
}: {
  label: string;
  status: HealthState | "warn";
  detail?: string;
}) {
  const colors = {
    loading: "bg-gray-100 text-gray-600",
    ok: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warn: "bg-amber-100 text-amber-800",
  };

  return (
    <li className="flex flex-wrap items-center justify-between gap-2">
      <span className="font-medium text-gray-700">{label}</span>
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[status]}`}>
        {status}
      </span>
      {detail && <span className="w-full text-xs text-gray-500">{detail}</span>}
    </li>
  );
}
