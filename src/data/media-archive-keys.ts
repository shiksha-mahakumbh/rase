export type MediaArchiveKey =
  | "shiksha-mahakumbh/2024/digital"
  | "shiksha-mahakumbh/2023/digital"
  | "shiksha-kumbh/2024/digital"
  | "shiksha-kumbh/2023/digital"
  | "shiksha-mahakumbh/2024/print"
  | "shiksha-mahakumbh/2023/print"
  | "shiksha-kumbh/2024/print"
  | "shiksha-kumbh/2023/print";

export const MEDIA_ARCHIVE_KEYS: MediaArchiveKey[] = [
  "shiksha-mahakumbh/2024/digital",
  "shiksha-mahakumbh/2023/digital",
  "shiksha-kumbh/2024/digital",
  "shiksha-kumbh/2023/digital",
  "shiksha-mahakumbh/2024/print",
  "shiksha-mahakumbh/2023/print",
  "shiksha-kumbh/2024/print",
  "shiksha-kumbh/2023/print",
];

export function isMediaArchiveKey(key: string): key is MediaArchiveKey {
  return (MEDIA_ARCHIVE_KEYS as string[]).includes(key);
}
