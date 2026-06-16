/** Razorpay order notes — max 15 keys, 256 chars per value */
export type RazorpayOrderNotesInput = {
  registrationType: string;
  fullName?: string;
  email?: string;
  phone?: string;
  institution?: string;
  category?: string;
  amount?: string | number;
  registrationId?: string;
};

function clip(value: string, max = 255): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

export function buildRazorpayOrderNotes(input: RazorpayOrderNotesInput): Record<string, string> {
  const notes: Record<string, string> = {
    registrationType: clip(input.registrationType),
    paymentPurpose: clip(`${input.registrationType} registration fee`),
  };

  if (input.fullName?.trim()) notes.fullName = clip(input.fullName.trim());
  if (input.email?.trim()) notes.email = clip(input.email.trim());
  if (input.phone?.trim()) notes.phone = clip(input.phone.trim());
  if (input.institution?.trim()) notes.institution = clip(input.institution.trim());
  if (input.category?.trim()) notes.category = clip(input.category.trim());
  if (input.registrationId?.trim()) notes.registrationId = clip(input.registrationId.trim());
  if (input.amount != null) notes.amount = clip(String(input.amount));

  return notes;
}
