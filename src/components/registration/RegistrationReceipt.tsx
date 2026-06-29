"use client";

import ReceiptTemplate from "@/components/receipt/ReceiptTemplate";
import { type ReceiptData } from "@/lib/receipt/receipt-data";
import { printReceiptDocument } from "@/lib/receipt/print-receipt";

export type { ReceiptData };
export { buildReceiptData } from "@/lib/receipt/receipt-data";

type RegistrationReceiptProps = {
  data: ReceiptData;
  qrDataUrl?: string | null;
  visible?: boolean;
};

export default function RegistrationReceipt({
  data,
  qrDataUrl,
  visible = false,
}: RegistrationReceiptProps) {
  return (
    <div className={visible ? "mb-8 print:hidden" : "hidden"} id="registration-receipt-root">
      <ReceiptTemplate data={data} qrDataUrl={qrDataUrl} />
    </div>
  );
}

export function printRegistrationReceipt(data: ReceiptData, qrDataUrl?: string | null) {
  printReceiptDocument(data, qrDataUrl);
}

export async function downloadRegistrationReceiptPdf(
  data: ReceiptData,
  options: { registrationId?: string; token?: string | null; qrDataUrl?: string | null } = {}
) {
  const id = options.registrationId ?? data.registrationId;
  const params = new URLSearchParams({ id });
  if (options.token) params.set("token", options.token);

  const res = await fetch(`/api/registration/receipt?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Unable to download receipt PDF");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `receipt-${id}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}
