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
        const { userId, rawChunks, extractedSkills } = job.data;

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
        drainDelay: getWorkerDrainDelaySeconds(),
        skipStalledCheck: true
    }
);
