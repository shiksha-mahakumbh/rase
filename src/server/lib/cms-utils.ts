export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isPublishedStatus(
  status: string,
  publishAt: Date | null | undefined,
  now = new Date()
): boolean {
  if (status !== "published" && status !== "scheduled") return false;
  if (publishAt && publishAt > now) return false;
  return true;
}

export function isExpired(
  expireAt: Date | null | undefined,
  now = new Date()
): boolean {
  return Boolean(expireAt && expireAt <= now);
}

export function isNoticeVisible(input: {
  status: string;
  publishAt?: Date | null;
  expireAt?: Date | null;
  now?: Date;
}): boolean {
  const now = input.now ?? new Date();
  if (!isPublishedStatus(input.status, input.publishAt, now)) return false;
  if (isExpired(input.expireAt, now)) return false;
  return true;
}

export function isAnnouncementBarActive(input: {
  isActive: boolean;
  startsAt?: Date | null;
  endsAt?: Date | null;
  now?: Date;
}): boolean {
  if (!input.isActive) return false;
  const now = input.now ?? new Date();
  if (input.startsAt && input.startsAt > now) return false;
  if (input.endsAt && input.endsAt <= now) return false;
  return true;
}

export function isDownloadVisible(input: {
  status: string;
  isPublished: boolean;
  isCurrent: boolean;
  expiresAt?: Date | null;
  now?: Date;
}): boolean {
  const now = input.now ?? new Date();
  if (!input.isPublished || !input.isCurrent) return false;
  if (input.status === "archived" || input.status === "draft") return false;
  if (isExpired(input.expiresAt, now)) return false;
  return true;
}
