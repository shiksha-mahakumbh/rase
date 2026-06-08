"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  AdminProvider,
  useAdmin,
  canManageStatus,
} from "@/lib/adminAuth";
import { formatFirestoreDate } from "@/lib/saveRegistration";
import { downloadAcknowledgementPdf } from "@/lib/generateAcknowledgementPdf";
import toast, { Toaster } from "react-hot-toast";
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
  const { user, role, loading, login, isAdmin } = useAdmin();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [fetching, setFetching] = useState(true);

  const load = async () => {
    const snap = await getDoc(doc(db, "registrations", id));
    if (snap.exists()) {
      setRecord(snap.data());
    }
    setFetching(false);
  };

  useEffect(() => {
    if (isAdmin && id) load();
  }, [isAdmin, id]);

  const updateStatus = async (
    field: "registrationStatus" | "paymentStatus" | "accommodationStatus",
    value: string
  ) => {
    if (!canManageStatus(role)) return;
    await updateDoc(doc(db, "registrations", id), {
      [field]: value,
      updatedAt: new Date(),
    });
    toast.success("Status updated");
    load();
  };

  if (loading || fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="mb-4 text-gray-600">Admin login required</p>
        <button
          type="button"
          onClick={login}
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-white"
        >
          Sign in
        </button>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
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
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-center" />
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <Link href="/admin" className="text-sm text-primary hover:underline">
              ← Back to Dashboard
            </Link>
            <h1 className="mt-1 font-mono text-xl font-bold">
              {String(record.registrationId)}
            </h1>
          </div>
          <div className="flex gap-2">
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
                  submissionDate: formatFirestoreDate(record.createdAt),
                })
              }
              className="rounded-lg border px-4 py-2 text-sm font-semibold"
            >
              Print / PDF
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
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
          Submitted: {formatFirestoreDate(record.createdAt)} · Updated:{" "}
          {formatFirestoreDate(record.updatedAt)}
        </p>
      </main>
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
  return (
    <AdminProvider>
      <DetailContent />
    </AdminProvider>
  );
}
