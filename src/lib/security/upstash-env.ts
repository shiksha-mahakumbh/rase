/** Vercel Upstash integration uses KV_REST_API_*; manual setup uses UPSTASH_REDIS_REST_*. */
export function getUpstashRestCredentials(): { url: string; token: string } | null {
  const url = (
    process.env.UPSTASH_REDIS_REST_URL ??
    process.env.KV_REST_API_URL ??
    ""
  ).replace(/\/$/, "");
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";
  if (!url || !token) return null;
  return { url, token };
}

export function isUpstashConfigured(): boolean {
  return getUpstashRestCredentials() !== null;
}
