"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminCmsFetch } from "@/lib/admin-cms-api";
import {
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminButton,
  AdminLoading,
  AdminEmpty,
  AdminPagination,
} from "@/components/admin/cms/AdminUi";
import { OpsStatusBadge, formatInr, formatDateTime } from "@/components/admin/ops/OpsUi";

type PaymentRow = {
  registrationId: string;
  registrationCategory: string;
  applicantName: string;
  email: string;
  mobile: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  amount: number;
  paymentStatus: string;
  registrationStatus: string;
  receiptStatus: string;
  emailStatus: string;
  qrStatus: string;
  createdAt: string;
};

const PAYMENT_STATUS_OPTS = [
  { value: "", label: "All payment statuses" },
  { value: "Paid", label: "Paid" },
  { value: "Pending Payment", label: "Pending Payment" },
  { value: "Failed", label: "Failed" },
  { value: "Submitted", label: "Submitted" },
];

const REG_STATUS_OPTS = [
  { value: "", label: "All registration statuses" },
  { value: "Submitted", label: "Submitted" },
  { value: "Pending", label: "Pending" },
  { value: "Verified", label: "Verified" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

const EMAIL_STATUS_OPTS = [
  { value: "", label: "All email statuses" },
  { value: "sent", label: "Sent" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
];

export default function AdminPaymentsPage() {
  const [items, setItems] = useState<PaymentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });
      if (search.trim()) params.set("search", search.trim());
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (paymentStatus) params.set("paymentStatus", paymentStatus);
      if (registrationStatus) params.set("registrationStatus", registrationStatus);
      if (emailStatus) params.set("emailStatus", emailStatus);

      const data = await adminCmsFetch<{ items: PaymentRow[]; total: number }>(
        `payments?${params}`
      );
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [offset, search, dateFrom, dateTo, paymentStatus, registrationStatus, emailStatus]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <AdminPageHeader
        title="Payments"
        description="Registration payments, receipts, QR codes, and email delivery status."
      />

      <AdminCard className="mb-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <AdminInput
            label="Search"
            placeholder="ID, email, payment ID, order ID, mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AdminInput
            label="From date"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <AdminInput
            label="To date"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <AdminSelect
            label="Payment status"
            options={PAYMENT_STATUS_OPTS}
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
              setOffset(0);
            }}
          />
          <AdminSelect
            label="Registration status"
            options={REG_STATUS_OPTS}
            value={registrationStatus}
            onChange={(e) => {
              setRegistrationStatus(e.target.value);
              setOffset(0);
            }}
          />
          <AdminSelect
            label="Email status"
            options={EMAIL_STATUS_OPTS}
            value={emailStatus}
            onChange={(e) => {
              setEmailStatus(e.target.value);
              setOffset(0);
            }}
          />
          <div className="flex items-end">
            <AdminButton
              onClick={() => {
                setOffset(0);
                void load();
              }}
            >
              Apply filters
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {loading ? (
        <AdminLoading />
      ) : items.length === 0 ? (
        <AdminEmpty message="No payments match your filters." />
      ) : (
        <AdminCard className="overflow-x-auto p-0">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-3">Registration ID</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Applicant</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Order / Payment ID</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3">Reg.</th>
                <th className="px-3 py-3">Receipt</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">QR</th>
                <th className="px-3 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.registrationId} className="border-b border-slate-100">
                  <td className="px-3 py-2 font-mono text-xs">{row.registrationId}</td>
                  <td className="px-3 py-2">{row.registrationCategory}</td>
                  <td className="px-3 py-2">{row.applicantName}</td>
                  <td className="px-3 py-2 text-xs">
                    <div>{row.email}</div>
                    <div className="text-slate-500">{row.mobile}</div>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    <div>{row.razorpayOrderId ?? "—"}</div>
                    <div className="text-slate-500">{row.razorpayPaymentId ?? "—"}</div>
                  </td>
                  <td className="px-3 py-2 font-semibold">{formatInr(row.amount)}</td>
                  <td className="px-3 py-2">
                    <OpsStatusBadge value={row.paymentStatus} type="payment" />
                  </td>
                  <td className="px-3 py-2">{row.registrationStatus}</td>
                  <td className="px-3 py-2">
                    <OpsStatusBadge value={row.receiptStatus} type="receipt" />
                  </td>
                  <td className="px-3 py-2">
                    <OpsStatusBadge value={row.emailStatus} type="email" />
                  </td>
                  <td className="px-3 py-2">
                    <OpsStatusBadge value={row.qrStatus} type="qr" />
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {formatDateTime(row.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}

      <AdminPagination offset={offset} limit={limit} total={total} onPage={setOffset} />
    </div>
  );
}
