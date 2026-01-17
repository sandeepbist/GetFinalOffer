import IORedis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is not defined in .env");
}

const globalForRedis = global as unknown as { redis: IORedis };

export const redis =
  globalForRedis.redis ||
  new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    tls: {
      rejectUnauthorized: false,
    },
    retryStrategy(times) {
      return Math.min(times * 50, 2000);
    },

    family: 4,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
