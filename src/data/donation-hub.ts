import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { SITE_URL } from "@/config/site";

export const DONATION_PATH = CANONICAL_ROUTES.donation;

export const DONATION_HERO_IMAGE = "/branding/shiksha-mahakumbh-brand-hero.png";

export const DONATION_HERO_IMAGE_ALT =
  "Donate and sponsor Shiksha Mahakumbh Abhiyan — secure 80G-eligible contributions via Razorpay";

export const DONATION_OG_IMAGE = `${SITE_URL}${DONATION_HERO_IMAGE}`;

export const DONATION_CANONICAL_URL = `${SITE_URL}${DONATION_PATH}`;

/** Form 10AC provisional approval (Income Tax Department) — source: AAETV1652KF20241_80G.pdf */
export const DONATION_80G = {
  enabled: true,
  section: "80G",
  act: "Income Tax Act, 1961",
  /** Unique Registration Number (Form 10AC, serial 5) */
  registrationNumber: "AAETV1652KF20241",
  /** Document Identification Number (Form 10AC, serial 3) */
  documentId: "AAETV1652KF2024101",
  applicationNumber: "144487770160324",
  approvalDate: "23 March 2024",
  approvalPeriod: "Assessment years 2024-25 to 2026-27",
  sectionClause:
    "Sub-clause (A) of clause (iv) of the first proviso to sub-section (5) of section 80G",
  orgLegalName: "Vidya Bharti Institute of Training and Research Trust",
  /** Programme brand receiving support through the trust */
  programmeName: "Shiksha Mahakumbh Abhiyan / Department of Holistic Education",
  orgPan: "AAETV1652K",
  natureOfActivities: "Charitable",
  registeredAddress: {
    line1: "Lajjaram Tomar Bhawan, Gita Niketan Parisar",
    line2: "Salarpur Road, Kurukshetra H.O",
    city: "Kurukshetra",
    district: "Kurukshetra",
    state: "Haryana",
    country: "India",
    pinCode: "136118",
  },
  note:
    "Donations are received by Vidya Bharti Institute of Training and Research Trust (PAN: AAETV1652K), provisionally approved under Section 80G of the Income Tax Act, 1961 (Unique Registration No. AAETV1652KF20241, valid for assessment years 2024-25 to 2026-27). Contributions support Shiksha Mahakumbh Abhiyan programmes organised by the Department of Holistic Education. Your official receipt will include donor PAN and payment details for tax filing.",
} as const;

export function donation80GAddressLine(): string {
  const a = DONATION_80G.registeredAddress;
  return `${a.line1}, ${a.line2}, ${a.city}, ${a.district}, ${a.state} ${a.pinCode}, ${a.country}`;
}

export const DONATION_HUB_STATS = [
  { label: "Tax Benefit", value: "80G Eligible", hint: "Provisional approval — Form 10AC" },
  { label: "Secure Payment", value: "Razorpay", hint: "UPI, cards, net banking & wallets" },
  { label: "Instant Receipt", value: "Email + PDF", hint: "Download or print after payment" },
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

export const DONATION_MIN_AMOUNT = 100;

export const DONATION_PAGE_HERO = {
  eyebrow: "Support · 80G Tax Benefit · Global Movement",
  title: "Donate & Sponsor Shiksha Mahakumbh",
  subtitle:
    "Fuel India's national education movement — secure online payment via Razorpay, instant 80G-eligible receipt by email, and download or print your donation certificate anytime.",
} as const;

/** @deprecated Use DONATION_PAGE_HERO — kept for home section compatibility */
export const DONATION_HERO = DONATION_PAGE_HERO;

export const DONATION_BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Donation & Sponsorship", path: DONATION_PATH },
] as const;

export const DONATION_QUICK_LINKS = [
  { label: "Vitt Vibhag (Finance)", href: CANONICAL_ROUTES.departments.vitt, icon: "💰" },
  { label: "Register for SMK 6.0", href: CANONICAL_ROUTES.registration, icon: "✅" },
  { label: "Upcoming Events", href: CANONICAL_ROUTES.upcomingEvents, icon: "🗓️" },
  { label: "Contact DHE", href: CANONICAL_ROUTES.contact, icon: "📞" },
  { label: "Refund Policy", href: "/refund-policy", icon: "📋" },
  { label: "About the Abhiyan", href: CANONICAL_ROUTES.introduction, icon: "📜" },
] as const;

export const DONATION_SUCCESS_LINKS = [
  { label: "Upcoming Events (SMK 6.0)", href: CANONICAL_ROUTES.upcomingEvents },
  { label: "Vitt Vibhag — finance team", href: CANONICAL_ROUTES.departments.vitt },
  { label: "Register for the summit", href: CANONICAL_ROUTES.registration },
  { label: "Introduction to the Abhiyan", href: CANONICAL_ROUTES.introduction },
] as const;

export const DONATION_KEYWORDS = [
  "Shiksha Mahakumbh donation",
  "education donation India 80G",
  "sponsor education summit India",
  "tax deductible donation 80G",
  "Shiksha Mahakumbh sponsorship",
  "NEP 2020 education movement",
  "holistic education charity India",
  "Razorpay secure donation",
  "Vidya Bharti Institute 80G",
] as const;

export function donationMetaDescription(): string {
  return `Support Shiksha Mahakumbh Abhiyan with secure Razorpay payments. Donations to Vidya Bharti Institute of Training and Research Trust are eligible under Section 80G (Reg. ${DONATION_80G.registrationNumber}). Instant receipt by email — PAN mandatory.`;
}

export const DONATION_FAQ = [
  {
    question: "Which organisation receives my donation?",
    answer: `Donations are received by ${DONATION_80G.orgLegalName} (PAN ${DONATION_80G.orgPan}) in support of ${DONATION_80G.programmeName} programmes.`,
  },
  {
    question: "Is my donation eligible for Section 80G tax deduction?",
    answer: `Yes. The trust holds provisional approval under Section 80G (${DONATION_80G.registrationNumber}), valid for ${DONATION_80G.approvalPeriod}. Approval dated ${DONATION_80G.approvalDate}.`,
  },
  {
    question: "Why is PAN mandatory?",
    answer:
      "Indian income tax rules require the donor's PAN on the receipt for a valid Section 80G deduction claim.",
  },
  {
    question: "What is the minimum donation amount?",
    answer: `Online donations start from ₹${DONATION_MIN_AMOUNT} via Razorpay (UPI, cards, net banking).`,
  },
  {
    question: "What is the difference between donation and sponsorship?",
    answer:
      "Donations are individual or institutional contributions. Sponsorships are tiered partnerships — organisation name is required for sponsorship receipts.",
  },
  {
    question: "How do I get my 80G receipt?",
    answer:
      "An email with your PDF receipt is sent immediately after successful payment. You can also download or print it from the confirmation screen.",
  },
] as const;
