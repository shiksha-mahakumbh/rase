import { z } from "zod";
import {
  PROJECT_STUDENT_TYPE_LABELS,
  type ProjectStudentType,
} from "@/lib/registration/fees";

const PROJECT_STUDENT_TYPES = Object.keys(
  PROJECT_STUDENT_TYPE_LABELS
) as [ProjectStudentType, ...ProjectStudentType[]];

export const projectStudentTypeSchema = z.enum(PROJECT_STUDENT_TYPES);

export function parseProjectStudentType(
  value: unknown,
  categoryFallback?: string
): ProjectStudentType {
  if (value === "University Student" || value === "College Student" || value === "School Student") {
    return value;
  }
  const cat = String(categoryFallback ?? "");
  if (/university/i.test(cat)) return "University Student";
  if (/college/i.test(cat)) return "College Student";
  return "School Student";
}
