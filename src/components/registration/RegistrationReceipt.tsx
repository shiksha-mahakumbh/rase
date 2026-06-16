"use client";

import { EVENT_NAME } from "@/types/registration";
import {
  buildReceiptData,
  type ReceiptData,
} from "@/lib/receipt/receipt-data";
import { downloadReceiptPdfClient } from "@/lib/receipt/generate-receipt-pdf";

export type { ReceiptData };

export default function RegistrationReceipt({ data }: { data: ReceiptData }) {
  return (
    <div
      id="registration-receipt"
      className="mx-auto max-w-[720px] border-2 border-brand-navy/20 bg-white p-6 text-sm text-gray-900 print:m-0 print:max-h-[277mm] print:border-black print:p-4 print:[break-inside:avoid]"
    >
      <header className="border-b border-brand-navy/30 pb-4 text-center">
        <div className="flex items-start justify-between gap-4">
          <div className="text-left text-xs">
            <p className="font-semibold text-brand-navy">Regd. No. 6401</p>
            <p>PAN: AAETV1652K</p>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold uppercase text-red-700">
              Department of Holistic Education
            </p>
            <p className="text-xs font-semibold text-brand-navy">
              A Unit of Vidya Bharti Institute of Training and Research Trust
            </p>
            <p className="mt-1 text-xs">
              E-7, Orchid Towers, Sector 125, Sunny Enclave, SAS Nagar, Punjab-140301
            </p>
            <p className="text-xs">Web: dhe.org.in · E-mail: director@dhe.org.in</p>
          </div>
          <div className="text-right text-xs font-bold text-brand-navy">
            {EVENT_NAME}
          </div>
        </div>
        <h1 className="mt-4 text-xl font-extrabold uppercase tracking-wide text-brand-navy">
          Registration Fee Receipt
        </h1>
      </header>

      <section className="mt-4 grid gap-2 text-sm">
        <Row label="Receipt No." value={data.receiptNumber} />
        <Row label="Registration ID" value={data.registrationId} />
        <Row label="Date" value={data.date} />
      </section>

      <section className="mt-4 border-t border-dashed border-gray-400 pt-4">
        <h2 className="mb-2 font-bold text-brand-navy">Registrant Details</h2>
        <Row label="Name" value={data.fullName} />
        <Row label="Category" value={data.category} />
        <Row label="Institution" value={data.institution} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.contactNumber} />
      </section>

      <section className="mt-4 border-t border-dashed border-gray-400 pt-4">
        <h2 className="mb-2 font-bold text-brand-navy">Payment Details</h2>
        <Row label="Amount" value={`₹${data.amount.toLocaleString("en-IN")}`} />
        <Row label="Payment ID" value={data.paymentId ?? "—"} />
        <Row label="Order ID" value={data.orderId ?? "—"} />
        <Row label="Mode" value={data.paymentMode} />
        <Row label="Transaction Date" value={data.transactionDate} />
        {data.panNumber ? <Row label="PAN" value={data.panNumber} /> : null}
      </section>

      <footer className="mt-8 flex items-end justify-between border-t border-brand-navy/30 pt-6">
        <div className="rounded border-2 border-brand-navy px-6 py-3 text-center font-bold text-red-700">
          ₹{data.amount.toLocaleString("en-IN")}
        </div>
        <div className="text-center text-xs">
          <div className="mb-8 border-b border-gray-400 pb-1">Authorized Signature</div>
          <p className="font-semibold text-brand-navy">Department of Holistic Education</p>
        </div>
      </footer>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-dotted border-gray-300 py-1">
      <span className="min-w-[140px] font-semibold text-brand-navy">{label}</span>
      <span className="flex-1">{value}</span>
    </div>
  );
}

export function printRegistrationReceipt() {
  const style = document.createElement("style");
  style.id = "registration-receipt-print";
  style.textContent = `@media print {
    @page { size: A4 portrait; margin: 10mm; }
    html, body { height: auto !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; }
    body * { visibility: hidden !important; }
    #registration-receipt, #registration-receipt * { visibility: visible !important; }
    #registration-receipt {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    nav, header, footer, main > :not(#registration-receipt-root) { display: none !important; }
  }`;
  document.head.appendChild(style);
  window.print();
  window.setTimeout(() => {
    document.getElementById("registration-receipt-print")?.remove();
  }, 1000);
}

export async function downloadRegistrationReceiptPdf(data: ReceiptData) {
  await downloadReceiptPdfClient(data);
}

export { buildReceiptData };
