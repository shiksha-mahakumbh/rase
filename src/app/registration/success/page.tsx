"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { downloadAcknowledgementPdf } from "@/lib/generateAcknowledgementPdf";
import { formatFirestoreDate } from "@/lib/saveRegistration";
import { EVENT_NAME } from "@/types/registration";
import CompanyInfo from "@/app/component/CompanyInfo";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id");
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
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

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-600">Loading...</div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-8 shadow-xl print:shadow-none">
        <div className="mb-6 text-center text-5xl">✅</div>
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Registration Submitted Successfully
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Thank you for registering for {EVENT_NAME}.
        </p>

        {registrationId && (
          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Registration ID
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-gray-900">
              {registrationId}
            </p>
          </div>
        )}

        <div className="mb-8 rounded-xl bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">Important Instructions</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Save your Registration ID for future reference.</li>
            <li>
              Accommodation details (if selected) will be shared separately.
            </li>
            <li>Keep payment receipt safely.</li>
            <li>
              You may be contacted by the organizing team for verification.
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={!record}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            Download Acknowledgement PDF
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Print Registration
          </button>
          <Link
            href="/"
            className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-white">
      <CompanyInfo />
      <NavBar />
      <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
