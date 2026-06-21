import { EVENT_NAME } from "@/types/registration";
import { RECEIPT_ORG, type ReceiptData } from "@/lib/receipt/receipt-data";
import {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
  RECEIPT_LOGO_PATH,
  receiptLogoSrc,
} from "@/lib/receipt/receipt-logos";

export { RECEIPT_DHE_LOGO_PATH, RECEIPT_EVENT_LOGO_PATH, RECEIPT_LOGO_PATH };

export type ReceiptHtmlOptions = {
  /** Absolute origin for logo in print popup, e.g. https://www.shikshamahakumbh.com */
  origin?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rowHtml(label: string, value: string): string {
  return `<div style="display:flex;gap:8px;border-bottom:1px dotted #ccc;padding:4px 0">
    <span style="min-width:140px;font-weight:600;color:#1e3a5f">${escapeHtml(label)}</span>
    <span style="flex:1">${escapeHtml(value)}</span>
  </div>`;
}

function logoImg(path: string, alt: string, width: number, height: number, origin?: string) {
  const src = receiptLogoSrc(path, origin);
  return `<img src="${src}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" style="object-fit:contain" onerror="this.style.display='none'" />`;
}

/** Single HTML document for print — same fields as ReceiptTemplate.tsx */
export function buildReceiptHtmlDocument(
  data: ReceiptData,
  options: ReceiptHtmlOptions = {}
): string {
  const dheLogoBlock = logoImg(
    RECEIPT_DHE_LOGO_PATH,
    "Department of Holistic Education",
    72,
    72,
    options.origin
  );
  const eventLogoBlock = logoImg(
    RECEIPT_EVENT_LOGO_PATH,
    "Shiksha Mahakumbh",
    80,
    80,
    options.origin
  );

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>Receipt ${escapeHtml(data.registrationId)}</title>
<style>
  @page { size: A4 portrait; margin: 12mm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #111; margin: 0; padding: 16px; }
  .receipt { max-width: 720px; margin: 0 auto; border: 2px solid #1e3a5f; padding: 24px; page-break-inside: avoid; }
  h1 { font-size: 18px; text-transform: uppercase; color: #1e3a5f; margin: 16px 0 8px; }
  h2 { font-size: 14px; font-weight: bold; color: #1e3a5f; margin: 16px 0 8px; }
  .header-org { font-size: 18px; font-weight: bold; color: #b91c1c; text-transform: uppercase; }
</style></head><body>
<div class="receipt">
  <div style="text-align:center;border-bottom:1px solid #1e3a5f;padding-bottom:16px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;text-align:left;font-size:11px;gap:12px">
      <div>${dheLogoBlock}<p style="margin-top:8px"><strong>Regd. No. ${RECEIPT_ORG.regdNo}</strong><br/>PAN: ${RECEIPT_ORG.pan}</p></div>
      <div style="flex:1;text-align:center">
        <div class="header-org">Department of Holistic Education</div>
        <div style="font-size:11px">A Unit of Vidya Bharti Institute of Training and Research Trust</div>
        <div style="font-size:11px">${escapeHtml(RECEIPT_ORG.address)}</div>
        <div style="font-size:11px">Web: ${RECEIPT_ORG.web} · E-mail: ${RECEIPT_ORG.email}</div>
        <div style="font-size:11px;font-weight:bold;margin-top:4px">${escapeHtml(EVENT_NAME)}</div>
      </div>
      <div style="text-align:right">${eventLogoBlock}</div>
    </div>
    <h1>Registration Fee Receipt</h1>
  </div>
  ${rowHtml("Receipt No.", data.receiptNumber)}
  ${rowHtml("Registration ID", data.registrationId)}
  ${rowHtml("Date", data.date)}
  <h2>Registrant Details</h2>
  ${rowHtml("Name", data.fullName)}
  ${rowHtml("Category", data.category)}
  ${rowHtml("Institution", data.institution)}
  ${rowHtml("Email", data.email)}
  ${rowHtml("Phone", data.contactNumber)}
  <h2>Payment Details</h2>
  ${rowHtml("Amount", `₹${data.amount.toLocaleString("en-IN")}`)}
  ${rowHtml("Payment ID", data.paymentId ?? "—")}
  ${rowHtml("Order ID", data.orderId ?? "—")}
  ${rowHtml("Mode", data.paymentMode)}
  ${rowHtml("Transaction Date", data.transactionDate)}
  ${data.panNumber ? rowHtml("PAN", data.panNumber) : ""}
  <div style="margin-top:32px;display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid #1e3a5f;padding-top:16px">
    <div style="border:2px solid #1e3a5f;padding:12px 24px;font-weight:bold;color:#b91c1c">₹${data.amount.toLocaleString("en-IN")}</div>
    <div style="text-align:center;font-size:11px">
      <div style="border-bottom:1px solid #999;padding-bottom:4px;margin-bottom:32px">Authorized Signature</div>
      <strong>Department of Holistic Education</strong>
    </div>
  </div>
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}</script>
</body></html>`;
}

/** Field rows shared by PDF renderer — keep in sync with ReceiptTemplate sections */
export function getReceiptPdfSections(data: ReceiptData): Array<{ title?: string; lines: string[] }> {
  return [
    {
      lines: [
        `Receipt No.: ${data.receiptNumber}`,
        `Registration ID: ${data.registrationId}`,
        `Date: ${data.date}`,
      ],
    },
    {
      title: "Registrant Details",
      lines: [
        `Name: ${data.fullName}`,
        `Category: ${data.category}`,
        `Institution: ${data.institution}`,
        `Email: ${data.email}`,
        `Phone: ${data.contactNumber}`,
      ],
    },
    {
      title: "Payment Details",
      lines: [
        `Amount: ₹${data.amount.toLocaleString("en-IN")}`,
        `Payment ID: ${data.paymentId ?? "—"}`,
        `Order ID: ${data.orderId ?? "—"}`,
        `Mode: ${data.paymentMode}`,
        `Transaction Date: ${data.transactionDate}`,
        ...(data.panNumber ? [`PAN: ${data.panNumber}`] : []),
      ],
    },
  ];
}
