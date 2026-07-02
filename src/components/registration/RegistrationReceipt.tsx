"use client";

import ReceiptTemplate from "@/components/receipt/ReceiptTemplate";
import { type ReceiptData } from "@/lib/receipt/receipt-data";
import { buildRegistrationReceiptHtml } from "@/lib/receipt/registration-receipt";
import { renderReceiptHtmlToPdfDownload } from "@/lib/receipt/download-receipt-pdf-client";
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
    <div
      className={visible ? "mb-8 block print:block" : "hidden print:hidden"}
      id="registration-receipt-root"
    >
      <ReceiptTemplate data={data} qrDataUrl={qrDataUrl} />
    </div>
  );
}

export function printRegistrationReceipt(data: ReceiptData, qrDataUrl?: string | null) {
  printReceiptDocument(data, qrDataUrl);
}

function buildDownloadHtml(data: ReceiptData, qrDataUrl?: string | null) {
  return buildRegistrationReceiptHtml(data, window.location.origin, {
    autoPrint: false,
    embedLogos: true,
    qrDataUrl,
  });
}

/** Download PDF — generated in-browser from the same HTML as print (Hindi + 6.0, one page). */
export async function downloadRegistrationReceiptPdf(
  data: ReceiptData,
  options: { registrationId?: string; token?: string | null; qrDataUrl?: string | null } = {}
) {
  const id = options.registrationId ?? data.registrationId;
  const filename = `receipt-${id}.pdf`;

  try {
    const html = buildDownloadHtml(data, options.qrDataUrl);
    await renderReceiptHtmlToPdfDownload(html, filename);
    return;
  } catch (clientError) {
    console.warn("RECEIPT_CLIENT_PDF_FAILED", clientError);
  }

  if (!options.token) {
    throw new Error("Unable to download receipt PDF");
  }

  const params = new URLSearchParams({ id, format: "html" });
  params.set("token", options.token);

  const htmlRes = await fetch(`/api/v2/registration/receipt?${params.toString()}`);
  if (htmlRes.ok) {
    try {
      await renderReceiptHtmlToPdfDownload(await htmlRes.text(), filename);
      return;
    } catch {
      /* fall through to server PDF */
    }
  }

  const pdfParams = new URLSearchParams({ id, token: options.token });
  const res = await fetch(`/api/v2/registration/receipt?${pdfParams.toString()}`);
  if (!res.ok) {
    throw new Error("Unable to download receipt PDF");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
