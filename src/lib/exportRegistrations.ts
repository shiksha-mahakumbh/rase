import * as XLSX from "xlsx";
import { formatFirestoreDate } from "@/lib/saveRegistration";

export interface RegistrationRow {
  id: string;
  registrationId?: string;
  fullName?: string;
  registrationType?: string;
  category?: string;
  email?: string;
  contactNumber?: string;
  paymentStatus?: string;
  accommodationStatus?: string;
  createdAt?: unknown;
  [key: string]: unknown;
}

export function registrationsToCsv(rows: RegistrationRow[]): string {
  const headers = [
    "Registration ID",
    "Name",
    "Registration Type",
    "Category",
    "Email",
    "Phone",
    "Payment Status",
    "Accommodation Status",
    "Submission Date",
  ];

  const lines = rows.map((r) =>
    [
      r.registrationId ?? "",
      r.fullName ?? "",
      r.registrationType ?? "",
      r.category ?? "",
      r.email ?? "",
      r.contactNumber ?? "",
      r.paymentStatus ?? "",
      r.accommodationStatus ?? "",
      formatFirestoreDate(r.createdAt),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...lines].join("\n");
}

export function downloadCsv(rows: RegistrationRow[], filename: string) {
  const csv = registrationsToCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}

export function downloadExcel(rows: RegistrationRow[], filename: string) {
  const data = rows.map((r) => ({
    "Registration ID": r.registrationId,
    Name: r.fullName,
    "Registration Type": r.registrationType,
    Category: r.category,
    Email: r.email,
    Phone: r.contactNumber,
    "Payment Status": r.paymentStatus,
    "Accommodation Status": r.accommodationStatus,
    "Submission Date": formatFirestoreDate(r.createdAt),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registrations");
  XLSX.writeFile(wb, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function isToday(timestamp: unknown): boolean {
  if (!timestamp || typeof timestamp !== "object") return false;
  const date =
    "toDate" in timestamp && typeof timestamp.toDate === "function"
      ? timestamp.toDate()
      : null;
  if (!date) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
