/** Institutional sponsorship tiers — source: Shiksha Mahakumbh sponsorship brochures (SM 25 / Abhiyan 3.0). */

export type SponsorshipTierId =
  | "title"
  | "title-co"
  | "platinum"
  | "gold"
  | "silver"
  | "bronze"
  | "lunch"
  | "dinner"
  | "high-tea"
  | "banner"
  | "custom";

export type SponsorshipTier = {
  id: SponsorshipTierId;
  name: string;
  amount: number;
  badge: string;
  description: string;
  freeDelegates?: number;
  colourAdPages?: number | string;
  bannerAtSite?: number | string;
  highlights: readonly string[];
  /** Title / co-title — enquire via Vitt Vibhag rather than instant checkout */
  contactOnly?: boolean;
};

export const SPONSORSHIP_PAGE_INTRO = {
  eyebrow: "Institutional Partnership · SMK 6.0 · NIT Hamirpur",
  title: "Sponsorship Opportunities",
  subtitle:
    "Partner with Shiksha Mahakumbh 6.0 as a presenting, category, session, or souvenir sponsor. Benefits include stage branding, delegate passes, exhibition space, anchor mentions, and digital media coverage.",
} as const;

export const SPONSORSHIP_TIERS: readonly SponsorshipTier[] = [
  {
    id: "title",
    name: "Title Sponsor",
    amount: 1_00_00_000,
    badge: "Presenting",
    description: "Premier presenting partnership for the national edition.",
    freeDelegates: 12,
    colourAdPages: 10,
    bannerAtSite: 1,
    contactOnly: true,
    highlights: [
      "Presenting Partner branding on felicitation shields (schools)",
      "Panel discussion moderated by presenting partner",
      "Title Sponsor brochure in welcome kit · 12 sq.m exhibition booth",
      "Pre & post event mailers to full database",
      "Logo on all marketing collaterals, speaker posts & conference material",
      "Premium presentation slot · anchor brand recall at every announcement",
      "Felicitation certificates with Title Sponsor branding for all attendees",
      "Exclusive digital media coverage · nominate up to 3 educationists for awards",
      "Senior representative felicitated by Guest of Honour",
      "Chairman message & photograph in souvenir · main entrance hoarding",
    ],
  },
  {
    id: "title-co",
    name: "Title Co-Sponsor",
    amount: 50_00_000,
    badge: "Co-presenting",
    description: "Co-presenting partnership with national visibility.",
    freeDelegates: 10,
    colourAdPages: 5,
    bannerAtSite: 1,
    contactOnly: true,
    highlights: [
      "Title Co-Sponsor branding on felicitation certificates (schools & attendees)",
      "12 sq.m exhibition booth · pre & post event database mailers",
      "Logo on marketing collaterals & conference itineraries",
      "Presentation slot · anchor brand recall during the event",
      "Exclusive digital media coverage · nominate 1 educationist for award",
      "Senior representative felicitated · chairman message in souvenir",
      "Branding hoarding at entrance",
    ],
  },
  {
    id: "platinum",
    name: "Platinum Sponsor",
    amount: 20_00_000,
    badge: "Platinum",
    description: "Flagship category sponsor with stage, booth, and delegate benefits.",
    freeDelegates: 7,
    colourAdPages: 2,
    bannerAtSite: 2,
    highlights: [
      "Logo on main stage banner & conference site banner",
      "Platinum logo on felicitation certificates for all attendees",
      "Platinum Sponsor brochure in welcome kit",
      "4 sq.m booth in main conference hall",
      "Anchor brand recall during the event",
      "Logo on all marketing collaterals · branding on speaker posts",
    ],
  },
  {
    id: "gold",
    name: "Gold Sponsor",
    amount: 15_00_000,
    badge: "Gold",
    description: "Gold partnership with stage presence and exhibition space.",
    freeDelegates: 5,
    colourAdPages: 2,
    bannerAtSite: 2,
    highlights: [
      "Logo on main stage banner & site banner",
      "Gold sponsorship on felicitation certificates",
      "4 sq.m booth in main conference hall",
      "Anchor brand recall at announcements during the event",
    ],
  },
  {
    id: "silver",
    name: "Silver Sponsor",
    amount: 10_00_000,
    badge: "Silver",
    description: "Silver category with stage and conference-site branding.",
    freeDelegates: 2,
    colourAdPages: 1,
    bannerAtSite: 1,
    highlights: [
      "Logo on main stage banner & conference site banner",
      "Silver sponsorship logo on felicitation certificates",
      "Anchor brand recall during the event",
    ],
  },
  {
    id: "bronze",
    name: "Bronze Sponsor / Delegate Kit",
    amount: 8_00_000,
    badge: "Bronze",
    description: "Bronze partnership or delegate-kit category sponsorship.",
    freeDelegates: 2,
    colourAdPages: 1,
    bannerAtSite: 1,
    highlights: [
      "Logo on main stage banner & conference site banner",
      "Anchor brand recall during the event",
    ],
  },
  {
    id: "lunch",
    name: "Lunch Sponsor",
    amount: 5_00_000,
    badge: "Session",
    description: "Sponsor lunch (each day) with branding at the venue.",
    freeDelegates: 2,
    colourAdPages: 1,
    bannerAtSite: "½",
    highlights: [
      "Logo on main stage & conference site banners",
      "Anchor brand recall · banner at site (each day sponsored)",
    ],
  },
  {
    id: "dinner",
    name: "Dinner Sponsor",
    amount: 4_00_000,
    badge: "Session",
    description: "Sponsor dinner (each day) with on-site branding.",
    freeDelegates: 3,
    colourAdPages: 1,
    bannerAtSite: "½",
    highlights: [
      "Logo on main stage & conference site banners",
      "Anchor brand recall during dinner session",
    ],
  },
  {
    id: "high-tea",
    name: "High Tea Sponsor",
    amount: 4_00_000,
    badge: "Session",
    description: "Sponsor high tea (first or last day of the programme).",
    freeDelegates: 1,
    colourAdPages: "½",
    bannerAtSite: "¼",
    highlights: [
      "Logo on main stage & conference site banners",
      "Anchor brand recall during high tea",
    ],
  },
  {
    id: "banner",
    name: "Banner Sponsor",
    amount: 2_00_000,
    badge: "Banner",
    description: "Dedicated banner placement at the conference site.",
    freeDelegates: 1,
    colourAdPages: "¼",
    bannerAtSite: "¼",
    highlights: ["Banner at conference site", "Brand visibility across the venue footprint"],
  },
] as const;

export const SPONSORSHIP_ADDONS = {
  session: [
    {
      name: "Plenary Lecture / Parallel Session (each)",
      amount: 2_00_000,
      note: "1 complimentary delegate · ¼ banner · 1 colour souvenir page",
    },
    {
      name: "Tea During Break (each day)",
      amount: 75_000,
      note: "Session branding for tea break",
    },
    {
      name: "Breakfast (each day)",
      amount: 75_000,
      note: "Session branding for breakfast",
    },
  ],
  souvenir: [
    { name: "Back Outside Cover", amount: 1_00_000 },
    { name: "Back Inside Page", amount: 75_000 },
    { name: "Front Inside Page", amount: 75_000 },
    { name: "Colour Full Page", amount: 50_000 },
    { name: "Colour Half Page", amount: 40_000 },
    { name: "Colour Quarter Page", amount: 30_000 },
    { name: "B/W Full Page", amount: 30_000 },
    { name: "B/W Half Page", amount: 30_000 },
    { name: "B/W Quarter Page", amount: 30_000 },
  ],
  exhibition: [
    { name: "Lounge Stall (6 × 2 m)", amount: 2_00_000 },
    { name: "Exhibition Stall (3 × 2 m)", amount: 1_20_000 },
    { name: "Table Space", amount: 70_000 },
  ],
} as const;

export const SPONSORSHIP_BANK = {
  accountName: "Shiksha Mahakumbh",
  accountNumber: "42563560855",
  bank: "State Bank of India",
  branch: "Chandigarh Main Branch",
  ifsc: "SBIN0000628",
  upi: "shikshamahakhumbh@sbi",
} as const;

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatInrLakhs(amount: number): string {
  if (amount >= 1_00_00_000) {
    return `₹${(amount / 1_00_00_000).toLocaleString("en-IN")} crore`;
  }
  if (amount >= 1_00_000) {
    const lakhs = amount / 1_00_000;
    return lakhs % 1 === 0 ? `₹${lakhs} lakh` : `₹${lakhs.toLocaleString("en-IN")} lakh`;
  }
  return formatInr(amount);
}
