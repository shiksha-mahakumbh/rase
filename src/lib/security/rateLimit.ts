/**
 * Rate limiting — in-memory fallback + optional Upstash Redis REST (distributed).
 */
import { getUpstashRestCredentials } from "@/lib/security/upstash-env";
type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
};

export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  const entry = store.get(options.key);

  if (!entry || now > entry.resetAt) {
    store.set(options.key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      ok: true,
      remaining: options.limit - 1,
      retryAfterSec: Math.ceil(options.windowMs / 1000),
    };
  }

  if (entry.count >= options.limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    ok: true,
    remaining: options.limit - entry.count,
    retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
  };
}

async function upstashRateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult | null> {
  const creds = getUpstashRestCredentials();
  if (!creds) return null;
  const { url: baseUrl, token } = creds;

  const redisKey = `rl:${options.key}`;
  const windowSec = Math.max(1, Math.ceil(options.windowMs / 1000));

  const res = await fetch(`${baseUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["TTL", redisKey],
    ]),
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { result?: unknown }[];
  const count = Number(data[0]?.result ?? 0);
  let ttl = Number(data[1]?.result ?? -1);

  if (count === 1 || ttl < 0) {
    await fetch(`${baseUrl}/expire/${encodeURIComponent(redisKey)}/${windowSec}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    ttl = windowSec;
  }

  const remaining = Math.max(0, options.limit - count);
  return {
    ok: count <= options.limit,
    remaining,
    retryAfterSec: ttl > 0 ? ttl : windowSec,
  };
}

/** Prefer Upstash when configured; falls back to in-memory. */
export async function rateLimitAsync(options: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<RateLimitResult> {
  try {
    const distributed = await upstashRateLimit(options);
    if (distributed) return distributed;
  } catch (error) {
    console.warn("Distributed rate limit unavailable, using in-memory fallback", error);
  }
  return rateLimit(options);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
