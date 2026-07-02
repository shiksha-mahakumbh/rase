import { RegistrationType } from "@/types/registration";
import { delegateFeeForCategory as lookupDelegateFee } from "@/lib/registration/delegate-categories";

/** School Level Project */
export const PROJECT_SCHOOL_STUDENT_FEE = 200;
/** College Level Project */
export const PROJECT_COLLEGE_STUDENT_FEE = 500;
/** University Level Project */
export const PROJECT_UNIVERSITY_STUDENT_FEE = 500;

/** @deprecated Standalone accommodation registration removed — lodging opens September 2026 */
export const ACCOMMODATION_SINGLE_BED_FEE = 3000;
/** @deprecated Standalone accommodation registration removed */
export const ACCOMMODATION_DOUBLE_BED_FEE = 6000;

export type ProjectStudentType =
  | "School Student"
  | "College Student"
  | "University Student";

export type AccommodationBedType = "Single Bed" | "Double Bed";

export const PROJECT_STUDENT_TYPE_LABELS: Record<
  ProjectStudentType,
  { short: string; fee: number }
> = {
  "School Student": { short: "School Level Project", fee: PROJECT_SCHOOL_STUDENT_FEE },
  "College Student": { short: "College Level Project", fee: PROJECT_COLLEGE_STUDENT_FEE },
  "University Student": { short: "University Level Project", fee: PROJECT_UNIVERSITY_STUDENT_FEE },
};

export function projectFeeForStudentType(type: ProjectStudentType): number {
  return PROJECT_STUDENT_TYPE_LABELS[type]?.fee ?? PROJECT_SCHOOL_STUDENT_FEE;
}

export function accommodationFeeForBedType(type: AccommodationBedType): number {
  return type === "Double Bed"
    ? ACCOMMODATION_DOUBLE_BED_FEE
    : ACCOMMODATION_SINGLE_BED_FEE;
}

export function delegateFeeForCategory(category: string | undefined): number {
  return lookupDelegateFee(category);
}

export function resolveRegistrationFee(
  registrationType: RegistrationType,
  options: {
    delegateCategory?: string;
    projectStudentType?: ProjectStudentType;
    accommodationBedType?: AccommodationBedType;
  } = {}
): number {
  switch (registrationType) {
    case "Delegate Registration":
      return delegateFeeForCategory(options.delegateCategory);
    case "Projects":
      return options.projectStudentType
        ? projectFeeForStudentType(options.projectStudentType)
        : PROJECT_SCHOOL_STUDENT_FEE;
    case "Accommodation":
      return 0;
    default:
      return 0;
  }
}

export function requiresPaymentForFee(fee: number): boolean {
  return fee > 0;
}
