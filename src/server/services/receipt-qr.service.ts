import QRCode from "qrcode";
import { EVENT_NAME } from "@/types/registration";
import { SITE_URL } from "@/config/site";
import {
  buildRegistrationQrPayload,
  serializeQrPayload,
  type RegistrationQrPayload,
} from "@/lib/receipt/qr-payload";

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
