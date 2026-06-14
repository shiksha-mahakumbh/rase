"use client";

export function OpsStatusBadge({
  value,
  type = "default",
}: {
  value: string;
  type?: "payment" | "email" | "receipt" | "qr" | "severity" | "default";
}) {
  const v = value.toLowerCase();
  let cls = "bg-slate-100 text-slate-700";

  if (type === "severity") {
    if (v === "critical") cls = "bg-red-100 text-red-800";
    else if (v === "warning") cls = "bg-amber-100 text-amber-900";
    else cls = "bg-blue-100 text-blue-800";
  } else if (type === "payment") {
    if (v.includes("paid")) cls = "bg-emerald-100 text-emerald-800";
    else if (v.includes("fail")) cls = "bg-red-100 text-red-800";
    else if (v.includes("pending")) cls = "bg-amber-100 text-amber-900";
  } else if (type === "email") {
    if (v === "sent") cls = "bg-emerald-100 text-emerald-800";
    else if (v === "failed") cls = "bg-red-100 text-red-800";
    else if (v === "pending" || v === "queued") cls = "bg-amber-100 text-amber-900";
  } else if (type === "receipt" || type === "qr") {
    if (v === "generated") cls = "bg-emerald-100 text-emerald-800";
    else if (v === "missing") cls = "bg-red-100 text-red-800";
    else cls = "bg-slate-100 text-slate-500";
  } else if (v === "success") cls = "bg-emerald-100 text-emerald-800";
  else if (v === "failed") cls = "bg-red-100 text-red-800";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {value}
    </span>
  );
}

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function runRecoveryAction(
  action: string,
  payload: Record<string, string>
) {
  const { adminCmsFetch } = await import("@/lib/admin-cms-api");
  return adminCmsFetch(`payment-recovery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
}

export function downloadAdminFile(path: string, filename: string) {
  const link = document.createElement("a");
  link.href = `/api/admin/gateway/${path}`;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
