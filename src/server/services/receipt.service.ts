import { SITE_URL } from "@/config/site";
import type { ReceiptPayload } from "@/lib/receipt/receipt-data";
import {
  generateRegistrationQrBuffer,
  generateRegistrationQrDataUrl,
} from "@/server/services/receipt-qr.service";

export type { ReceiptPayload };
export { generateRegistrationQrBuffer, generateRegistrationQrDataUrl };

export async function generateReceiptPdfBuffer(
  data: ReceiptPayload,
  qrPng?: Buffer | null
): Promise<Buffer> {
  const { generateReceiptPdfBuffer: generateReceiptPdfBufferShared } = await import(
    "@/lib/receipt/receipt-pdf-server"
  );
  return generateReceiptPdfBufferShared(data, qrPng);
}

export async function buildRegistrationArtifacts(
  payload: ReceiptPayload,
  options: { registrationType?: string } = {}
) {
  const qrPng = await generateRegistrationQrBuffer({
    registrationId: payload.registrationId,
    fullName: payload.fullName,
    registrationType: options.registrationType ?? "",
    category: payload.category,
    institution: payload.institution,
    email: payload.email,
  });
  const receiptPdf = await generateReceiptPdfBuffer(payload, qrPng);
  const qrDataUrl = `data:image/png;base64,${qrPng.toString("base64")}`;
  return { qrPng, receiptPdf, qrDataUrl };
}

export function receiptDownloadUrl(registrationId: string, token?: string) {
  const params = new URLSearchParams({ id: registrationId });
  if (token) params.set("token", token);
  return `${SITE_URL}/registration/success?${params.toString()}`;
}

export function qrStoragePathFor(registrationId: string) {
  return `generated/qr/${registrationId}.png`;
}
