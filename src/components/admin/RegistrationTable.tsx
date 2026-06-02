"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RegistrationRow } from "@/lib/exportRegistrations";
import { formatFirestoreDate } from "@/lib/saveRegistration";

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
  }, [rows, search, typeFilter, sortKey, sortDir]);

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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
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
                  <StatusBadge value={row.paymentStatus} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={row.accommodationStatus} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatFirestoreDate(row.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/registrations/${row.id}`}
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

function StatusBadge({ value }: { value?: string }) {
  const colors: Record<string, string> = {
    Paid: "bg-green-100 text-green-800",
    Pending: "bg-amber-100 text-amber-800",
    Failed: "bg-red-100 text-red-800",
    Verified: "bg-blue-100 text-blue-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Allocated: "bg-purple-100 text-purple-800",
    Requested: "bg-amber-100 text-amber-800",
    "Not Required": "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
        colors[value ?? ""] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {value ?? "—"}
    </span>
  );
}
