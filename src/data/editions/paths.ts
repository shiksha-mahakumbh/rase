/** Canonical past-edition detail paths */
export const SMK_1_0_PATH = "/past_event/shiksha-mahakumbh-1.0";
export const SMK_2_0_PATH = "/past_event/shiksha-mahakumbh-2.0";
export const SMK_3_0_PATH = "/past_event/shiksha-mahakumbh-3.0";
export const SMK_4_0_PATH = "/past_event/shiksha-mahakumbh-4.0";
export const SMK_5_0_PATH = "/past_event/shiksha-mahakumbh-5.0";

export const EDITION_LEGACY_PATHS: Record<string, string> = {
  "/past_event/sm23": SMK_1_0_PATH,
  "/past_event/sk23": SMK_2_0_PATH,
  "/past_event/sk24": SMK_3_0_PATH,
  "/past_event/sm24": SMK_4_0_PATH,
  "/past_event/sm25": SMK_5_0_PATH,
};

export function resolveEditionPath(href: string): string {
  return EDITION_LEGACY_PATHS[href] ?? href;
}
