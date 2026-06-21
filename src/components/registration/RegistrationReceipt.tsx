"use client";

import ReceiptTemplate from "@/components/receipt/ReceiptTemplate";
import { type ReceiptData } from "@/lib/receipt/receipt-data";
import { downloadReceiptPdfClient } from "@/lib/receipt/receipt-pdf-client";
import { printReceiptDocument } from "@/lib/receipt/print-receipt";

export type { ReceiptData };
export { buildReceiptData } from "@/lib/receipt/receipt-data";

type RegistrationReceiptProps = {
  data: ReceiptData;
  /** When true, show on screen (success page preview). When false, hidden until print. */
  visible?: boolean;
};

export default function RegistrationReceipt({
  data,
  visible = false,
}: RegistrationReceiptProps) {
  return (
    <div className={visible ? "mb-8" : "hidden"} id="registration-receipt-root">
      <ReceiptTemplate data={data} />
    </div>
  );
}

export function printRegistrationReceipt(data: ReceiptData) {
  printReceiptDocument(data);
}

export async function downloadRegistrationReceiptPdf(data: ReceiptData) {
  await downloadReceiptPdfClient(data);
}
