import QRCode from "qrcode";
import { EVENT_NAME } from "@/types/registration";
import { SITE_URL } from "@/config/site";
import {
  generateReceiptPdfBuffer as generateReceiptPdfBufferShared,
} from "@/lib/receipt/generate-receipt-pdf";
import type { ReceiptPayload } from "@/lib/receipt/receipt-data";
import {
  buildRegistrationQrPayload,
  serializeQrPayload,
  type RegistrationQrPayload,
} from "@/lib/receipt/qr-payload";

export type { ReceiptPayload };

export async function generateRegistrationQrBuffer(
  input: RegistrationQrPayload | string,
  legacyOptions?: { fullName?: string; category?: string }
) {
  const payload =
    typeof input === "string"
      ? buildRegistrationQrPayload({
          registrationId: input,
          fullName: legacyOptions?.fullName ?? "",
          registrationType: "",
          category: legacyOptions?.category ?? "",
          institution: "",
          email: "",
          event: EVENT_NAME,
          verifyUrl: `${SITE_URL}/registration/success?id=${encodeURIComponent(input)}`,
        })
      : buildRegistrationQrPayload({
          ...input,
          event: input.event ?? EVENT_NAME,
          verifyUrl:
            input.verifyUrl ??
            `${SITE_URL}/registration/success?id=${encodeURIComponent(input.registrationId)}`,
        });

  return QRCode.toBuffer(serializeQrPayload(payload), {
    type: "png",
    width: 280,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}

export async function generateRegistrationQrDataUrl(
  input: RegistrationQrPayload | string,
  legacyOptions?: { fullName?: string; category?: string }
) {
  const buffer = await generateRegistrationQrBuffer(input, legacyOptions);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export function generateReceiptPdfBuffer(
  data: ReceiptPayload,
  qrPng?: Buffer | null
): Buffer {
  return generateReceiptPdfBufferShared(data, qrPng);
}

export function receiptDownloadUrl(registrationId: string, token?: string) {
  const params = new URLSearchParams({ id: registrationId });
  if (token) params.set("token", token);
  return `${SITE_URL}/registration/success?${params.toString()}`;
}

export function qrStoragePathFor(registrationId: string) {
  return `generated/qr/${registrationId}.png`;
}
