import { event } from "@/design/tokens";

export type CountdownSnapshot = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
};

export function getEventStartDate(): Date {
  return new Date(`${event.startDate}T09:00:00`);
}

export function getCountdownSnapshot(now = Date.now()): CountdownSnapshot {
  const diff = getEventStartDate().getTime() - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, ended: false };
}
