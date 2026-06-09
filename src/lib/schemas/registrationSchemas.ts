import { z } from "zod";

export const yesNoSchema = z.enum(["Yes", "No"]);

export const genderSchema = z.enum(["Male", "Female", "Other"]);

export const vidyaBhartiSchema = z.enum(["Vidya Bharti", "Non Vidya Bharti"]);

export const accommodationSchema = z
  .object({
    accommodationRequired: yesNoSchema,
    accommodationDate: z.string().optional(),
    accommodationType: z.string().optional(),
    participantCategory: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accommodationRequired === "Yes") {
      if (!data.accommodationDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Accommodation date is required",
          path: ["accommodationDate"],
        });
      }
      if (!data.accommodationType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Accommodation type is required",
          path: ["accommodationType"],
        });
      }
      if (!data.participantCategory) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Participant category is required",
          path: ["participantCategory"],
        });
      }
    }
  });

export const commonParticipantSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  gender: genderSchema,
  designation: z.string().min(2, "Designation is required"),
  institution: z.string().min(2, "Institution is required"),
  address: z.string().min(5, "Address is required"),
  country: z.string().min(2, "Country is required"),
  email: z.string().email("Valid email is required"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15),
  whatsappNumber: z.string().optional(),
  vidyaBharti: vidyaBhartiSchema,
});

export const paymentSchema = z.object({
  utrNumber: z.string().optional(),
  transactionId: z.string().optional(),
  chequeNumber: z.string().optional(),
  panNumber: z.string().optional(),
});

export const delegateSchema = commonParticipantSchema
  .merge(accommodationSchema)
  .extend({
    delegateCategory: z.enum([
      "Student (Free)",
      "Teacher (₹1000)",
      "Principal (₹2000)",
      "Research Scholar (₹2000)",
      "Director / VC / Chairperson (₹3000)",
      "Industry Delegate (₹8000)",
    ]),
    utrNumber: z.string().optional(),
    transactionId: z.string().optional(),
    chequeNumber: z.string().optional(),
    panNumber: z.string().optional(),
    razorpayPaymentId: z.string().optional(),
    razorpayOrderId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const feeMap: Record<string, number> = {
      "Student (Free)": 0,
      "Teacher (₹1000)": 1000,
      "Principal (₹2000)": 2000,
      "Research Scholar (₹2000)": 2000,
      "Director / VC / Chairperson (₹3000)": 3000,
      "Industry Delegate (₹8000)": 8000,
    };
    const fee = feeMap[data.delegateCategory] ?? 0;
    if (fee > 0) {
      if (!data.utrNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "UTR number is required after payment",
          path: ["utrNumber"],
        });
      }
    }
  });

export const conclaveSchema = commonParticipantSchema
  .merge(accommodationSchema)
  .extend({
    conclaveSelection: z.enum([
      "Vice Chancellor & Director Conclave",
      "School Leaders Conclave",
      "Talent Conclave",
      "Industry Conclave",
      "Startup Conclave",
      "Policy Conclave",
      "Research Conclave",
    ]),
    participationType: z.enum(["Speaker", "Delegate", "Invitee", "Observer"]),
  });

export const bestPracticeSchema = commonParticipantSchema
  .merge(accommodationSchema)
  .extend({
    title: z.string().min(5, "Title is required"),
    organizationName: z.string().min(2, "Organization name is required"),
    areaOfWork: z.enum([
      "Education",
      "Health",
      "Environment",
      "Social Welfare",
      "Skill Development",
      "Innovation",
      "Governance",
      "Other",
    ]),
    briefDescription: z
      .string()
      .refine(
        (val) => val.trim().split(/\s+/).filter(Boolean).length >= 500,
        "Brief description must be at least 500 words"
      ),
    outcomes: z.string().min(10, "Outcomes are required"),
    scopeForReplication: z.string().min(10, "Scope for replication is required"),
    utrNumber: z.string().optional(),
  });

export const olympiadSchema = commonParticipantSchema
  .merge(accommodationSchema)
  .extend({
    olympiadType: z.enum([
      "English Olympiad",
      "Mathematics Olympiad",
      "Tech Olympiad",
    ]),
    schoolName: z.string().min(2, "School name is required"),
    schoolAddress: z.string().min(5, "School address is required"),
    principalName: z.string().min(2, "Principal name is required"),
    principalEmail: z.string().email("Valid principal email is required"),
    coordinatorName: z.string().min(2, "Coordinator name is required"),
    coordinatorContact: z
      .string()
      .min(10, "Coordinator contact must be at least 10 digits"),
    coordinatorEmail: z.string().email("Valid coordinator email is required"),
    studentCount: z.number().min(1, "Upload a valid student list"),
    registrationFee: z.number().min(0),
    utrNumber: z.string().optional(),
  });

export const awardsSchema = commonParticipantSchema
  .merge(accommodationSchema)
  .extend({
    awardCategory: z.enum([
      "Best Teacher",
      "Best Principal",
      "Best Institution",
      "Best Innovation",
      "Best Startup",
      "Best Researcher",
      "Talent Recognition",
    ]),
    nomineeName: z.string().min(2, "Nominee name is required"),
    nomineeDesignation: z.string().min(2, "Nominee designation is required"),
    nomineeInstitution: z.string().min(2, "Nominee institution is required"),
    achievements: z.string().min(10, "Achievements are required"),
    utrNumber: z.string().optional(),
  });

export const genericSchema = commonParticipantSchema
  .merge(accommodationSchema)
  .extend({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Description is required"),
    utrNumber: z.string().optional(),
    razorpayPaymentId: z.string().optional(),
    razorpayOrderId: z.string().optional(),
  });

export type DelegateFormValues = z.infer<typeof delegateSchema>;
export type ConclaveFormValues = z.infer<typeof conclaveSchema>;
export type BestPracticeFormValues = z.infer<typeof bestPracticeSchema>;
export type OlympiadFormValues = z.infer<typeof olympiadSchema>;
export type AwardsFormValues = z.infer<typeof awardsSchema>;
export type GenericFormValues = z.infer<typeof genericSchema>;
