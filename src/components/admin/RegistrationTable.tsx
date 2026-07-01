"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RegistrationRow } from "@/lib/exportRegistrations";
import { formatRegistrationDate } from "@/lib/format-date";
import {
  displayAccommodationStatus,
  displayPaymentStatus,
  displayRegistrationStatus,
} from "@/lib/admin/registration-labels";

interface RegistrationTableProps {
  rows: RegistrationRow[];
  selected: Set<string>;
  onSelectChange: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

export default function RegistrationTable({
  rows,
  selected,
  onSelectChange,
  onSelectAll,
}: RegistrationTableProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [sortKey, setSortKey] = useState<keyof RegistrationRow>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const types = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.registrationType).filter(Boolean))
      ) as string[],
    [rows]
  );

  const filtered = useMemo(() => {
    let result = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.registrationId?.toLowerCase().includes(q) ||
          r.fullName?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.contactNumber?.includes(q)
      );
    }

    if (typeFilter) {
      result = result.filter((r) => r.registrationType === typeFilter);
    }

    if (emailFilter) {
      result = result.filter((r) => {
        const status = (r.emailDeliveryStatus as string) ?? "none";
        return status === emailFilter;
      });
    }

    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [rows, search, typeFilter, emailFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: keyof RegistrationRow) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-3 border-b border-gray-100 p-4">
        <input
          type="search"
          placeholder="Search by ID, name, email, phone..."
          className="min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={emailFilter}
          onChange={(e) => {
            setEmailFilter(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by email delivery status"
        >
          <option value="">All email logs</option>
          <option value="sent">Email sent</option>
          <option value="failed">Email failed</option>
          <option value="pending">Email pending</option>
          <option value="skipped">Email skipped</option>
          <option value="none">No email log</option>
        </select>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {paginated.map((row) => (
          <article
            key={row.id}
            className="rounded-xl border border-gray-200 bg-gray-50/50 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(row.id)}
                  onChange={(e) => onSelectChange(row.id, e.target.checked)}
                />
                <span className="font-mono text-xs font-semibold text-primary">
                  {row.registrationId}
                </span>
              </label>
              <Link
                href={`/admin/registrations/${row.registrationId}`}
                className="text-sm font-semibold text-primary"
              >
                View
              </Link>
            </div>
            <p className="mt-2 font-medium">{row.fullName}</p>
            <p className="text-xs text-gray-500">{row.registrationType}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <StatusBadge value={row.paymentStatus} kind="payment" />
              <StatusBadge value={row.accommodationStatus} kind="accommodation" />
              {row.emailDeliveryStatus && (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 font-semibold text-slate-700">
                  Email: {String(row.emailDeliveryStatus)}
                </span>
              )}
            </div>
          </article>
        ))}
        {!paginated.length && (
          <p className="py-8 text-center text-gray-500">No registrations found</p>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all registrations on this page"
                  checked={
                    paginated.length > 0 &&
                    paginated.every((r) => selected.has(r.id))
                  }
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              {[
                ["registrationId", "Registration ID"],
                ["fullName", "Name"],
                ["registrationType", "Type"],
                ["category", "Category"],
                ["email", "Email"],
                ["contactNumber", "Phone"],
                ["paymentStatus", "Payment"],
                ["accommodationStatus", "Accommodation"],
                ["createdAt", "Submitted"],
              ].map(([key, label]) => (
                <th
                  key={key}
                  className="cursor-pointer px-4 py-3 hover:text-primary"
                  onClick={() => toggleSort(key as keyof RegistrationRow)}
                >
                  {label}
                  {sortKey === key && (sortDir === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={(e) => onSelectChange(row.id, e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {row.registrationId}
                </td>
                <td className="px-4 py-3">{row.fullName}</td>
                <td className="px-4 py-3">{row.registrationType}</td>
                <td className="px-4 py-3">{row.category ?? "—"}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{row.contactNumber}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={row.paymentStatus} kind="payment" />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={row.accommodationStatus} kind="accommodation" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatRegistrationDate(row.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/registrations/${row.registrationId}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {!paginated.length && (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-gray-500">
                  No registrations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm">
        <span>
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ value, kind }: { value?: string; kind?: "payment" | "accommodation" | "registration" }) {
  const raw = value ?? "";
  const display =
    kind === "registration"
      ? displayRegistrationStatus(raw)
      : kind === "accommodation"
        ? displayAccommodationStatus(raw)
        : displayPaymentStatus(raw);

  const colors: Record<string, string> = {
    Paid: "bg-green-100 text-green-800",
    "Pending Payment": "bg-amber-100 text-amber-800",
    Submitted: "bg-sky-100 text-sky-800",
    Failed: "bg-red-100 text-red-800",
    "Not Required": "bg-gray-100 text-gray-600",
    Pending: "bg-amber-100 text-amber-800",
    Verified: "bg-blue-100 text-blue-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Allocated: "bg-purple-100 text-purple-800",
    Requested: "bg-amber-100 text-amber-800",
  };

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
        colors[display] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {display || "—"}
    </span>
  );
}
