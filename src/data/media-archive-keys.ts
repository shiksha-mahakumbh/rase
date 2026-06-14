/**
 * Canonical media archive keys — edition-based under shiksha-mahakumbh.
 * URL shape: /media/shiksha-mahakumbh/{edition}/{type}
 */
export type MediaArchiveKey =
  | "shiksha-mahakumbh/1.0/digital"
  | "shiksha-mahakumbh/2.0/digital"
  | "shiksha-mahakumbh/3.0/digital"
  | "shiksha-mahakumbh/4.0/digital"
  | "shiksha-mahakumbh/1.0/print"
  | "shiksha-mahakumbh/2.0/print"
  | "shiksha-mahakumbh/3.0/print"
  | "shiksha-mahakumbh/4.0/print";

export const MEDIA_ARCHIVE_KEYS: MediaArchiveKey[] = [
  "shiksha-mahakumbh/4.0/digital",
  "shiksha-mahakumbh/3.0/digital",
  "shiksha-mahakumbh/2.0/digital",
  "shiksha-mahakumbh/1.0/digital",
  "shiksha-mahakumbh/4.0/print",
  "shiksha-mahakumbh/3.0/print",
  "shiksha-mahakumbh/2.0/print",
  "shiksha-mahakumbh/1.0/print",
];

export function isMediaArchiveKey(key: string): key is MediaArchiveKey {
  return (MEDIA_ARCHIVE_KEYS as string[]).includes(key);
}
