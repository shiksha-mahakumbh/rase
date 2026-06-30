"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAdmin, canManageStatus } from "@/lib/adminAuth";
import { fetchRegistrationByPublicId } from "@/lib/admin/registrations-client";
import type { AdminRegistrationView } from "@/lib/admin/registration-detail-types";
import { formatRegistrationDate } from "@/lib/format-date";
import { downloadAcknowledgementPdf } from "@/lib/generateAcknowledgementPdf";
import toast from "react-hot-toast";

function DetailContent() {
  const params = useParams();
  const id = params.id as string;
  const { role } = useAdmin();
  const [record, setRecord] = useState<AdminRegistrationView | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setFetching(true);
    setLoadError(null);
    try {
      const row = await fetchRegistrationByPublicId(id);
      setRecord(row);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to load registration";
      setLoadError(message);
      toast.error(message);
      setRecord(null);
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) void load();
  }, [id, load]);

  const updateStatus = async (
    field: "registrationStatus" | "paymentStatus" | "accommodationStatus",
    value: string
  ) => {
    if (!canManageStatus(role)) return;
    try {
      const res = await fetch(
        `/api/admin/gateway/registrations/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ field, value }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err.error === "string" ? err.error : "Update failed");
      }
      toast.success("Status updated");
      void load();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24" role="status" aria-live="polite">
        <p className="text-sm text-slate-600">Loading registration…</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center py-24" role="alert">
        <p>{loadError ?? "Registration not found"}</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Retry
          </button>
          <Link href="/admin" className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-primary hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-1 font-mono text-xl font-bold">{record.registrationId}</h1>
          <p className="text-sm text-slate-600">{record.registrationType}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={record.links.receiptsAdmin}
            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Receipts & QR
          </Link>
          <Link
            href={record.links.paymentAudit}
            className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Payment audit
          </Link>
          <button
            type="button"
            onClick={() =>
              downloadAcknowledgementPdf({
                registrationId: record.registrationId,
                registrationType: record.registrationType,
                fullName: record.personal.fullName,
                institution: record.personal.institution,
                email: record.personal.email,
                contactNumber: record.personal.contactNumber,
                paymentStatus: record.payment.status,
                submissionDate: formatRegistrationDate(record.createdAt),
              })
            }
            className="rounded-lg border px-4 py-2 text-sm font-semibold"
          >
            Print / PDF
          </button>
        </div>
      </div>

      {canManageStatus(role) && (
        <section className="rounded-2xl border bg-white p-5">
          <h2 className="mb-4 font-bold text-primary">Status Management</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <StatusSelect
              label="Registration Status"
              value={record.registrationStatus}
              options={record.statusOptions.registration}
              onChange={(v) => updateStatus("registrationStatus", v)}
            />
            <StatusSelect
              label="Payment Status"
              value={record.paymentStatus}
              options={record.statusOptions.payment}
              onChange={(v) => updateStatus("paymentStatus", v)}
            />
            <StatusSelect
              label="Accommodation Status"
              value={record.accommodationStatus}
              options={record.statusOptions.accommodation}
              onChange={(v) => updateStatus("accommodationStatus", v)}
            />
          </div>
        </section>
      )}

      <DetailSection title="Personal Information">
        <DetailGrid
          data={{
            "Full Name": record.personal.fullName,
            Gender: record.personal.gender,
            Designation: record.personal.designation,
            Institution: record.personal.institution,
            Address: record.personal.address,
            Country: record.personal.country,
            Email: record.personal.email,
            Phone: record.personal.contactNumber,
            WhatsApp: record.personal.whatsappNumber,
            "Vidya Bharti": record.personal.vidyaBharti,
          }}
        />
      </DetailSection>

      {Object.keys(record.typeDetails).length > 0 && (
        <DetailSection title={`${record.registrationType} Details`}>
          <DetailGrid data={record.typeDetails} />
        </DetailSection>
      )}

      {record.accommodation && (
        <DetailSection title="Accommodation Details">
          <DetailGrid
            data={{
              Required: record.accommodation.required,
              Date: record.accommodation.date,
              Type: record.accommodation.type,
              Category: record.accommodation.category,
              Status: record.accommodation.status,
            }}
          />
        </DetailSection>
      )}

      <DetailSection title="Payment Information">
        <DetailGrid
          data={{
            Status: record.payment.status,
            Fee: record.payment.registrationFee != null ? `₹${record.payment.registrationFee}` : null,
            "UTR Number": record.payment.utrNumber,
            "Transaction ID": record.payment.transactionId,
            "Cheque Number": record.payment.chequeNumber,
            PAN: record.payment.panNumber,
            "Razorpay Order": record.payment.razorpayOrderId,
            "Razorpay Payment": record.payment.razorpayPaymentId,
            ...(record.payment.latestRecord
              ? {
                  "Latest payment amount": `${record.payment.latestRecord.currency} ${record.payment.latestRecord.amount}`,
                  "Latest payment status": record.payment.latestRecord.status,
                  "Latest payment at": formatRegistrationDate(record.payment.latestRecord.createdAt),
                }
              : {}),
          }}
        />
      </DetailSection>

      <DetailSection title="Event Lifecycle">
        <DetailGrid
          data={{
            "Check-in": record.lifecycle.checkInStatus,
            "Checked in at": record.lifecycle.checkedInAt
              ? formatRegistrationDate(record.lifecycle.checkedInAt)
              : null,
            Location: record.lifecycle.checkInLocation,
            "Kit distributed": record.lifecycle.kitDistributed ? "Yes" : "No",
            "Kit distributed at": record.lifecycle.kitDistributedAt
              ? formatRegistrationDate(record.lifecycle.kitDistributedAt)
              : null,
            "Certificate eligible": record.lifecycle.certificateEligible ? "Yes" : "No",
            "Certificate status": record.lifecycle.certificateLifecycleStatus,
            "Receipt generated": record.lifecycle.receiptGeneratedAt
              ? formatRegistrationDate(record.lifecycle.receiptGeneratedAt)
              : null,
            "Receipt emailed": record.lifecycle.receiptSentAt
              ? formatRegistrationDate(record.lifecycle.receiptSentAt)
              : null,
            "QR generated": record.lifecycle.qrGeneratedAt
              ? formatRegistrationDate(record.lifecycle.qrGeneratedAt)
              : null,
            "Email delivery": record.emailDeliveryStatus,
          }}
        />
        <p className="mt-3 text-sm">
          <Link href={`${record.links.checkIn}`} className="text-primary underline">
            Open check-in gate →
          </Link>
        </p>
      </DetailSection>

      {record.documents.length > 0 && (
        <DetailSection title="Uploaded Documents">
          <ul className="space-y-2">
            {record.documents.map((f) => (
              <li key={`${f.fieldName}-${f.url}`}>
                <span className="font-semibold">{f.label}: </span>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {record.emailLogs.length > 0 && (
        <DetailSection title="Email Log (recent)">
          <ul className="divide-y rounded-lg border">
            {record.emailLogs.map((log, i) => (
              <li key={`${log.createdAt}-${i}`} className="px-4 py-3 text-sm">
                <p className="font-medium">{log.subject}</p>
                <p className="text-xs text-slate-500">
                  {log.status}
                  {log.sentAt ? ` · sent ${formatRegistrationDate(log.sentAt)}` : ""}
                  {" · "}
                  {formatRegistrationDate(log.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {record.statusHistory.length > 0 && (
        <DetailSection title="Registration Status History">
          <ul className="divide-y rounded-lg border">
            {record.statusHistory.map((h, i) => (
              <li key={`${h.createdAt}-${i}`} className="px-4 py-3 text-sm">
                {h.fromStatus ? `${h.fromStatus} → ` : ""}
                <span className="font-semibold">{h.toStatus}</span>
                <span className="text-slate-500"> · {formatRegistrationDate(h.createdAt)}</span>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {Object.keys(record.extraMetadata).length > 0 && (
        <DetailSection title="Additional Fields">
          <DetailGrid data={record.extraMetadata} />
        </DetailSection>
      )}

      <p className="text-sm text-gray-500">
        Submitted: {formatRegistrationDate(record.createdAt)} · Updated:{" "}
        {formatRegistrationDate(record.updatedAt)}
      </p>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-primary">{title}</h2>
      {children}
    </section>
  );
}

function DetailGrid({ data }: { data: Record<string, unknown> }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <dt className="text-xs font-semibold uppercase text-gray-500">{key}</dt>
          <dd className="text-sm text-gray-900">{formatValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function formatValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function StatusSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[] | string[];
  onChange: (v: string) => void;
}) {
  const safeValue = options.includes(value) ? value : options[0] ?? value;
  return (
    <label className="block text-sm">
      <span className="font-semibold text-gray-700">{label}</span>
      <select
        className="mt-1 w-full rounded-lg border px-3 py-2"
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function RegistrationDetailPage() {
  return <DetailContent />;
}
