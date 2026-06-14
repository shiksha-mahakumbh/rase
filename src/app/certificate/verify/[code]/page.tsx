"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type VerifyResult = {
  valid: boolean;
  certificateNo?: string;
  certificateType?: string;
  issuedAt?: string;
  registrationId?: string;
  name?: string;
  institution?: string;
  category?: string;
  error?: string;
};

export default function CertificateVerifyPage() {
  const params = useParams();
  const code = String(params.code ?? "");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    void (async () => {
      try {
        const res = await fetch(`/api/certificate/verify/${encodeURIComponent(code)}`);
        const data = await res.json();
        setResult(res.ok ? data : { valid: false, error: data.error });
      } catch {
        setResult({ valid: false, error: "Verification failed" });
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        <h1 className="text-xl font-bold text-brand-navy">Certificate Verification</h1>
        <p className="mt-1 text-sm text-slate-500">Shiksha Mahakumbh</p>
        {loading ? (
          <p className="mt-8 text-slate-600">Verifying…</p>
        ) : result?.valid ? (
          <div className="mt-6 space-y-2 text-left text-sm">
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center font-bold text-emerald-800">✓ Valid Certificate</div>
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Certificate No:</strong> {result.certificateNo}</p>
            <p><strong>Type:</strong> {result.certificateType}</p>
            <p><strong>Registration ID:</strong> {result.registrationId}</p>
            <p><strong>Institution:</strong> {result.institution}</p>
            <p><strong>Category:</strong> {result.category}</p>
            {result.issuedAt && <p><strong>Issued:</strong> {new Date(result.issuedAt).toLocaleDateString("en-IN")}</p>}
          </div>
        ) : (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-6 font-semibold text-red-800">
            Invalid or revoked certificate
          </div>
        )}
      </div>
    </div>
  );
}
