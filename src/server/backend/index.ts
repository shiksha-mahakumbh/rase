import type { SaveRegistrationInput, SaveRegistrationResult } from "@/server/services/registration.service";
import * as supabaseRegistration from "@/server/services/registration.service";

export type RegistrationBackend = "supabase";

export interface IRegistrationService {
  saveRegistration(input: SaveRegistrationInput): Promise<SaveRegistrationResult>;
}

class SupabaseRegistrationService implements IRegistrationService {
  saveRegistration(input: SaveRegistrationInput) {
    return supabaseRegistration.saveRegistration(input);
  }
}

export function getRegistrationBackend(): RegistrationBackend {
  return "supabase";
}

export function getRegistrationService(): IRegistrationService {
  return new SupabaseRegistrationService();
}
