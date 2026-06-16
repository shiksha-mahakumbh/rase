import { EVENT_NAME } from "@/types/registration";
import { RECEIPT_ORG, type ReceiptData } from "@/lib/receipt/receipt-data";
import {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
} from "@/lib/receipt/receipt-logos";

export type ReceiptTemplateProps = {
  data: ReceiptData;
  /** Optional QR image data URL for screen / print */
  qrDataUrl?: string | null;
  /** Root element id — used by print handler */
  id?: string;
  className?: string;
};

export default function ReceiptTemplate({
  data,
  qrDataUrl,
  id = "registration-receipt",
  className = "",
}: ReceiptTemplateProps) {
  return (
    <div
      id={id}
      className={`mx-auto max-w-[720px] border-2 border-brand-navy/20 bg-white p-6 text-sm text-gray-900 print:m-0 print:border-black print:p-4 print:[break-inside:avoid] ${className}`}
    >
      <header className="border-b border-brand-navy/30 pb-4 text-center">
        <div className="flex items-start justify-between gap-4">
          <div className="text-left text-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={RECEIPT_DHE_LOGO_PATH}
              alt="Department of Holistic Education"
              width={72}
              height={72}
              className="mb-2 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <p className="font-semibold text-brand-navy">Regd. No. {RECEIPT_ORG.regdNo}</p>
            <p>PAN: {RECEIPT_ORG.pan}</p>
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold uppercase text-red-700">
              Department of Holistic Education
            </p>
            <p className="text-xs font-semibold text-brand-navy">
              A Unit of Vidya Bharti Institute of Training and Research Trust
            </p>
            <p className="mt-1 text-xs">{RECEIPT_ORG.address}</p>
            <p className="text-xs">
              Web: {RECEIPT_ORG.web} · E-mail: {RECEIPT_ORG.email}
            </p>
            <p className="mt-1 text-xs font-bold text-brand-navy">{EVENT_NAME}</p>
          </div>
          <div className="text-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={RECEIPT_EVENT_LOGO_PATH}
              alt="Shiksha Mahakumbh"
              width={80}
              height={80}
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
        <h1 className="mt-4 text-xl font-extrabold uppercase tracking-wide text-brand-navy">
          Registration Fee Receipt
        </h1>
      </header>

      <section className="mt-4 grid gap-2 text-sm">
        <ReceiptRow label="Receipt No." value={data.receiptNumber} />
        <ReceiptRow label="Registration ID" value={data.registrationId} />
        <ReceiptRow label="Date" value={data.date} />
      </section>

      <section className="mt-4 border-t border-dashed border-gray-400 pt-4">
        <h2 className="mb-2 font-bold text-brand-navy">Registrant Details</h2>
        <ReceiptRow label="Name" value={data.fullName} />
        <ReceiptRow label="Category" value={data.category} />
        <ReceiptRow label="Institution" value={data.institution} />
        <ReceiptRow label="Email" value={data.email} />
        <ReceiptRow label="Phone" value={data.contactNumber} />
      </section>

      <section className="mt-4 border-t border-dashed border-gray-400 pt-4">
        <h2 className="mb-2 font-bold text-brand-navy">Payment Details</h2>
        <ReceiptRow label="Amount" value={`₹${data.amount.toLocaleString("en-IN")}`} />
        <ReceiptRow label="Payment ID" value={data.paymentId ?? "—"} />
        <ReceiptRow label="Order ID" value={data.orderId ?? "—"} />
        <ReceiptRow label="Mode" value={data.paymentMode} />
        <ReceiptRow label="Transaction Date" value={data.transactionDate} />
        {data.panNumber ? <ReceiptRow label="PAN" value={data.panNumber} /> : null}
      </section>

      {qrDataUrl ? (
        <section className="mt-6 flex flex-col items-center border-t border-dashed border-gray-400 pt-4 print:[break-inside:avoid]">
          <h2 className="mb-2 font-bold text-brand-navy">Entry QR Code</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt={`QR code for ${data.registrationId}`}
            width={160}
            height={160}
            className="rounded border border-gray-300 bg-white p-2"
          />
          <p className="mt-2 text-xs text-gray-600">Show at event check-in</p>
        </section>
      ) : null}

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

export function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-dotted border-gray-300 py-1">
      <span className="min-w-[140px] font-semibold text-brand-navy">{label}</span>
      <span className="flex-1">{value}</span>
    </div>
  );
}
