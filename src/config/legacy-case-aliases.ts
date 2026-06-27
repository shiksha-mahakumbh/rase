/** Exact-case legacy URL aliases — must not live in next.config redirects (case-insensitive loops). */
export const LEGACY_CASE_ALIASES: Readonly<Record<string, string>> = {
  "/Proceeding1": "/proceeding1",
  "/Proceeding2": "/proceeding2",
  "/Proceeding3": "/proceeding3",
  "/batonceremony": "/BatonCeremony",
  "/residentialcamp": "/ResidentialCamp",
};

export function legacyCaseAliasDestination(pathname: string): string | undefined {
  return LEGACY_CASE_ALIASES[pathname];
}
