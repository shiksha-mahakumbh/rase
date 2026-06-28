import { DONATION_MIN_AMOUNT, DONATION_TIERS, type DonationTierId } from "@/data/donation-hub";
import {
  SPONSORSHIP_TIERS,
  type SponsorshipTierId,
} from "@/data/sponsorship-hub";

export function expectedDonationAmountRupees(input: {
  donationKind: "donation" | "sponsorship";
  amount: number;
  tierId?: string;
}): { ok: true; amount: number } | { ok: false; message: string } {
  const amount = Math.round(input.amount);

  if (!Number.isFinite(amount) || amount < DONATION_MIN_AMOUNT) {
    return { ok: false, message: `Minimum amount is ₹${DONATION_MIN_AMOUNT}` };
  }

  if (!input.tierId) {
    return { ok: true, amount };
  }

  if (input.donationKind === "donation") {
    if (input.tierId === "custom") {
      return { ok: true, amount };
    }
    const tier = DONATION_TIERS.find((t) => t.id === (input.tierId as DonationTierId));
    if (!tier) {
      return { ok: false, message: "Invalid donation tier" };
    }
    if (amount !== tier.amount) {
      return {
        ok: false,
        message: `Amount must match ${tier.name} tier (₹${tier.amount.toLocaleString("en-IN")})`,
      };
    }
    return { ok: true, amount: tier.amount };
  }

  const tier = SPONSORSHIP_TIERS.find((t) => t.id === (input.tierId as SponsorshipTierId));
  if (!tier) {
    return { ok: false, message: "Invalid sponsorship tier" };
  }
  if (tier.contactOnly) {
    return { ok: false, message: "This sponsorship tier requires contacting Vitt Vibhag" };
  }
  if (amount !== tier.amount) {
    return {
      ok: false,
      message: `Amount must match ${tier.name} sponsorship (₹${tier.amount.toLocaleString("en-IN")})`,
    };
  }
  return { ok: true, amount: tier.amount };
}

export function expectedDonationAmountPaise(input: {
  donationKind: "donation" | "sponsorship";
  amountRupees: number;
  tierId?: string;
}): number | null {
  const check = expectedDonationAmountRupees({
    donationKind: input.donationKind,
    amount: input.amountRupees,
    tierId: input.tierId,
  });
  if (!check.ok) return null;
  return Math.round(check.amount * 100);
}
