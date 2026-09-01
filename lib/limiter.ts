import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const searchLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit/search",
});

export const uploadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "@upstash/ratelimit/upload",
});

export interface LimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const ALLOW_ALL: LimitResult = {
  success: true,
  limit: 0,
  remaining: Number.MAX_SAFE_INTEGER,
  reset: 0,
};

/**
 * Rate-limit a request, failing open when the limiter backend is unavailable.
 * A limiter outage must not take the endpoint down with it.
 */
export async function limitOrPassThrough(
  limiter: Ratelimit,
  identifier: string
): Promise<LimitResult> {
  try {
    return await limiter.limit(identifier);
  } catch (error) {
    console.warn("Rate limiter unavailable, allowing request", error);
    return ALLOW_ALL;
  }
}
