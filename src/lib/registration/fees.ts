import { RegistrationType } from "@/types/registration";
import { delegateFeeForCategory as lookupDelegateFee } from "@/lib/registration/delegate-categories";

export const PROJECT_SCHOOL_STUDENT_FEE = 200;
export const PROJECT_COLLEGE_STUDENT_FEE = 400;

export const ACCOMMODATION_SINGLE_BED_FEE = 3000;
export const ACCOMMODATION_DOUBLE_BED_FEE = 6000;

export type ProjectStudentType = "School Student" | "College Student";
export type AccommodationBedType = "Single Bed" | "Double Bed";

export function projectFeeForStudentType(type: ProjectStudentType): number {
  return type === "College Student"
    ? PROJECT_COLLEGE_STUDENT_FEE
    : PROJECT_SCHOOL_STUDENT_FEE;
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
      return options.accommodationBedType
        ? accommodationFeeForBedType(options.accommodationBedType)
        : 0;
    default:
      return 0;
  }
}

export function requiresPaymentForFee(fee: number): boolean {
  return fee > 0;
}
