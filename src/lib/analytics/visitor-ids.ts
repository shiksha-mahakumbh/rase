export {
  LEGACY_VISITOR_OFFSET,
  ANALYTICS_TIMEZONE,
  computeVisitorDisplayTotal,
  DEFAULT_FIRESTORE_VISITOR_BASELINE,
  resolveFirestoreVisitorBaseline,
} from "@/lib/analytics/visitor-stats-constants";

const VISITOR_ID_KEY = "smk_visitor_id";
const SESSION_ID_KEY = "smk_session_id";

function randomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = randomId();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = randomId();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}
