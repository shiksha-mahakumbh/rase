"use client";

import { useEffect, useMemo, useState, Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { formatFirestoreDate } from "@/lib/saveRegistration";
import { EVENT_NAME } from "@/types/registration";
import { event } from "@/design/tokens";
import { ROUTES } from "@/constants/routes";
import { CtaButton } from "@/components/ui";
import RegistrationReceipt, {
  type ReceiptData,
  downloadRegistrationReceiptPdf,
  printRegistrationReceipt,
} from "@/components/registration/RegistrationReceipt";

function buildReceiptData(
  record: Record<string, unknown>,
  registrationId: string
): ReceiptData {
  const payment = record.payment as Record<string, unknown> | undefined;
  const fee = Number(record.registrationFee ?? payment?.registrationFee ?? 0);
  const hasRazorpay = Boolean(payment?.razorpayPaymentId ?? record.razorpayPaymentId);

  return {
    receiptNumber: registrationId.replace(/^SMK/, "RCP"),
    registrationId,
    date: formatFirestoreDate(record.createdAt),
    fullName: String(record.fullName ?? "—"),
    category: String(
      record.delegateCategory ??
        record.category ??
        record.projectStudentType ??
        record.accommodationBedType ??
        record.registrationType ??
        "—"
    ),
    institution: String(record.institution ?? "—"),
    email: String(record.email ?? "—"),
    contactNumber: String(record.contactNumber ?? "—"),
    amount: fee,
    paymentId: String(payment?.razorpayPaymentId ?? record.razorpayPaymentId ?? "—"),
    orderId: String(payment?.razorpayOrderId ?? record.razorpayOrderId ?? "—"),
    paymentMode: hasRazorpay
      ? "Online (Razorpay)"
      : payment?.utrNumber || record.utrNumber
        ? "NEFT / RTGS / UTR"
        : fee > 0
          ? "Manual receipt"
          : "Not applicable",
    transactionDate: formatFirestoreDate(record.updatedAt ?? record.createdAt),
    panNumber: String(payment?.panNumber ?? record.panNumber ?? "") || undefined,
  };
}

function SuccessInner() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id");
  const lookupToken = searchParams.get("token");
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!registrationId) {
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        if (lookupToken) {
          const res = await fetch(
            `/api/registration/${encodeURIComponent(registrationId)}?token=${encodeURIComponent(lookupToken)}`
          );
          if (res.ok) {
            const data = await res.json();
            setRecord(data as Record<string, unknown>);
          }
        }
      } catch {
        // Leave record null — page still shows registration ID from URL
      }
      setLoading(false);
    };

    fetchRecord();
  }, [registrationId, lookupToken]);

  useEffect(() => {
    if (!registrationId) return;
    QRCode.toDataURL(registrationId, { width: 200, margin: 2 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [registrationId]);

  const receiptData = useMemo(() => {
    if (!record || !registrationId) return null;
    return buildReceiptData(record, registrationId);
  }, [record, registrationId]);

  const handleDownloadReceipt = () => {
    if (!receiptData) return;
    void downloadRegistrationReceiptPdf(receiptData);
  };

  const handlePrintReceipt = () => {
    printRegistrationReceipt();
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600" role="status">
        Loading your confirmation…
      </div>
    );
  }

  const accommodation =
    record?.accommodationRequired === "Yes" ||
    record?.accommodationStatus === "Requested";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      {receiptData ? (
        <div className="fixed -left-[9999px] top-0 print:static print:left-auto">
          <RegistrationReceipt data={receiptData} />
        </div>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-brand-emerald/30 bg-white shadow-xl print:hidden">
        <div className="bg-gradient-to-r from-brand-navy to-brand-navy-light px-6 py-8 text-center text-white md:px-10">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-saffron">
            Registration confirmed
          </p>
          <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">
            You&apos;re registered for {EVENT_NAME}
          </h1>
          <p className="mt-2 text-sm text-white/85">
            9–11 October 2026 · {event.venue}
          </p>
        </div>

        <div className="space-y-6 p-6 md:p-10">
          {registrationId && (
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-brand-surface p-6 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Registration number
                </p>
                <p className="mt-1 font-mono text-2xl font-extrabold text-brand-navy">
                  {registrationId}
                </p>
                {record?.fullName ? (
                  <p className="mt-2 text-sm text-slate-600">
                    {String(record.fullName)} · {String(record.registrationType ?? "")}
                  </p>
                ) : null}
              </div>
              {qrDataUrl && (
                <div className="rounded-xl border bg-white p-3 text-center">
                  <Image
                    src={qrDataUrl}
                    alt={`QR code for registration ${registrationId}`}
                    width={160}
                    height={160}
                    className="mx-auto"
                  />
                  <p className="mt-2 text-xs text-slate-500">Show at check-in</p>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <ActionCard
              title="Download receipt"
              onClick={handleDownloadReceipt}
              disabled={!receiptData}
            >
              PDF fee receipt
            </ActionCard>
            <ActionCard
              title="Print receipt"
              onClick={handlePrintReceipt}
              disabled={!receiptData}
            >
              Print fee receipt only
            </ActionCard>
          </div>

          <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-sm text-amber-950">
            <h2 className="font-bold text-brand-navy">Next steps</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Save your registration number and QR code.</li>
              <li>Watch your email for verification from the organising team.</li>
              {accommodation && (
                <li>Accommodation requests are processed separately — you will be contacted.</li>
              )}
              <li>Download or print your receipt for paid registrations.</li>
            </ul>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-xl border bg-brand-surface p-4">
              <h3 className="font-bold text-brand-navy">Important dates</h3>
              <p className="mt-2 text-slate-600">9–11 October 2026</p>
              <p className="text-slate-600">{event.venue}</p>
            </div>
            <div className="rounded-xl border bg-brand-surface p-4">
              <h3 className="font-bold text-brand-navy">Support</h3>
              <p className="mt-2 text-slate-600">
                <a
                  href="mailto:academics@shikshamahakumbh.com"
                  className="font-semibold text-brand-navy underline"
                >
                  academics@shikshamahakumbh.com
                </a>
              </p>
              <Link href={ROUTES.contact} className="mt-1 inline-block font-semibold text-brand-saffron">
                Contact page →
              </Link>
            </div>
          </section>

          <div className="flex flex-wrap justify-center gap-3">
            <CtaButton href={ROUTES.home} variant="ghost">
              Back to home
            </CtaButton>
            <CtaButton href={ROUTES.academicCouncil} variant="secondary">
              View programme
            </CtaButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  children,
  onClick,
  disabled,
}: {
  title: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-h-[44px] rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-brand-saffron/40 hover:shadow-md disabled:opacity-50"
    >
      <p className="text-sm font-bold text-brand-navy">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{children}</p>
    </button>
  );
}

export default function SuccessExperience() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading…</div>}>
      <SuccessInner />
    </Suspense>
  );
}
