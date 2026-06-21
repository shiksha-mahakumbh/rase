/** Donation & sponsorship hub — English UI/SEO copy */

export const DONATION_HUB_STATS = [
  { label: "Tax Benefit", value: "80G Eligible", detail: "Section 80G certificate on every donation" },
  { label: "Secure Payment", value: "Razorpay", detail: "UPI, cards, net banking & wallets" },
  { label: "Instant Receipt", value: "Email + PDF", detail: "Download or print after payment" },
] as const;

export const DONATION_IMPACT_AREAS = [
  {
    icon: "🎓",
    title: "National Education Summits",
    description:
      "Support multidisciplinary conclaves, research tracks, and delegate programmes across India.",
  },
  {
    icon: "🌱",
    title: "Holistic Learning Initiatives",
    description:
      "Fund workshops, residential camps, and culture–technology integration for young learners.",
  },
  {
    icon: "📚",
    title: "Research & Publications",
    description:
      "Enable proceedings, journals, and knowledge resources for educators and policymakers worldwide.",
  },
  {
    icon: "🤝",
    title: "Community Outreach",
    description:
      "Expand access for schools, NGOs, and grassroots institutions joining the Shiksha Mahakumbh movement.",
  },
] as const;

export type DonationTierId = "supporter" | "patron" | "gold" | "platinum" | "custom";

export const DONATION_TIERS = [
  {
    id: "supporter" as const,
    name: "Supporter",
    amount: 5_000,
    badge: "Community",
    description: "Power grassroots education outreach and student participation.",
    highlights: ["Digital acknowledgement", "80G tax receipt", "Movement updates"],
  },
  {
    id: "patron" as const,
    name: "Patron",
    amount: 25_000,
    badge: "Patron",
    description: "Sponsor delegate access and regional education conclaves.",
    highlights: ["Name on supporter wall", "80G tax receipt", "Event programme mention"],
  },
  {
    id: "gold" as const,
    name: "Gold Sponsor",
    amount: 100_000,
    badge: "Gold",
    description: "Co-brand a summit track or thematic conclave at Shiksha Mahakumbh.",
    highlights: ["Branding visibility", "Dedicated liaison", "80G tax receipt"],
  },
  {
    id: "platinum" as const,
    name: "Platinum Sponsor",
    amount: 500_000,
    badge: "Platinum",
    description: "Lead national partnership for edition programmes and global outreach.",
    highlights: ["Premium branding", "VIP recognition", "Custom sponsorship plan"],
  },
] as const;

export const DONATION_80G = {
  enabled: true,
  section: "80G",
  act: "Income Tax Act, 1961",
  /** Official 80G registration reference for receipts */
  registrationNumber: "AAETV1652K/E/6401/2020-21",
  orgLegalName: "Department of Holistic Education (Regd. No. 6401)",
  orgPan: "AAETV1652K",
  note:
    "Donations to Department of Holistic Education / Shiksha Mahakumbh Abhiyan are eligible for deduction under Section 80G of the Income Tax Act, 1961. Your official receipt will include donor PAN and payment details for tax filing.",
} as const;

export const DONATION_MIN_AMOUNT = 100;

export const DONATION_HERO = {
  eyebrow: "Support · 80G Tax Benefit · Global Movement",
  title: "Donate & Sponsor Shiksha Mahakumbh",
  subtitle:
    "Fuel India's national education movement — secure online payment via Razorpay, instant 80G-eligible receipt by email, and download or print your donation certificate anytime.",
} as const;

export const DONATION_KEYWORDS = [
  "Shiksha Mahakumbh donation",
  "education donation India 80G",
  "sponsor education summit India",
  "tax deductible donation 80G",
  "Shiksha Mahakumbh sponsorship",
  "NEP 2020 education movement",
  "holistic education charity India",
  "Razorpay secure donation",
] as const;
