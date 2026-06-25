"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  useAdmin,
  canManageStatus,
} from "@/lib/adminAuth";
import { fetchRegistrationByPublicId } from "@/lib/admin/registrations-client";
import { formatRegistrationDate } from "@/lib/format-date";
import { downloadAcknowledgementPdf } from "@/lib/generateAcknowledgementPdf";
import toast from "react-hot-toast";
import {
  RegistrationStatus,
  PaymentStatus,
  AccommodationStatus,
  RegistrationType,
} from "@/types/registration";
import {
  isPaidRegistrationType,
  paidCategoryPaymentOptions,
  freeCategoryPaymentOptions,
} from "@/lib/registration/config";

function DetailContent() {
  const params = useParams();
  const id = params.id as string;
  const { role } = useAdmin();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [fetching, setFetching] = useState(true);

  const load = useCallback(async () => {
    setFetching(true);
    try {
      const row = await fetchRegistrationByPublicId(id);
      if (row) {
        const metadata =
          row.metadata && typeof row.metadata === "object"
            ? (row.metadata as Record<string, unknown>)
            : {};
        setRecord({ ...metadata, ...row });
      } else {
        setRecord(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load registration");
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
      load();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        Loading...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p>Registration not found</p>
        <Link href="/admin" className="mt-4 text-primary underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const payment = record.payment as Record<string, unknown> | undefined;
  const files = collectFiles(record);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-primary hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-1 font-mono text-xl font-bold">
            {String(record.registrationId)}
          </h1>
        </div>
        <button
          type="button"
          onClick={() =>
            downloadAcknowledgementPdf({
              registrationId: String(record.registrationId),
              registrationType: String(record.registrationType),
              fullName: String(record.fullName),
              institution: String(record.institution),
              email: String(record.email),
              contactNumber: String(record.contactNumber),
              paymentStatus: String(record.paymentStatus),
              submissionDate: formatRegistrationDate(record.createdAt),
            })
          }
          className="rounded-lg border px-4 py-2 text-sm font-semibold"
        >
          Print / PDF
        </button>
      </div>

      <div className="space-y-6">
        {canManageStatus(role) && (
          <section className="rounded-2xl border bg-white p-5">
            <h2 className="mb-4 font-bold text-primary">Status Management</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <StatusSelect
                label="Registration Status"
                value={String(record.registrationStatus ?? "Pending")}
                options={["Pending", "Verified", "Approved", "Rejected"]}
                onChange={(v) =>
                  updateStatus("registrationStatus", v as RegistrationStatus)
                }
              />
              <StatusSelect
                label="Payment Status"
                value={String(
                  record.paymentStatus === "Pending"
                    ? "Pending Payment"
                    : record.paymentStatus ?? "Submitted"
                )}
                options={
                  isPaidRegistrationType(
                    String(record.registrationType) as RegistrationType
                  )
                    ? paidCategoryPaymentOptions()
                    : freeCategoryPaymentOptions()
                }
                onChange={(v) =>
                  updateStatus("paymentStatus", v as PaymentStatus)
                }
              />
              <StatusSelect
                label="Accommodation Status"
                value={String(record.accommodationStatus ?? "Not Required")}
                options={[
                  "Not Required",
                  "Requested",
                  "Confirmed",
                  "Allocated",
                ]}
                onChange={(v) =>
                  updateStatus(
                    "accommodationStatus",
                    v as AccommodationStatus
                  )
                }
              />
            </div>
          </section>
        )}

        <DetailSection title="Personal Information">
          <DetailGrid
            data={{
              "Full Name": record.fullName,
              Gender: record.gender,
              Designation: record.designation,
              Institution: record.institution,
              Address: record.address,
              Country: record.country,
              Email: record.email,
              Phone: record.contactNumber,
              WhatsApp: record.whatsappNumber,
              "Vidya Bharti": record.vidyaBharti,
            }}
          />
        </DetailSection>

        <DetailSection title="Registration Details">
          <DetailGrid
            data={Object.fromEntries(
              Object.entries(record).filter(
                ([key]) =>
                  ![
                    "payment",
                    "createdAt",
                    "updatedAt",
                    "fullName",
                    "gender",
                    "designation",
                    "institution",
                    "address",
                    "country",
                    "email",
                    "contactNumber",
                    "whatsappNumber",
                    "vidyaBharti",
                    "accommodationDate",
                    "accommodationType",
                    "participantCategory",
                    "accommodationRequired",
                    "paymentReceipt",
                    "supportingPdf",
                    "supportingPhotos",
                    "recommendationLetter",
                    "studentList",
                    "metadata",
                  ].includes(key)
              )
            )}
          />
        </DetailSection>

        {record.accommodationRequired === "Yes" && (
          <DetailSection title="Accommodation Details">
            <DetailGrid
              data={{
                Required: record.accommodationRequired,
                Date: record.accommodationDate,
                Type: record.accommodationType,
                Category: record.participantCategory,
                Status: record.accommodationStatus,
              }}
            />
          </DetailSection>
        )}

        <DetailSection title="Payment Information">
          <DetailGrid
            data={{
              Status: record.paymentStatus,
              "UTR Number": payment?.utrNumber ?? record.utrNumber,
              "Transaction ID": payment?.transactionId ?? record.transactionId,
              "Cheque Number": payment?.chequeNumber ?? record.chequeNumber,
              PAN: payment?.panNumber ?? record.panNumber,
              Fee: payment?.registrationFee ?? record.registrationFee,
            }}
          />
        </DetailSection>

        {files.length > 0 && (
          <DetailSection title="Uploaded Documents">
            <ul className="space-y-2">
              {files.map((f) => (
                <li key={f.label}>
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

        <p className="text-sm text-gray-500">
          Submitted: {formatRegistrationDate(record.createdAt)} · Updated:{" "}
          {formatRegistrationDate(record.updatedAt)}
        </p>
      </div>
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
          <dt className="text-xs font-semibold uppercase text-gray-500">
            {key}
          </dt>
          <dd className="text-sm text-gray-900">
            {formatValue(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function formatValue(value: unknown): string {
  if (value == null || value === "") return "—";
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
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-gray-700">{label}</span>
      <select
        className="mt-1 w-full rounded-lg border px-3 py-2"
        value={value}
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

function collectFiles(record: Record<string, unknown>) {
  const files: { label: string; url: string }[] = [];
  const add = (label: string, meta: unknown) => {
    if (meta && typeof meta === "object" && "url" in meta) {
      files.push({ label, url: String((meta as { url: string }).url) });
    }
  };

  add("Payment Receipt", record.paymentReceipt);
  add("Supporting PDF", record.supportingPdf);
  add("Recommendation Letter", record.recommendationLetter);
  add("Student List", record.studentList);

  const photos = record.supportingPhotos;
  if (Array.isArray(photos)) {
    photos.forEach((p, i) => add(`Photo ${i + 1}`, p));
  }

  const payment = record.payment as Record<string, unknown> | undefined;
  if (payment?.receipt) add("Payment Receipt", payment.receipt);

  return files;
}

export default function RegistrationDetailPage() {
  return <DetailContent />;
}
