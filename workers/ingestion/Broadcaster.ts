import { Worker, Job, ConnectionOptions } from "bullmq";
import db from "@/db";
import {
    gfoCandidateResumeChunksTable,
    gfoCandidatesTable
} from "@/db/schemas";
import { eq } from "drizzle-orm";
import { redis } from "@/lib/redis";
import { queueGraphSync } from "@/lib/graph/sync";
import { SemanticCache } from "@/lib/semantic-cache";
import { normalizeSkill, toGraphSkillKey } from "@/lib/graph/normalize-skill";
import { getWorkerDrainDelaySeconds } from "@/lib/worker-config";
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
        // Flow root: waits on the vectorizer child; its completed output is
        // the actual input here. Fall back to job.data for standalone adds.
        const childValues = await job.getChildrenValues<VectorizerOutput>();
        const childKeys = Object.keys(childValues);
        const vectorizerOutput =
            childKeys.length > 0
                ? childValues[childKeys[0]]
                : job.data;

        const { userId, vectors, rawChunks, extractedSkills } = vectorizerOutput;
        console.log(`[Broadcaster] User ${userId} going live in search.`);

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
        const extractedSkillKey = `candidate:extracted-skills:${userId}`;
        pipeline.del(extractedSkillKey);

        for (const skill of extractedSkills) {
            if (skill.confidence > 0.6) {
                // Must use the same slugger as SearchEngine/graph-sync so all
                // readers agree on idx:skill:* keys (e.g. "Node.js" -> nodejs).
                const skillKey = toGraphSkillKey(skill.name);
                if (skillKey) {
                    pipeline.sadd(`idx:skill:${skillKey}`, userId);
                }
            }

            if (skill.confidence >= 0.45) {
                const normalized = normalizeSkill(skill.name);
                if (normalized) {
                    pipeline.hset(
                        extractedSkillKey,
                        normalized,
                        JSON.stringify({
                            name: skill.name,
                            normalizedName: normalized,
                            confidence: skill.confidence,
                            evidenceType: skill.evidenceType,
                        })
                    );
                }
            }
        }

        pipeline.zadd("search:pool:all", Date.now(), userId);
        pipeline.expire(extractedSkillKey, 60 * 60 * 24 * 30);

        await pipeline.exec();

        await syncShadowProfile(userId);
        // Fresh skills just replaced the old ones; drop every cached search
        // payload containing this candidate so recruiters never see the
        // previous resume's skill set for the rest of the cache TTL.
        await SemanticCache.invalidateCandidate(userId).catch((err) =>
            console.warn("Failed to invalidate search cache for candidate", userId, err)
        );
        await queueGraphSync({
            userId,
            reason: "resume_ingestion",
            extractedSkills,
        });

        console.log(`[Broadcaster] User ${userId} indexed.`);
        return { success: true };
    },
    {
        connection: redis as unknown as ConnectionOptions,
        concurrency: 1,
        drainDelay: getWorkerDrainDelaySeconds() * 1000,
        // Stalled checks on: a dead worker's jobs retry per attempts.
        // Locks auto-renew while the process is alive, so long healthy
        // jobs are never falsely marked stalled.
        maxStalledCount: 2,
        stalledInterval: 30 * 1000
    }
);
