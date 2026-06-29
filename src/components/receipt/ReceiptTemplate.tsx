import { EVENT_NAME } from "@/types/registration";
import { type ReceiptData } from "@/lib/receipt/receipt-data";
import { DONATION_RECEIPT_ORG } from "@/lib/receipt/donation-receipt-layout";
import {
  REGISTRATION_RECEIPT_THANKS,
  getRegistrationReceiptRows,
  registrationReceiptTitle,
} from "@/lib/receipt/registration-receipt-layout";
import {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
} from "@/lib/receipt/receipt-logos";

export type ReceiptTemplateProps = {
  data: ReceiptData;
  qrDataUrl?: string | null;
  id?: string;
  className?: string;
};

export default function ReceiptTemplate({
  data,
  qrDataUrl,
  id = "registration-receipt",
  className = "",
}: ReceiptTemplateProps) {
  const org = DONATION_RECEIPT_ORG;
  const thanks = REGISTRATION_RECEIPT_THANKS;

  return (
    <div
      id={id}
      className={`mx-auto max-w-[720px] overflow-hidden rounded-lg border-2 border-[#1E3A5F] border-t-4 border-t-[#FF9933] bg-white p-6 text-sm text-[#1E293B] shadow-lg print:m-0 print:rounded-none print:border-black print:shadow-none print:[break-inside:avoid] ${className}`}
    >
      <header className="flex items-start justify-between gap-3 border-b-2 border-[#1E3A5F] pb-4">
        <div className="flex w-[84px] shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={RECEIPT_DHE_LOGO_PATH}
            alt="Department of Holistic Education"
            width={84}
            height={84}
            className="h-[84px] w-[84px] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        <div className="min-w-0 flex-1 text-center leading-snug">
          <p className="text-[10px] text-slate-500">
            <strong>Regd. No. {org.regdNo}</strong> | Date: {org.regdDate} | PAN: {org.pan}
          </p>
          <p className="mt-1 font-bold text-[#B45309] [font-family:'Noto_Sans_Devanagari',Mangal,sans-serif] text-lg">
            {org.campaignHi}
          </p>
          <p className="text-xs font-bold tracking-wide text-[#0B1F3B]">{org.department}</p>
          <p className="text-[9px] uppercase tracking-wider text-slate-500">{org.unitLine}</p>
          <p className="text-[10px] font-bold leading-tight text-[#1E3A5F]">{org.trustName}</p>
          <p className="mt-1 text-[9.5px] text-slate-500">
            {org.addressLine1}
            <br />
            {org.addressLine2}
            <br />
            Web. {org.web}, E-mail: {org.email}
          </p>
        </div>

        <div className="flex w-[84px] shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={RECEIPT_EVENT_LOGO_PATH}
            alt="Shiksha Mahakumbh"
            width={84}
            height={84}
            className="h-[84px] w-[84px] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </header>

      <div className="my-4 rounded-lg bg-gradient-to-r from-[#0B1F3B] to-[#1E3A5F] px-3 py-2.5 text-center">
        <h1 className="text-base font-bold uppercase tracking-wide text-white">
          {registrationReceiptTitle(data.amount)}
        </h1>
      </div>

      <table className="w-full border-collapse text-sm">
        <tbody>
          {getRegistrationReceiptRows(data).map((row) => (
            <tr key={row.label} className="border-b border-dotted border-slate-300 even:bg-[#FFFBF5]">
              <td className="w-[38%] whitespace-nowrap px-2 py-2 font-semibold text-[#1E3A5F]">
                {row.label}
              </td>
              <td className="px-2 py-2">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {qrDataUrl ? (
        <div className="my-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrDataUrl}
            alt="Registration QR code"
            width={160}
            height={160}
            className="mx-auto h-40 w-40 object-contain"
          />
          <p className="mt-2 text-xs text-slate-500">
            Scan at venue check-in · {data.registrationId} · {EVENT_NAME}
          </p>
        </div>
      ) : null}

      <div className="my-4 rounded-lg border border-[#FF9933] border-l-4 border-l-[#B45309] bg-gradient-to-br from-[#FFFBF5] to-white p-4 text-center [font-family:'Noto_Sans_Devanagari',Mangal,sans-serif]">
        <h2 className="text-base font-bold text-[#0B1F3B]">{thanks.heading}</h2>
        {thanks.lines.map((line) => (
          <p key={line} className="mt-2 text-[12.5px] leading-relaxed text-[#1E293B]">
            {line}
          </p>
        ))}
      </div>

      <p className="text-center text-[10px] text-slate-500">
        This is a computer-generated receipt for {EVENT_NAME}. No physical signature is required.
      </p>
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
