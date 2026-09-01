import { Redis } from "@upstash/redis";

/**
 * Minimal secondary-storage adapter for better-auth (rate limiting).
 * better-auth calls get/set with TTLs in seconds; Upstash REST handles both.
 * When Upstash env vars are absent the adapter returns inert no-ops so auth
 * still boots — rate limiting then falls back to per-instance memory.
 */
function makeUpstashSecondaryStorage() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });

  return {
    get: async (key: string): Promise<string | null> => {
      try {
        return await redis.get<string>(key);
      } catch {
        return null;
      }
    },
    set: async (key: string, value: string, ttl?: number): Promise<void> => {
      try {
        if (ttl && ttl > 0) {
          await redis.set(key, value, { ex: ttl });
        } else {
          await redis.set(key, value);
        }
      } catch {
        // Rate-limit bookkeeping must never break the auth request path.
      }
    },
    delete: async (key: string): Promise<null> => {
      try {
        await redis.del(key);
      } catch {
        // Same rule: storage failures are swallowed.
      }
      return null;
    },
  };
}

export const upstashSecondaryStorage = makeUpstashSecondaryStorage();
