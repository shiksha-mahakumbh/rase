"use client";

import { useEffect, useState, Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { downloadAcknowledgementPdf } from "@/lib/generateAcknowledgementPdf";
import { formatFirestoreDate } from "@/lib/saveRegistration";
import { EVENT_NAME } from "@/types/registration";
import { event } from "@/design/tokens";
import { ROUTES } from "@/constants/routes";
import { CtaButton } from "@/components/ui";

function buildCalendarIcs(id: string) {
  const uid = `${id}@shikshamahakumbh.org`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    "DTSTART;VALUE=DATE:20261009",
    "DTEND;VALUE=DATE:20261012",
    `SUMMARY:${EVENT_NAME}`,
    `LOCATION:${event.venue}, ${event.location}`,
    "DESCRIPTION:Shiksha Mahakumbh Abhiyan — official registration confirmed",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function SuccessInner() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id");
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!registrationId) {
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      const q = query(
        collection(db, "registrations"),
        where("registrationId", "==", registrationId),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setRecord(snap.docs[0].data() as Record<string, unknown>);
      }
      setLoading(false);
    };

    fetchRecord();
  }, [registrationId]);

  useEffect(() => {
    if (!registrationId) return;
    QRCode.toDataURL(registrationId, { width: 200, margin: 2 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [registrationId]);

  const handleDownloadPdf = () => {
    if (!record || !registrationId) return;
    downloadAcknowledgementPdf({
      registrationId,
      registrationType: String(record.registrationType ?? "—"),
      fullName: String(record.fullName ?? "—"),
      institution: String(record.institution ?? "—"),
      email: String(record.email ?? "—"),
      contactNumber: String(record.contactNumber ?? "—"),
      paymentStatus: String(record.paymentStatus ?? "Pending"),
      submissionDate: formatFirestoreDate(record.createdAt),
    });
  };

  const handleAddToCalendar = () => {
    if (!registrationId) return;
    const blob = new Blob([buildCalendarIcs(registrationId)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shiksha-mahakumbh-2026.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!registrationId) return;
    const text = `I registered for ${EVENT_NAME}. Registration ID: ${registrationId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: EVENT_NAME, text, url: window.location.href });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
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
      <div className="overflow-hidden rounded-3xl border border-brand-emerald/30 bg-white shadow-xl">
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
            <ActionCard title="Download receipt" onClick={handleDownloadPdf} disabled={!record}>
              PDF acknowledgement
            </ActionCard>
            <ActionCard title="Add to calendar" onClick={handleAddToCalendar}>
              Save event dates
            </ActionCard>
            <ActionCard title="Share" onClick={handleShare}>
              Tell colleagues
            </ActionCard>
            <ActionCard title="Print" onClick={() => window.print()}>
              Print confirmation
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
              <li>Bring payment receipt if your track requires fee verification.</li>
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

          <div className="flex flex-wrap justify-center gap-3 print:hidden">
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
