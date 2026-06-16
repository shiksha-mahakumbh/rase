import { EVENT_NAME } from "@/types/registration";

export type ReceiptData = {
  receiptNumber: string;
  registrationId: string;
  date: string;
  fullName: string;
  category: string;
  institution: string;
  email: string;
  contactNumber: string;
  amount: number;
  paymentId?: string;
  orderId?: string;
  paymentMode: string;
  transactionDate: string;
  panNumber?: string;
};

export type ReceiptPayload = {
  registrationId: string;
  fullName: string;
  category: string;
  institution: string;
  email: string;
  contactNumber: string;
  amount: number;
  paymentId?: string;
  orderId?: string;
  panNumber?: string;
  transactionDate?: string | Date;
};

export function receiptNumberFromId(publicId: string): string {
  return publicId.replace(/^SMK/, "RCP");
}

export function formatReceiptDate(value?: string | Date): string {
  const d = value ? new Date(value) : new Date();
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function buildReceiptData(payload: ReceiptPayload): ReceiptData {
  const hasRazorpay = Boolean(payload.paymentId);
  return {
    receiptNumber: receiptNumberFromId(payload.registrationId),
    registrationId: payload.registrationId,
    date: formatReceiptDate(payload.transactionDate),
    fullName: payload.fullName,
    category: payload.category,
    institution: payload.institution,
    email: payload.email,
    contactNumber: payload.contactNumber,
    amount: payload.amount,
    paymentId: payload.paymentId,
    orderId: payload.orderId,
    paymentMode: hasRazorpay
      ? "Online (Razorpay)"
      : payload.amount > 0
        ? "Manual / UTR"
        : "Not applicable",
    transactionDate: formatReceiptDate(payload.transactionDate),
    panNumber: payload.panNumber,
  };
}

export const RECEIPT_ORG = {
  regdNo: "6401",
  pan: "AAETV1652K",
  address: "E-7, Orchid Towers, Sector 125, Sunny Enclave, SAS Nagar, Punjab-140301",
  web: "dhe.org.in",
  email: "director@dhe.org.in",
  eventName: EVENT_NAME,
} as const;
