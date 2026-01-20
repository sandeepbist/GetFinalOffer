import { Worker, Job, ConnectionOptions } from "bullmq";
import db from "@/db";
import {
    gfoCandidateResumeChunksTable,
    gfoCandidatesTable
} from "@/db/schemas";
import { eq } from "drizzle-orm";
import { redis } from "@/lib/redis";
import { VectorizerOutput } from "./ingestion-dto";

async function syncShadowProfile(userId: string) {
    const [candidate] = await db
        .select({
            yearsExperience: gfoCandidatesTable.yearsExperience,
            location: gfoCandidatesTable.location,
            professionalTitle: gfoCandidatesTable.professionalTitle,
        })
        .from(gfoCandidatesTable)
        .where(eq(gfoCandidatesTable.userId, userId));

    if (!candidate) return;

    const shadowKey = `candidate:shadow:${userId}`;
    await redis.hset(shadowKey, {
        exp: candidate.yearsExperience,
        loc: candidate.location.toLowerCase(),
        role: candidate.professionalTitle?.toLowerCase() || "",
        indexedAt: Date.now()
    });
    await redis.expire(shadowKey, 60 * 60 * 24 * 30);
}

export const broadcasterWorker = new Worker<VectorizerOutput>(
    "ingestion-broadcaster",
    async (job: Job<VectorizerOutput>) => {
        const { userId, vectors, rawChunks, extractedSkills } = job.data;
        console.log(`[Broadcaster] 📡 Going Live for User: ${userId}`);

        await db.transaction(async (tx) => {
            await tx.delete(gfoCandidateResumeChunksTable)
                .where(eq(gfoCandidateResumeChunksTable.candidateUserId, userId));

            if (vectors.length > 0) {
                const chunksData = rawChunks.map((text, idx) => ({
                    candidateUserId: userId,
                    chunkContent: text,
                    chunkIndex: idx,
                    embedding: vectors[idx],
                }));
                await tx.insert(gfoCandidateResumeChunksTable).values(chunksData);
            }
        });

        const pipeline = redis.pipeline();

        for (const skill of extractedSkills) {
            if (skill.confidence > 0.6) {
                const skillKey = `idx:skill:${skill.name.toLowerCase().replace(/\s+/g, '-')}`;
                pipeline.sadd(skillKey, userId);
            }
        }

        pipeline.zadd("search:pool:all", Date.now(), userId);

        await pipeline.exec();

        await syncShadowProfile(userId);

        console.log(`[Broadcaster] ✅ User ${userId} is now LIVE in Search.`);
        return { success: true };
    },
    {
        connection: redis as unknown as ConnectionOptions,
        concurrency: 1,
        drainDelay: 60000,
        skipStalledCheck: true
    }
);
