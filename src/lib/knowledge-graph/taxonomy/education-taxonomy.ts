/** High-level education domain taxonomy */
export const EDUCATION_DOMAINS = [
  "formal-education",
  "non-formal-education",
  "lifelong-learning",
  "indigenous-knowledge",
  "vocational-training",
] as const;

export type EducationDomain = (typeof EDUCATION_DOMAINS)[number];

export const EDUCATION_LEVELS = [
  "early-childhood",
  "primary",
  "secondary",
  "higher",
  "doctoral",
  "professional",
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number];
