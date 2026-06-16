import { RegistrationType } from "@/types/registration";

const PREFIX = "smk_registration_draft_";
const META_KEY = "smk_registration_meta";

export interface RegistrationMeta {
  step: number;
  registrationType: RegistrationType;
  updatedAt: string;
}

export function draftKey(type: RegistrationType) {
  return `${PREFIX}${type.replace(/\s+/g, "_")}`;
}

export function saveDraft(type: RegistrationType, data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const sanitized = { ...data };
    delete sanitized.receipt;
    localStorage.setItem(draftKey(type), JSON.stringify(sanitized));
    // Meta step/type is owned by RegistrationHub — do not force step:2 here.
    const existing = loadMeta();
    if (existing?.registrationType === type) {
      saveMeta({
        ...existing,
        registrationType: type,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch {
    // Quota or private mode — ignore
  }
}

export function loadDraft(type: RegistrationType): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(draftKey(type));
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function loadMeta(): RegistrationMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? (JSON.parse(raw) as RegistrationMeta) : null;
  } catch {
    return null;
  }
}

export function saveMeta(meta: RegistrationMeta) {
  if (typeof window === "undefined") return;
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

/** Reset hub state when user picks a different registration category. */
export function switchRegistrationCategory(type: RegistrationType) {
  if (typeof window === "undefined") return;
  saveMeta({
    step: 1,
    registrationType: type,
    updatedAt: new Date().toISOString(),
  });
  console.info("CATEGORY_RESET", { registrationType: type });
}

/** Clear persisted hub navigation (category picker only). */
export function clearRegistrationMeta() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(META_KEY);
  console.info("CATEGORY_RESET", { registrationType: null, cleared: true });
}

export function clearDraft(type: RegistrationType) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(draftKey(type));
}

export function clearAllRegistrationDrafts() {
  if (typeof window === "undefined") return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem(META_KEY);
}
