"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminButton,
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

type PaymentRow = {
  registrationId: string;
  registrationCategory: string;
  applicantName: string;
  amount: number;
  receiptStatus: string;
  qrStatus: string;
  emailStatus: string;
  receiptGeneratedAt: string | null;
  qrStoragePath: string | null;
  createdAt: string;
};

export default function ReceiptManagementPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50", offset: "0", paymentStatus: "Paid" });
      if (search.trim()) params.set("search", search.trim());
      const data = await adminCmsFetch<{ items: PaymentRow[] }>(`payments?${params}`);
      setItems(data.items ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load receipts");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (action: string, registrationId: string) => {
    setBusy(registrationId + action);
    try {
      await runRecoveryAction(action, { registrationId });
      toast.success("Done");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Receipt & QR Management"
        description="View, regenerate, download, and resend receipts and QR codes for paid registrations."
      />

      <AdminCard className="mb-4">
        <div className="flex flex-wrap gap-3">
          <AdminInput
            label="Search registration ID or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[240px]"
          />
          <div className="flex items-end">
            <AdminButton onClick={() => void load()}>Search</AdminButton>
          </div>
        </div>
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No paid registrations found." />
      ) : (
        <div className="space-y-3">
          {items.map((row) => (
            <AdminCard key={row.registrationId} className="!p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-bold text-brand-navy">
                    {row.registrationId}
                  </p>
                  <p className="text-sm text-slate-600">
                    {row.applicantName} · {row.registrationCategory} · {formatInr(row.amount)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <OpsStatusBadge value={row.receiptStatus} type="receipt" />
                    <OpsStatusBadge value={row.qrStatus} type="qr" />
                    <OpsStatusBadge value={row.emailStatus} type="email" />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Receipt generated: {formatDateTime(row.receiptGeneratedAt)} · QR path:{" "}
                    {row.qrStoragePath ?? "—"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
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
                      downloadAdminFile(
                        `receipts/${row.registrationId}?type=qr`,
                        `qr-${row.registrationId}.png`
                      )
                    }
                  >
                    Download QR
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="secondary"
                    disabled={busy !== null}
                    onClick={() => void act("regenerate-receipt", row.registrationId)}
                  >
                    Regenerate receipt
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="secondary"
                    disabled={busy !== null}
                    onClick={() => void act("regenerate-qr", row.registrationId)}
                  >
                    Regenerate QR
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    disabled={busy !== null}
                    onClick={() => void act("send-receipt", row.registrationId)}
                  >
                    Send receipt email
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
