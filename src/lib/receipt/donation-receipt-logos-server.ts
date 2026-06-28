import fs from "node:fs";
import path from "node:path";
import {
  RECEIPT_DHE_LOGO_PATH,
  RECEIPT_EVENT_LOGO_PATH,
} from "@/lib/receipt/receipt-logos";

const LOGO_FILES = {
  dhe: "images/dhe-logo.png",
  event: "images/shiksha-mahakumbh-logo.png",
} as const;

function loadLogo(relativePath: string): Buffer | null {
  try {
    const file = path.join(process.cwd(), "public", relativePath);
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file);
  } catch {
    return null;
  }
}

function detectMime(buf: Buffer): "image/jpeg" | "image/png" {
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) return "image/jpeg";
  return "image/png";
}

export function receiptLogoDataUrl(relativePath: string): string | null {
  const buf = loadLogo(relativePath);
  if (!buf) return null;
  const mime = detectMime(buf);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export function receiptLogoBase64(relativePath: string): { data: string; mime: "image/jpeg" | "image/png" } | null {
  const buf = loadLogo(relativePath);
  if (!buf) return null;
  return { data: buf.toString("base64"), mime: detectMime(buf) };
}

export function loadDonationReceiptLogoAssets(): {
  dheDataUrl: string | null;
  eventDataUrl: string | null;
  dheBase64: string | null;
  dheMime: "image/jpeg" | "image/png" | null;
  eventBase64: string | null;
  eventMime: "image/jpeg" | "image/png" | null;
} {
  const dhe = receiptLogoBase64(LOGO_FILES.dhe);
  const event = receiptLogoBase64(LOGO_FILES.event);
  return {
    dheDataUrl: receiptLogoDataUrl(LOGO_FILES.dhe),
    eventDataUrl: receiptLogoDataUrl(LOGO_FILES.event),
    dheBase64: dhe?.data ?? null,
    dheMime: dhe?.mime ?? null,
    eventBase64: event?.data ?? null,
    eventMime: event?.mime ?? null,
  };
}

export { RECEIPT_DHE_LOGO_PATH, RECEIPT_EVENT_LOGO_PATH };
