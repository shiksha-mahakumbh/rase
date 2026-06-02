import { Timestamp } from "firebase/firestore";

export const EVENT_NAME = "Shiksha Mahakumbh 6.0";
export const PAYMENT_URL = "https://rzp.io/rzp/MMLfl4L2";
export const REGISTRATION_ID_PREFIX = "SMK2026";

export type RegistrationType =
  | "Delegate Registration"
  | "Conclave"
  | "Awards"
  | "Olympiad"
  | "Exhibition"
  | "Projects"
  | "Best Practices"
  | "Bal Shodh Patrika"
  | "Cultural Program"
  | "Accommodation";

export type Gender = "Male" | "Female" | "Other";
export type VidyaBhartiStatus = "Vidya Bharti" | "Non Vidya Bharti";
export type YesNo = "Yes" | "No";

export type RegistrationStatus = "Pending" | "Verified" | "Approved" | "Rejected";
export type PaymentStatus = "Pending" | "Paid" | "Failed";
export type AccommodationStatus =
  | "Not Required"
  | "Requested"
  | "Confirmed"
  | "Allocated";

export type AdminRole = "Super Admin" | "Admin" | "Data Entry";

export type AccommodationDate =
  | "8–11 Oct 2026"
  | "8–10 Oct 2026"
  | "8–9 Oct 2026"
  | "9–11 Oct 2026"
  | "9–10 Oct 2026"
  | "10–11 Oct 2026"
  | "8 Oct Only"
  | "9 Oct Only"
  | "10 Oct Only"
  | "11 Oct Only";

export type AccommodationType = "Single Room" | "Double Sharing" | "Dormitory";

export type ParticipantCategory =
  | "Author"
  | "Faculty"
  | "Teacher"
  | "Student"
  | "Research Scholar"
  | "Industry"
  | "Guest"
  | "VVIP"
  | "Organizer"
  | "Volunteer"
  | "Other";

export interface UploadedFileMeta {
  name: string;
  url: string;
  path: string;
  contentType?: string;
  size?: number;
}

export interface AccommodationDetails {
  accommodationRequired: YesNo;
  accommodationDate?: AccommodationDate;
  accommodationType?: AccommodationType;
  participantCategory?: ParticipantCategory;
}

export interface PaymentDetails {
  utrNumber?: string;
  transactionId?: string;
  chequeNumber?: string;
  panNumber?: string;
  receipt?: UploadedFileMeta;
  registrationFee?: number;
}

export interface CommonParticipantDetails {
  fullName: string;
  gender: Gender;
  designation: string;
  institution: string;
  address: string;
  country: string;
  email: string;
  contactNumber: string;
  whatsappNumber?: string;
  vidyaBharti: VidyaBhartiStatus;
}

export interface BaseRegistration extends CommonParticipantDetails, AccommodationDetails {
  registrationId: string;
  registrationType: RegistrationType;
  paymentStatus: PaymentStatus;
  registrationStatus: RegistrationStatus;
  accommodationStatus: AccommodationStatus;
  payment?: PaymentDetails;
  emailDeliveryStatus?: "sent" | "failed" | "pending" | "skipped";
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface DelegateRegistrationData extends BaseRegistration {
  registrationType: "Delegate Registration";
  delegateCategory:
    | "Student (Free)"
    | "Teacher (₹1000)"
    | "Principal (₹2000)"
    | "Research Scholar (₹2000)"
    | "Director / VC / Chairperson (₹3000)"
    | "Industry Delegate (₹8000)";
  registrationFee: number;
}

export interface ConclaveRegistrationData extends BaseRegistration {
  registrationType: "Conclave";
  conclaveSelection:
    | "Vice Chancellor & Director Conclave"
    | "School Leaders Conclave"
    | "Talent Conclave"
    | "Industry Conclave"
    | "Startup Conclave"
    | "Policy Conclave"
    | "Research Conclave";
  participationType: "Speaker" | "Delegate" | "Invitee" | "Observer";
}

export interface BestPracticeRegistrationData extends BaseRegistration {
  registrationType: "Best Practices";
  title: string;
  organizationName: string;
  areaOfWork:
    | "Education"
    | "Health"
    | "Environment"
    | "Social Welfare"
    | "Skill Development"
    | "Innovation"
    | "Governance"
    | "Other";
  briefDescription: string;
  outcomes: string;
  scopeForReplication: string;
  supportingPdf?: UploadedFileMeta;
  supportingPhotos?: UploadedFileMeta[];
}

export interface OlympiadRegistrationData extends BaseRegistration {
  registrationType: "Olympiad";
  olympiadType: "English Olympiad" | "Mathematics Olympiad" | "Tech Olympiad";
  schoolName: string;
  schoolAddress: string;
  principalName: string;
  principalEmail: string;
  coordinatorName: string;
  coordinatorContact: string;
  coordinatorEmail: string;
  studentList?: UploadedFileMeta;
  studentCount: number;
  registrationFee: number;
  parsedStudents?: Array<{
    studentName: string;
    parentName: string;
    class: string;
    section: string;
    rollNo: string;
    school: string;
  }>;
}

export interface AwardsRegistrationData extends BaseRegistration {
  registrationType: "Awards";
  awardCategory:
    | "Best Teacher"
    | "Best Principal"
    | "Best Institution"
    | "Best Innovation"
    | "Best Startup"
    | "Best Researcher"
    | "Talent Recognition";
  nomineeName: string;
  nomineeDesignation: string;
  nomineeInstitution: string;
  achievements: string;
  supportingPdf?: UploadedFileMeta;
  supportingPhotos?: UploadedFileMeta[];
  recommendationLetter?: UploadedFileMeta;
}

export interface GenericRegistrationData extends BaseRegistration {
  registrationType:
    | "Exhibition"
    | "Projects"
    | "Bal Shodh Patrika"
    | "Cultural Program"
    | "Accommodation";
  title?: string;
  description?: string;
}

export type RegistrationRecord =
  | DelegateRegistrationData
  | ConclaveRegistrationData
  | BestPracticeRegistrationData
  | OlympiadRegistrationData
  | AwardsRegistrationData
  | GenericRegistrationData;

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  role: AdminRole;
  createdAt: Timestamp | Date;
}

export const REGISTRATION_TYPE_OPTIONS: RegistrationType[] = [
  "Delegate Registration",
  "Conclave",
  "Awards",
  "Olympiad",
  "Exhibition",
  "Projects",
  "Best Practices",
  "Bal Shodh Patrika",
  "Cultural Program",
  "Accommodation",
];

export const TYPE_COLLECTION_MAP: Record<RegistrationType, string> = {
  "Delegate Registration": "delegate_registrations",
  Conclave: "conclave_registrations",
  "Best Practices": "best_practices",
  Olympiad: "olympiad_registrations",
  Awards: "awards_registrations",
  Accommodation: "accommodation_registrations",
  Exhibition: "registrations",
  Projects: "registrations",
  "Bal Shodh Patrika": "registrations",
  "Cultural Program": "registrations",
};

export const DELEGATE_FEES: Record<string, number> = {
  "Student (Free)": 0,
  "Teacher (₹1000)": 1000,
  "Principal (₹2000)": 2000,
  "Research Scholar (₹2000)": 2000,
  "Director / VC / Chairperson (₹3000)": 3000,
  "Industry Delegate (₹8000)": 8000,
};

export const OLYMPIAD_FEE_PER_STUDENT = 200;
