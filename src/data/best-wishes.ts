import { FIREBASE_BEST_WISHES } from "@/data/best-wishes-firebase";

export type BestWishEntry = {
  id: string;
  name: string;
  designation: string;
  message: string;
  /** Edition tag — "Abhiyan" for movement-wide wishes, or a specific edition (e.g. "2.0") */
  edition: string;
  year: string;
  featured?: boolean;
};

const DEFAULT_MESSAGE =
  "Hon'ble dignitary conveyed best wishes for the success of Shiksha Mahakumbh Abhiyan";

/** Site-maintained dignitary messages (legacy static list) */
const STATIC_BEST_WISHES: BestWishEntry[] = [
  {
    id: "droupadi-murmu",
    name: "Smt. Droupadi Murmu",
    designation: "Hon'ble President of India",
    message: "The Hon'ble President conveyed best wishes for the success of Shiksha Mahakumbh Abhiyan",
    edition: "Abhiyan",
    year: "2024",
    featured: true,
  },
  {
    id: "dharmendra-pradhan",
    name: "Shri Dharmendra Pradhan",
    designation: "Hon'ble Union Minister for Education",
    message:
      "Hon'ble Union Minister for Education sends best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
    featured: true,
  },
  {
    id: "anurag-thakur",
    name: "Shri Anurag Singh Thakur",
    designation: "Hon'ble Union Minister",
    message: "Hon'ble Minister sends his best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
    featured: true,
  },
  {
    id: "abhay-kumar-singh",
    name: "Prof. Abhay Kumar Singh",
    designation: "Vice-Chancellor, Nalanda University",
    message: "The Hon'ble sir congratulates and wishes best for the event",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "admiral-dk-joshi",
    name: "Admiral D. K. Joshi, PVSM, AVSM, YSM, NM, VSM (Retd.)",
    designation: "Hon'ble Lieutenant Governor of Andaman & Nicobar Islands",
    message: "The Hon'ble Lieutenant Governor conveyed his best wishes for success of the event",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "kaiwalya-parnaik",
    name: "Lt. Gen. Kaiwalya Trivikram Parnaik, PVSM, UYSM, YSM (Retd.)",
    designation: "Hon'ble Governor of Arunachal Pradesh",
    message: "The Hon'ble Governor extends his best wishes for success of the event",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "rajendra-arlekar",
    name: "Shri Rajendra Arlekar",
    designation: "Hon'ble Governor of Bihar",
    message:
      "माननीय राज्यपाल, बिहार के द्वारा शिक्षा महाकुंभ के द्वितीय संस्करण की कामयाबी के लिए शुभकामनाएँ व्यक्त की है",
    edition: "2.0",
    year: "2024",
  },
  {
    id: "la-ganesan",
    name: "Shri L. A. Ganesan",
    designation: "Hon'ble Governor of Nagaland",
    message: "Hon'ble Governor sends his best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "bhagwant-mann",
    name: "Shri Bhagwant Mann",
    designation: "Hon'ble Chief Minister of Punjab",
    message: DEFAULT_MESSAGE,
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "delhi-governor",
    name: "Shri Vinai Kumar Saxena",
    designation: "Hon'ble Lieutenant Governor, National Capital Territory of Delhi",
    message: DEFAULT_MESSAGE,
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "gulab-chand-kataria",
    name: "Shri Gulab Chand Kataria",
    designation: "Hon'ble Governor of Assam",
    message: DEFAULT_MESSAGE,
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "haryana-governor",
    name: "Shri Bandaru Dattatreya",
    designation: "Hon'ble Governor of Haryana",
    message: DEFAULT_MESSAGE,
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "himachal-governor",
    name: "Shri Shiv Pratap Shukla",
    designation: "Hon'ble Governor of Himachal Pradesh",
    message: DEFAULT_MESSAGE,
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "tripura-governor",
    name: "Shri Indrasena Reddy N.",
    designation: "Hon'ble Governor of Tripura",
    message: DEFAULT_MESSAGE,
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "brajesh-singh",
    name: "Dr. Brajesh Singh",
    designation: "Hon'ble Director, ICAR-CPRI",
    message: "Hon'ble Director sends his best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "giriraj-singh",
    name: "Shri Giriraj Singh",
    designation: "Hon'ble Minister for Textiles",
    message: "Hon'ble Minister sends his best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "anup-das",
    name: "Dr. Anup Das",
    designation: "Hon'ble Director, ICAR Research Complex for Eastern Region",
    message: "Hon'ble Director sends his best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "vivek-bhasin",
    name: "Shri Vivek Bhasin",
    designation: "Hon'ble Director, BARC",
    message: "Hon'ble Director sends his best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "nkalaiselvi",
    name: "Dr. N. Kalaiselvi",
    designation: "Hon'ble Director General, CSIR & Secretary, DSIR",
    message: "Hon'ble Director General sends her best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "gilliam-boston",
    name: "Dr. Melissa L. Gilliam",
    designation: "Hon'ble President, Boston University",
    message: "Hon'ble President sends her best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "bk-sharma",
    name: "Major General B. K. Sharma, AVSM, SM** (Retd.)",
    designation: "Hon'ble Director General, USI",
    message: "Hon'ble Director General sends his best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "s-periyasamy",
    name: "Dr. S. Periyasamy",
    designation: "Hon'ble Director, CSTRI",
    message: "Hon'ble Director sends his best wishes for the success of the programme",
    edition: "Abhiyan",
    year: "2024",
  },
  {
    id: "icar-director",
    name: "Hon'ble Director, ICAR",
    designation: "Indian Council of Agricultural Research",
    message: DEFAULT_MESSAGE,
    edition: "Abhiyan",
    year: "2024",
  },
];

export const BEST_WISHES_ENTRIES: BestWishEntry[] = [
  ...STATIC_BEST_WISHES,
  ...(FIREBASE_BEST_WISHES as BestWishEntry[]),
];

export const BEST_WISHES_HERO = {
  eyebrow: "Dignitaries · National & International Support",
  title: "Best Wishes & Greetings",
  subtitle:
    "Messages from presidents, governors, ministers, IIT/IIM/CSIR directors, UGC leadership, and global institutions supporting the Shiksha Mahakumbh Abhiyan across all editions.",
} as const;

export const BEST_WISHES_KEYWORDS = [
  "Shiksha Mahakumbh best wishes",
  "Shiksha Mahakumbh Abhiyan greetings",
  "education summit messages India",
  "vice chancellor wishes education conference",
  "UGC chairman Shiksha Mahakumbh",
  "international education summit greetings",
  "IIT IIM director best wishes",
] as const;

export const BEST_WISHES_STATS = {
  total: BEST_WISHES_ENTRIES.length,
  featured: BEST_WISHES_ENTRIES.filter((w) => w.featured).length,
  international: BEST_WISHES_ENTRIES.filter((w) =>
    /oxford|boston|international|south asian university/i.test(w.designation)
  ).length,
} as const;

export function bestWishesCount() {
  return BEST_WISHES_ENTRIES.length;
}

/** Human-readable scope label for card footers and filters */
export function formatWishScope(wish: BestWishEntry): string {
  if (wish.edition === "Abhiyan") return "Shiksha Mahakumbh Abhiyan";
  return `Edition ${wish.edition}`;
}

export const WISH_EDITION_FILTERS = ["all", "Abhiyan", "2.0"] as const;
export type WishEditionFilter = (typeof WISH_EDITION_FILTERS)[number];
