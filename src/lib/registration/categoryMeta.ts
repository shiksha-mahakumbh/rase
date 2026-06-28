import { RegistrationType } from "@/types/registration";
import {
  ACCOMMODATION_DOUBLE_BED_FEE,
  ACCOMMODATION_SINGLE_BED_FEE,
  PROJECT_COLLEGE_STUDENT_FEE,
  PROJECT_SCHOOL_STUDENT_FEE,
} from "@/lib/registration/fees";
import { DELEGATE_FEES } from "@/lib/registration/delegate-categories";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";

export type CategoryMeta = {
  description: string;
  instructions: string[];
  eligibility: string[];
  fee: string;
  documentsRequired: string[];
  importantNotes: string[];
};

const META: Record<RegistrationType, CategoryMeta> = {
  "Delegate Registration": {
    description: "Register as a delegate for Shiksha Mahakumbh 6.0 sessions and networking.",
    instructions: [
      "Select your delegate category based on role.",
      "Student delegates register free; paid categories proceed to Razorpay.",
      "Complete all participant details before payment.",
    ],
    eligibility: ["Faculty", "Students", "Principals", "Researchers", "Industry professionals"],
    fee: `Student: Free · Teacher/Principal: ₹${DELEGATE_FEES["Teacher (₹1100)"]} · Research Scholar: ₹${DELEGATE_FEES["Research Scholar (₹251)"]} · Director/VC: ₹${DELEGATE_FEES["Director / VC / Chairperson (₹2100)"]} · Industry: ₹${DELEGATE_FEES["Industry Delegate (₹5100)"]}`,
    documentsRequired: [
      "Student ID card for free student category",
      "Payment receipt for paid categories",
      "PAN (if fee ≥ ₹2000)",
    ],
    importantNotes: ["Keep your registration ID for check-in", "Fee varies by category"],
  },
  "Multi Track Conference": {
    description: "Submit research papers and abstracts via Microsoft CMT.",
    instructions: ["You will be redirected to the official CMT portal", "Use the same email for CMT and registration"],
    eligibility: ["Researchers", "Faculty", "Doctoral scholars", "Practitioners"],
    fee: "As per CMT submission guidelines",
    documentsRequired: ["Submission materials as per CMT guidelines"],
    importantNotes: [`Portal: ${CMT_SUBMISSION_URL}`],
  },
  Conclave: {
    description: "Participate in thematic conclaves with leaders and practitioners.",
    instructions: ["Choose conclave track and participation type", "Submit form — no payment on this portal"],
    eligibility: ["Speakers", "Delegates", "Invitees", "Observers"],
    fee: "Free on this portal",
    documentsRequired: ["None unless requested by organisers"],
    importantNotes: ["Confirmation subject to review"],
  },
  "Best Practices": {
    description: "Share institutional best practices (500+ words).",
    instructions: ["Prepare a detailed description", "Upload supporting PDF/photos if available"],
    eligibility: ["Institutions", "NGOs", "Practitioners"],
    fee: "Free",
    documentsRequired: ["Supporting PDF (optional)", "Photos (optional)"],
    importantNotes: ["Minimum 500 words for description"],
  },
  Olympiad: {
    description: "Register schools for DHE Olympiad programmes.",
    instructions: ["Upload student list Excel", "Fee calculated per student"],
    eligibility: ["Schools", "Coordinators"],
    fee: "₹200 per student",
    documentsRequired: ["Student list file", "Payment proof if applicable"],
    importantNotes: ["Verify student count matches upload"],
  },
  Awards: {
    description: "Nominate individuals or institutions for excellence awards.",
    instructions: ["Select award category", "Describe achievements clearly"],
    eligibility: ["Teachers", "Principals", "Institutions", "Innovators"],
    fee: "Free",
    documentsRequired: ["Supporting documents (optional)"],
    importantNotes: ["Nomination subject to jury review"],
  },
  Exhibition: {
    description: "Showcase innovations and projects at the exhibition.",
    instructions: ["Provide title and description of exhibit"],
    eligibility: ["Students", "Institutions", "Innovators"],
    fee: "Free",
    documentsRequired: ["None"],
    importantNotes: ["Space allocation subject to availability"],
  },
  Projects: {
    description: "Register school or college project displays.",
    instructions: ["Select student type for correct fee", "Pay via Razorpay before submit"],
    eligibility: ["School students", "College students"],
    fee: `School: ₹${PROJECT_SCHOOL_STUDENT_FEE} · College: ₹${PROJECT_COLLEGE_STUDENT_FEE}`,
    documentsRequired: ["Razorpay receipt or uploaded payment proof", "PAN if fee ≥ ₹2000"],
    importantNotes: ["Payment proof is mandatory"],
  },
  "Bal Shodh Patrika": {
    description: "Register for Bal Shodh Patrika contributions.",
    instructions: ["Provide title and description", "Submit — no payment required"],
    eligibility: ["Students", "Teachers", "Contributors"],
    fee: "Free",
    documentsRequired: ["None"],
    importantNotes: ["Submissions reviewed editorially"],
  },
  "Cultural Program": {
    description: "Register for cultural programme participation.",
    instructions: ["Describe your performance or contribution"],
    eligibility: ["Students", "Institutions", "Cultural groups"],
    fee: "Free",
    documentsRequired: ["None"],
    importantNotes: ["Schedule shared after curation"],
  },
  Accommodation: {
    description: "Book accommodation for event dates at NIT Hamirpur.",
    instructions: ["Select bed type", "Pay registration fee via Razorpay", "Upload receipt if manual payment"],
    eligibility: ["Registered participants", "Delegates"],
    fee: `Single Bed: ₹${ACCOMMODATION_SINGLE_BED_FEE} · Double Bed: ₹${ACCOMMODATION_DOUBLE_BED_FEE}`,
    documentsRequired: ["Payment proof mandatory", "PAN if fee ≥ ₹2000"],
    importantNotes: ["First-come, first-served", "Confirmation sent separately"],
  },
};

export function getCategoryMeta(type: RegistrationType): CategoryMeta {
  return META[type];
}

export type FeeBadgeTone = "free" | "paid" | "external" | "variable";

const FEE_BADGES: Record<RegistrationType, { label: string; tone: FeeBadgeTone }> = {
  "Delegate Registration": { label: "₹0–₹5100", tone: "variable" },
  "Multi Track Conference": { label: "External · CMT", tone: "external" },
  Conclave: { label: "Free", tone: "free" },
  "Best Practices": { label: "Free", tone: "free" },
  Olympiad: { label: "₹200 / student", tone: "paid" },
  Awards: { label: "Free", tone: "free" },
  Exhibition: { label: "Free", tone: "free" },
  Projects: { label: "₹200–₹400", tone: "paid" },
  "Bal Shodh Patrika": { label: "Free", tone: "free" },
  "Cultural Program": { label: "Free", tone: "free" },
  Accommodation: { label: "Paid · lodging", tone: "paid" },
};

export function getCategoryFeeBadge(type: RegistrationType): {
  label: string;
  tone: FeeBadgeTone;
} {
  return FEE_BADGES[type];
}
