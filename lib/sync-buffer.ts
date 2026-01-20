import { redis } from "@/lib/redis";

export const SYNC_POOL_KEY = "sync:pool:candidates";

export async function queueProfileSync(userId: string) {
    await redis.sadd(SYNC_POOL_KEY, userId);
}