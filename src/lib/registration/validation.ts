/** Shared registration field validators */

export const PHONE_REGEX = /^\d{10}$/;
export const PAN_REGEX = /^[A-Z]{5}\d{4}[A-Z]$/;

export function normalizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function isValidPhone(value: string): boolean {
  return PHONE_REGEX.test(value);
}

export function isValidPan(value: string): boolean {
  return PAN_REGEX.test(value.toUpperCase());
}

export function panRequiredForAmount(amount: number): boolean {
  return amount >= 2000;
}

export function validatePanForAmount(
  pan: string | undefined,
  amount: number
): string | null {
  if (!panRequiredForAmount(amount)) {
    if (pan?.trim() && !isValidPan(pan)) {
      return "PAN must match format ABCDE1234F";
    }
    return null;
  }
  if (!pan?.trim()) return "PAN is required for payments of ₹2000 or more";
  if (!isValidPan(pan)) return "PAN must match format ABCDE1234F";
  return null;
}
