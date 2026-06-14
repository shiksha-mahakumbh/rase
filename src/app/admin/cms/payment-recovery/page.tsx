"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminLoading,
  AdminEmpty,
} from "@/components/admin/cms/AdminUi";
import {
  OpsStatusBadge,
  formatInr,
  formatDateTime,
  runRecoveryAction,
  downloadAdminFile,
} from "@/components/admin/ops/OpsUi";

type OrphanRow = {
  id: string;
  issueType: string;
  severity: "critical" | "warning" | "info";
  registrationId: string | null;
  applicantName: string | null;
  email: string | null;
  mobile: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  amount: number | null;
  message: string;
  createdAt: string;
};

const ISSUE_LABELS: Record<string, string> = {
  verified_no_registration: "Verified — no registration",
  registration_no_payment: "Registration — no payment",
  payment_no_receipt: "Payment — no receipt",
  payment_email_failed: "Email failed",
  registration_no_qr: "Registration — no QR",
};

export default function PaymentRecoveryPage() {
  const [items, setItems] = useState<OrphanRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [linkPaymentId, setLinkPaymentId] = useState("");
  const [linkRegistrationId, setLinkRegistrationId] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminCmsFetch<{ items: OrphanRow[]; counts: Record<string, number> }>(
        "payment-recovery"
      );
      setItems(data.items ?? []);
      setCounts(data.counts ?? {});
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load recovery queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (action: string, payload: Record<string, string>, label: string) => {
    setBusy(label);
    try {
      await runRecoveryAction(action, payload);
      toast.success(`${label} completed`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : `${label} failed`);
    } finally {
      setBusy(null);
    }
  };

  const manualLink = async () => {
    if (!linkPaymentId.trim() || !linkRegistrationId.trim()) {
      toast.error("Enter both payment ID and registration ID");
      return;
    }
    await act(
      "manual-link",
      {
        razorpayPaymentId: linkPaymentId.trim(),
        registrationId: linkRegistrationId.trim(),
      },
      "Manual link"
    );
    setLinkPaymentId("");
    setLinkRegistrationId("");
  };

  return (
    <div>
      <AdminPageHeader
        title="Payment Recovery"
        description="Detect and repair orphan payments, missing receipts, failed emails, and QR gaps."
        actions={
          <AdminButton variant="secondary" onClick={() => void load()}>
            Refresh
          </AdminButton>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(ISSUE_LABELS).map(([key, label]) => (
          <AdminCard key={key} className="!p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-xl font-bold text-brand-navy">{counts[key] ?? 0}</p>
          </AdminCard>
        ))}
        <AdminCard className="!p-3">
          <p className="text-xs text-slate-500">Total issues</p>
          <p className="text-xl font-bold text-red-700">{counts.total ?? 0}</p>
        </AdminCard>
      </div>

      <AdminCard className="mb-4">
        <h2 className="mb-3 text-sm font-bold text-brand-navy">Manual Link Payment</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <AdminInput
            label="Razorpay Payment ID"
            value={linkPaymentId}
            onChange={(e) => setLinkPaymentId(e.target.value)}
            placeholder="pay_..."
          />
          <AdminInput
            label="Registration ID"
            value={linkRegistrationId}
            onChange={(e) => setLinkRegistrationId(e.target.value)}
            placeholder="SMK2026-..."
          />
          <div className="flex items-end">
            <AdminButton onClick={() => void manualLink()} disabled={busy !== null}>
              Link payment to registration
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No recovery issues detected. All payments are reconciled." />
      ) : (
        <div className="space-y-3">
          {items.map((row) => (
            <AdminCard key={row.id} className="!p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <OpsStatusBadge value={row.severity} type="severity" />
                    <span className="text-sm font-semibold text-brand-navy">
                      {ISSUE_LABELS[row.issueType] ?? row.issueType}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{row.message}</p>
                  <div className="mt-2 grid gap-1 text-xs text-slate-600 md:grid-cols-2">
                    <span>Registration: {row.registrationId ?? "—"}</span>
                    <span>Email: {row.email ?? "—"}</span>
                    <span>Payment: {row.razorpayPaymentId ?? "—"}</span>
                    <span>Order: {row.razorpayOrderId ?? "—"}</span>
                    <span>Amount: {row.amount != null ? formatInr(row.amount) : "—"}</span>
                    <span>Detected: {formatDateTime(row.createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.registrationId && (
                    <>
                      <AdminButton
                        size="sm"
                        variant="secondary"
                        disabled={busy !== null}
                        onClick={() =>
                          void act(
                            "regenerate-receipt",
                            { registrationId: row.registrationId! },
                            "Regenerate receipt"
                          )
                        }
                      >
                        Regenerate receipt
                      </AdminButton>
                      <AdminButton
                        size="sm"
                        variant="secondary"
                        disabled={busy !== null}
                        onClick={() =>
                          downloadAdminFile(
                            `receipts/${row.registrationId}?type=receipt`,
                            `receipt-${row.registrationId}.pdf`
                          )
                        }
                      >
                        Download receipt
                      </AdminButton>
                      <AdminButton
                        size="sm"
                        variant="secondary"
                        disabled={busy !== null}
                        onClick={() =>
                          void act(
                            "regenerate-qr",
                            { registrationId: row.registrationId! },
                            "Regenerate QR"
                          )
                        }
                      >
                        Regenerate QR
                      </AdminButton>
                      <AdminButton
                        size="sm"
                        disabled={busy !== null}
                        onClick={() =>
                          void act(
                            "resend-email",
                            { registrationId: row.registrationId! },
                            "Resend email"
                          )
                        }
                      >
                        Resend email
                      </AdminButton>
                    </>
                  )}
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
