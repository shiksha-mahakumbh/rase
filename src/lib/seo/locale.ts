/** Map app locale codes to Open Graph locale tags. */
export function openGraphLocale(appLocale: string): "en_IN" | "hi_IN" {
  return appLocale === "hi" ? "hi_IN" : "en_IN";
}
