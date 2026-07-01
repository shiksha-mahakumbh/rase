/** Shared visitor counter constants (safe for client + server). */
export const LEGACY_VISITOR_OFFSET = 94_567;
export const ANALYTICS_TIMEZONE = "Asia/Kolkata";

/**
 * Firestore `visitors/total.count` at Supabase cutover (June 2026).
 * Old footer showed: legacy (94,567) + Firestore total + new hits ≈ 1.5–2 lakh.
 * Default 80,433 → 175,000 display before new Supabase sessions are added.
 */
export const DEFAULT_FIRESTORE_VISITOR_BASELINE = 80_433;

export function resolveFirestoreVisitorBaseline(): number {
  const raw =
    typeof process !== "undefined" ? process.env.VISITOR_FIRESTORE_BASELINE : undefined;
  if (raw != null && raw.trim() !== "") {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  }
  return DEFAULT_FIRESTORE_VISITOR_BASELINE;
}

/** Public all-time counter — matches legacy Firestore increment semantics. */
export function computeVisitorDisplayTotal(liveSessionCount: number): number {
  return (
    LEGACY_VISITOR_OFFSET +
    resolveFirestoreVisitorBaseline() +
    Math.max(0, liveSessionCount)
  );
}
