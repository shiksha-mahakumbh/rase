"use client";

import { useEffect } from "react";
import { FieldValues, UseFormReset, UseFormWatch } from "react-hook-form";
import { RegistrationType } from "@/types/registration";
import { loadDraft, saveDraft } from "@/lib/registration/draftStorage";

export function useRegistrationDraft<T extends FieldValues>(
  registrationType: RegistrationType,
  watch: UseFormWatch<T>,
  reset: UseFormReset<T>,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;
    const draft = loadDraft(registrationType);
    if (draft && Object.keys(draft).length > 0) {
      reset(draft as T, { keepDefaultValues: true });
    }
  }, [registrationType, reset, enabled]);

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout>;
    const subscription = watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        saveDraft(registrationType, values as Record<string, unknown>);
      }, 600);
    });
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [watch, registrationType, enabled]);
}
