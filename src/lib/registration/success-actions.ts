import { EVENT_NAME } from "@/types/registration";
import { event } from "@/design/tokens";

/** Build a minimal ICS calendar file for SMK 6.0. */
export function buildSmk6CalendarIcs(): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shiksha Mahakumbh//SMK 6.0//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:smk-6.0@shikshamahakumbh.com",
    "DTSTAMP:20260529T000000Z",
    "DTSTART;VALUE=DATE:20261009",
    "DTEND;VALUE=DATE:20261012",
    `SUMMARY:${EVENT_NAME}`,
    `LOCATION:${event.venue}`,
    "DESCRIPTION:India's premier multidisciplinary education summit — NEP 2020 alignment.",
    "URL:https://www.rase.co.in/registration",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

export function downloadSmk6Calendar(): void {
  const blob = new Blob([buildSmk6CalendarIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "shiksha-mahakumbh-6.0.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function shareRegistrationSuccess(registrationId: string | null): Promise<boolean> {
  const text = registrationId
    ? `I'm registered for ${EVENT_NAME}! Registration #${registrationId}. Join me: https://www.rase.co.in/registration`
    : `I'm registered for ${EVENT_NAME}! Join me: https://www.rase.co.in/registration`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: EVENT_NAME,
        text,
        url: "https://www.rase.co.in/registration",
      });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
