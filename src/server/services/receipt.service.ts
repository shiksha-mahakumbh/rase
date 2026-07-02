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
  const { generateReceiptPdfBufferFromData } = await import("@/lib/receipt/receipt-pdf-server");
  return generateReceiptPdfBufferFromData(
    (await import("@/lib/receipt/receipt-data")).buildReceiptData(data),
    qrPng
  );
}

async function generateEmailReceiptPdf(
  payload: ReceiptPayload,
  qrPng: Buffer
): Promise<Buffer> {
  const { generateReceiptPdfBufferForEmail } = await import("@/lib/receipt/receipt-pdf-server");
  return generateReceiptPdfBufferForEmail(payload, qrPng);
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
  const receiptPdf = await generateEmailReceiptPdf(payload, qrPng);
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
