import { Worker, Job, ConnectionOptions } from "bullmq";
import { createHash } from "crypto";
import db from "@/db";
import { gfoCandidateResumeChunksTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { generateEmbeddingsBatch } from "@/lib/ai";
import { redis } from "@/lib/redis";
import { getWorkerDrainDelaySeconds } from "@/lib/worker-config";
import {
    ExtractorOutput,
    VectorizerOutput
} from "./ingestion-dto";

function hashText(text: string): string {
    return createHash("sha256").update(text).digest("hex");
}

export const vectorizerWorker = new Worker<ExtractorOutput, VectorizerOutput>(
    "ingestion-vectorizer",
    async (job: Job<ExtractorOutput>) => {
        // In flow mode this job's data carries the extractor's payload;
        // it is set from the child's completed output when the flow parent
        // waits, but getChildrenValues is authoritative — read the child's
        // actual result so a resumed/retried chain always uses real data.
        const childValues = await job.getChildrenValues<ExtractorOutput>();
        const childKeys = Object.keys(childValues);
        const extractorOutput =
            childKeys.length > 0
                ? childValues[childKeys[0]]
                : job.data;

        const { userId, rawChunks, extractedSkills } = extractorOutput;

        console.log(`[Vectorizer] Starting for User: ${userId}. Chunks: ${rawChunks.length}`);

        if (rawChunks.length === 0) {
            return {
                userId,
                vectors: [],
                chunkIds: [],
                rawChunks: [],
                extractedSkills: []
            };
        }

        const existingRows = await db
            .select({
                content: gfoCandidateResumeChunksTable.chunkContent,
                embedding: gfoCandidateResumeChunksTable.embedding,
            })
            .from(gfoCandidateResumeChunksTable)
            .where(eq(gfoCandidateResumeChunksTable.candidateUserId, userId));

        const existingMap = new Map<string, number[]>();
        for (const row of existingRows) {
            if (row.embedding && row.content) {
                existingMap.set(hashText(row.content), row.embedding);
            }
        }

        const finalEmbeddings: number[][] = new Array(rawChunks.length);
        const indicesToEmbed: number[] = [];
        const textsToEmbed: string[] = [];

        for (let i = 0; i < rawChunks.length; i++) {
            const text = rawChunks[i];
            const hash = hashText(text);

            if (existingMap.has(hash)) {
                finalEmbeddings[i] = existingMap.get(hash)!;
            } else {
                indicesToEmbed.push(i);
                textsToEmbed.push(text);
            }
        }

        if (textsToEmbed.length > 0) {
            console.log(`[Vectorizer] 💸 Generating ${textsToEmbed.length} new embeddings`);
            const newVectors = await generateEmbeddingsBatch(textsToEmbed);
            newVectors.forEach((vec, idx) => {
                const originalIndex = indicesToEmbed[idx];
                finalEmbeddings[originalIndex] = vec;
            });
        }

        const chunkIds = rawChunks.map(() => crypto.randomUUID());

        return {
            userId,
            vectors: finalEmbeddings,
            chunkIds,
            rawChunks,
            extractedSkills
        };
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
