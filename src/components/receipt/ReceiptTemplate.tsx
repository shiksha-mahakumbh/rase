"use client";

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

/** On-screen / print receipt — layout matches PDF download (single page). */
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
      className={`mx-auto max-w-[190mm] overflow-hidden rounded-lg border-2 border-[#1E3A5F] border-t-4 border-t-[#FF9933] bg-white px-[18px] py-[14px] text-[12px] text-[#1E293B] shadow-lg print:m-0 print:max-w-none print:rounded-none print:border print:border-[#ccc] print:shadow-none print:[break-inside:avoid] print:[page-break-inside:avoid] ${className}`}
    >
      <header className="flex items-start justify-between gap-2.5 border-b-2 border-[#1E3A5F] pb-2.5">
        <div className="flex w-[72px] shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={RECEIPT_DHE_LOGO_PATH}
            alt="Department of Holistic Education"
            width={72}
            height={72}
            className="h-[72px] w-[72px] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        <div className="min-w-0 flex-1 text-center leading-snug">
          <p className="text-[9px] text-slate-500">
            <strong>Regd. No. {org.regdNo}</strong> | Date: {org.regdDate} | PAN: {org.pan}
          </p>
          <p className="mt-0.5 font-bold text-[#B45309] [font-family:'Noto_Sans_Devanagari',Mangal,sans-serif] text-[15px]">
            {org.campaignHi}
          </p>
          <p className="text-[11px] font-bold tracking-wide text-[#0B1F3B]">{org.department}</p>
          <p className="text-[8px] uppercase tracking-wider text-slate-500">{org.unitLine}</p>
          <p className="text-[9px] font-bold leading-tight text-[#1E3A5F]">{org.trustName}</p>
          <p className="mt-0.5 text-[8.5px] text-slate-500">
            {org.addressLine1}
            <br />
            {org.addressLine2}
            <br />
            Web. {org.web}, E-mail: {org.email}
          </p>
        </div>

        <div className="flex w-[72px] shrink-0 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={RECEIPT_EVENT_LOGO_PATH}
            alt="Shiksha Mahakumbh"
            width={72}
            height={72}
            className="h-[72px] w-[72px] object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </header>

      <div className="my-2.5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 rounded-md bg-gradient-to-r from-[#0B1F3B] to-[#1E3A5F] px-2.5 py-2">
          <h1 className="text-left text-[14px] font-bold uppercase leading-snug tracking-wide text-white">
            {registrationReceiptTitle(data.amount)}
          </h1>
        </div>
        {qrDataUrl ? (
          <div className="w-[108px] shrink-0 text-right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="Registration QR code"
              width={100}
              height={100}
              className="ml-auto h-[100px] w-[100px] object-contain"
            />
            <p className="mt-1 text-[8.5px] leading-snug text-slate-500">
              Venue check-in
              <br />
              {data.registrationId}
            </p>
          </div>
        ) : null}
      </div>

      <table className="w-full border-collapse text-[11px]">
        <tbody>
          {getRegistrationReceiptRows(data).map((row) => (
            <tr key={row.label} className="border-b border-dotted border-slate-300 even:bg-[#FFFBF5]">
              <td className="w-[34%] whitespace-nowrap px-1.5 py-1 font-semibold text-[#1E3A5F]">
                {row.label}
              </td>
              <td className="px-1.5 py-1 leading-snug">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-2.5 rounded-md border border-[#FF9933] border-l-4 border-l-[#B45309] bg-gradient-to-br from-[#FFFBF5] to-white px-3 py-2.5 text-center [font-family:'Noto_Sans_Devanagari',Mangal,sans-serif]">
        <h2 className="text-[13px] font-bold text-[#0B1F3B]">{thanks.heading}</h2>
        {thanks.lines.map((line) => (
          <p key={line} className="mt-1 text-[10.5px] leading-snug text-[#1E293B]">
            {line}
          </p>
        ))}
      </div>

      <p className="text-center text-[9px] text-slate-500">
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
