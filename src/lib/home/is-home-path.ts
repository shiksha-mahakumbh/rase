import { locales } from "@/i18n/config";

export function isHomePath(pathname: string): boolean {
  if (pathname === "/") return true;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 1) return false;
  return (locales as readonly string[]).includes(segments[0]!);
}

export const WELCOME_MODAL_SEEN_KEY = "smk_announcement_seen";
export const WELCOME_MODAL_CLOSED_EVENT = "smk-welcome-modal-closed";

export function notifyWelcomeModalClosed(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(WELCOME_MODAL_CLOSED_EVENT));
}
