/** Single source for receipt logo asset paths */
export const RECEIPT_DHE_LOGO_PATH = "/images/dhe-logo.png";
export const RECEIPT_EVENT_LOGO_PATH = "/images/shiksha-mahakumbh-logo.png";

/** @deprecated Use RECEIPT_DHE_LOGO_PATH */
export const RECEIPT_LOGO_PATH = RECEIPT_DHE_LOGO_PATH;

export function receiptLogoSrc(path: string, origin?: string): string {
  return origin ? `${origin}${path}` : path;
}
