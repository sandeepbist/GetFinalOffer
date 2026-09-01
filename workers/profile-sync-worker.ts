import db from "@/db";
import { gfoCandidatesTable } from "@/db/schemas";
import { inArray } from "drizzle-orm";
import { redis } from "@/lib/redis";
import { SYNC_POOL_KEY } from "@/lib/sync-buffer";

const BATCH_SIZE = 100;

export const profileSyncProcessor = async () => {
    const userIds = await redis.spop(SYNC_POOL_KEY, BATCH_SIZE);

    if (!userIds || userIds.length === 0) {
        return { processed: 0 };
    }

    console.log(`[BatchSync] Processing batch of ${userIds.length} users...`);

    let candidates;
    try {
        candidates = await db
            .select({
                userId: gfoCandidatesTable.userId,
                yearsExperience: gfoCandidatesTable.yearsExperience,
                location: gfoCandidatesTable.location,
                professionalTitle: gfoCandidatesTable.professionalTitle,
            })
            .from(gfoCandidatesTable)
            .where(inArray(gfoCandidatesTable.userId, userIds as string[]));
    } catch (err) {
        // The ids were already popped off the set; push them back so the
        // next interval run retries them instead of silently dropping them.
        await redis.sadd(SYNC_POOL_KEY, ...(userIds as string[])).catch(() => undefined);
        throw err;
    }

    if (candidates.length === 0) return { processed: 0 };

    const pipeline = redis.pipeline();

    for (const c of candidates) {
        const shadowKey = `candidate:shadow:${c.userId}`;
        pipeline.hset(shadowKey, {
            exp: c.yearsExperience,
            loc: c.location.toLowerCase(),
            role: c.professionalTitle?.toLowerCase() || "",
            indexedAt: Date.now()
        });
        pipeline.expire(shadowKey, 60 * 60 * 24 * 30);
    }

    await pipeline.exec();

    console.log(`[BatchSync] Synced ${candidates.length} profiles.`);

    return { processed: candidates.length };
};