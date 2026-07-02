"use client";

import { useEffect, useMemo, useState, Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { EVENT_NAME } from "@/types/registration";
import { event } from "@/design/tokens";
import { REGISTRATION_SUCCESS_LINKS } from "@/data/registration-hub";
import { ROUTES } from "@/constants/routes";
import { CtaButton } from "@/components/ui";
import { downloadSmk6Calendar, shareRegistrationSuccess } from "@/lib/registration/success-actions";
import RegistrationReceipt, {
  type ReceiptData,
  buildReceiptData as buildReceiptDataShared,
  downloadRegistrationReceiptPdf,
  printRegistrationReceipt,
} from "@/components/registration/RegistrationReceipt";

type PublicRecord = {
  registrationId?: string;
  fullName?: string;
  registrationFee?: number;
  registrationType?: string;
  delegateCategory?: string | null;
  institution?: string | null;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  paymentStatus?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  qrDataUrl?: string | null;
  accommodationRequired?: string | null;
  accommodationStatus?: string | null;
};

function buildReceiptData(
  record: PublicRecord,
  registrationId: string,
  registrantEmail?: string | null
): ReceiptData {
  const fee = Number(record.registrationFee ?? 0);

  return buildReceiptDataShared({
    registrationId,
    fullName: String(record.fullName ?? "—"),
    category: String(
      record.delegateCategory ?? record.registrationType ?? "—"
    ),
    institution: String(record.institution ?? "—"),
    email: String(registrantEmail ?? "—"),
    contactNumber: "—",
    amount: fee,
    paymentId: record.razorpayPaymentId ?? undefined,
    orderId: record.razorpayOrderId ?? undefined,
    transactionDate: String(record.updatedAt ?? record.createdAt ?? ""),
  });
}

function SuccessInner() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id");
  const lookupToken = searchParams.get("token");
  const [record, setRecord] = useState<PublicRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [registrantEmail, setRegistrantEmail] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!registrationId) {
      setLoading(false);
      return;
    }

    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("smk_registration_email");
      if (stored) setRegistrantEmail(stored);
    }

    const fetchRecord = async () => {
      try {
        if (lookupToken) {
          const res = await fetch(
            `/api/v2/registration/${encodeURIComponent(registrationId)}?token=${encodeURIComponent(lookupToken)}`
          );
          if (res.ok) {
            const body = (await res.json()) as { registration?: PublicRecord };
            const data = body.registration ?? (body as PublicRecord);
            setRecord(data);
            if (typeof window !== "undefined") {
              sessionStorage.setItem("smk_lookup_token", lookupToken);
              sessionStorage.setItem("smk_registration_id", registrationId);
            }
          } else {
            const json = (await res.json().catch(() => ({}))) as { error?: string };
            setFetchError(json.error ?? "Unable to load registration details");
          }
        }
      } catch {
        setFetchError("Unable to load registration details");
      }
      setLoading(false);
    };

    void fetchRecord();
  }, [registrationId, lookupToken]);

  const receiptData = useMemo(() => {
    if (!record || !registrationId) return null;
    return buildReceiptData(record, registrationId, registrantEmail);
  }, [record, registrationId, registrantEmail]);

  const qrDataUrl = record?.qrDataUrl ?? null;

  const dashboardHref = registrationId
    ? `/dashboard?id=${encodeURIComponent(registrationId)}${lookupToken ? `&token=${encodeURIComponent(lookupToken)}` : ""}${registrantEmail ? `&email=${encodeURIComponent(registrantEmail)}` : ""}`
    : ROUTES.dashboard;

  const handleDownloadReceipt = () => {
    if (!receiptData || !registrationId) return;
    void downloadRegistrationReceiptPdf(receiptData, {
      registrationId,
      token: lookupToken,
      qrDataUrl,
    }).catch(() => {
      window.alert("Unable to download receipt. Please try again or use Print receipt.");
    });
  };

  const handlePrintReceipt = () => {
    if (!receiptData) return;
    printRegistrationReceipt(receiptData, qrDataUrl);
  };

  const handleResendEmail = async () => {
    if (!registrationId || !lookupToken) return;
    setResendStatus("sending");
    setResendMessage(null);
    try {
      const res = await fetch("/api/v2/registration/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId,
          token: lookupToken,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!res.ok) {
        throw new Error(body.error ?? "Could not resend email");
      }
      setResendStatus("sent");
      setResendMessage(body.message ?? "Confirmation email sent. Check your inbox and spam folder.");
    } catch (error) {
      setResendStatus("error");
      setResendMessage(
        error instanceof Error ? error.message : "Could not resend email. Try again in a minute."
      );
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-600" role="status">
        Loading your confirmation…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      {receiptData ? (
        <RegistrationReceipt data={receiptData} qrDataUrl={qrDataUrl} visible={false} />
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-brand-emerald/30 bg-white shadow-xl print:hidden">
        <div className="bg-gradient-to-r from-brand-navy to-brand-navy-light px-6 py-8 text-center text-white md:px-10">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-saffron">
            Registration confirmed
          </p>
          <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
            You&apos;re registered for {EVENT_NAME}
          </h2>
          <p className="mt-2 text-sm text-white/85">
            9–11 October 2026 · {event.venue}
          </p>
        </div>

        <div className="space-y-6 p-6 md:p-10">
          {fetchError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              {fetchError}. Your registration ID is saved below — use it with your email on the participant portal.
            </div>
          ) : null}

          {registrationId && (
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="rounded-2xl border border-slate-200 bg-brand-surface p-6 text-center md:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Registration number
                </p>
                <p className="mt-1 font-mono text-2xl font-extrabold text-brand-navy">
                  {registrationId}
                </p>
                {record?.fullName ? (
                  <p className="mt-2 text-sm text-slate-600">
                    {record.fullName}
                    {record.delegateCategory || record.registrationType
                      ? ` · ${record.delegateCategory ?? record.registrationType}`
                      : ""}
                  </p>
                ) : null}
                {record?.paymentStatus ? (
                  <p className="mt-1 text-xs text-slate-500">Payment: {record.paymentStatus.replace(/_/g, " ")}</p>
                ) : null}
              </div>

              {qrDataUrl ? (
                <div className="rounded-2xl border border-dashed border-brand-saffron/50 bg-white p-4 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="Registration QR code for venue check-in"
                    width={180}
                    height={180}
                    className="mx-auto h-44 w-44 object-contain"
                  />
                  <p className="mt-2 text-xs font-semibold text-brand-navy">Venue check-in QR</p>
                  <p className="text-[11px] text-slate-500">Save or screenshot for event day</p>
                </div>
              ) : null}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <ActionCard title="View my registration" href={dashboardHref}>
              Receipts, badge, and profile
            </ActionCard>
            <ActionCard
              title="Download receipt"
              onClick={handleDownloadReceipt}
              disabled={!receiptData}
            >
              PDF — same layout as print (one page)
            </ActionCard>
            <ActionCard
              title="Print receipt"
              onClick={handlePrintReceipt}
              disabled={!receiptData || !lookupToken}
            >
              Same layout as PDF download (one page)
            </ActionCard>
            <ActionCard
              title="Resend confirmation email"
              onClick={() => void handleResendEmail()}
              disabled={!lookupToken || resendStatus === "sending"}
            >
              {resendStatus === "sending"
                ? "Sending…"
                : "Receipt PDF + QR to your inbox"}
            </ActionCard>
            <ActionCard title="Add to calendar" onClick={() => downloadSmk6Calendar()}>
              Download .ics for 9–11 Oct 2026
            </ActionCard>
            <ActionCard
              title="Share registration"
              onClick={() => void shareRegistrationSuccess(registrationId)}
            >
              Invite colleagues to register
            </ActionCard>
          </div>

          {resendMessage ? (
            <div
              className={`rounded-2xl border p-4 text-sm ${
                resendStatus === "sent"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-950"
                  : "border-amber-200 bg-amber-50 text-amber-950"
              }`}
            >
              {resendMessage}
            </div>
          ) : null}

          <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-sm text-amber-950">
            <h2 className="font-bold text-brand-navy">Next steps</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Save your registration number and QR code for event check-in.</li>
              <li>Check your email (and spam folder) for confirmation, receipt PDF, and QR attachment.</li>
              <li>Didn&apos;t get the email? Use <strong>Resend confirmation email</strong> above.</li>
              <li>Accommodation registration opens in September — watch this page and your email.</li>
              <li>Download or print your receipt — both use the same official layout.</li>
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
                  href="mailto:info@shikshamahakumbh.com"
                  className="font-semibold text-brand-navy underline"
                >
                  info@shikshamahakumbh.com
                </a>
              </p>
              <Link href={ROUTES.contact} className="mt-1 inline-block font-semibold text-brand-saffron">
                Contact page →
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-brand-navy">Explore the programme</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {REGISTRATION_SUCCESS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg border border-slate-100 px-3 py-2 text-sm font-semibold text-brand-navy transition hover:border-brand-saffron/40 hover:bg-brand-surface"
                  >
                    {link.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap justify-center gap-3">
            <CtaButton href={dashboardHref} variant="primary">
              View my registration
            </CtaButton>
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
  href,
  disabled,
}: {
  title: string;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}) {
  const className =
    "min-h-[44px] rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-brand-saffron/40 hover:shadow-md disabled:opacity-50";

  if (href) {
    return (
      <Link href={href} className={className}>
        <p className="text-sm font-bold text-brand-navy">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{children}</p>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
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
