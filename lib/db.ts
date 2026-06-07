/**
 * Legacy MySQL pool — unused by Next.js App Router (Firebase is canonical).
 * Kept as stub; mysql2 removed in Phase 2 dependency cleanup.
 */
export const query = async (_sql: string, _values: unknown[]): Promise<never> => {
  throw new Error(
    "lib/db.ts is deprecated. Use Firebase/Firestore or a Next.js API route."
  );
};
