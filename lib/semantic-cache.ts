import { Redis } from "@upstash/redis";
import { Index } from "@upstash/vector";
import type { CandidateSummaryDTO, CandidateSearchFilters } from "@/features/recruiter/candidates-dto";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const vectorIndex = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL || "",
    token: process.env.UPSTASH_VECTOR_REST_TOKEN || "",
});

const CACHE_TTL_SECONDS = 60 * 60 * 24;
const CACHE_PREFIX = "search:cache";
const SEMANTIC_THRESHOLD = 0.95;

interface CachedSearchResult {
    candidates: CandidateSummaryDTO[];
    total: number;
    timestamp: number;
}

interface VectorMetadata {
    cacheKey: string;
}

export class SemanticCache {
    private static normalize(query: string): string {
        return query.trim().toLowerCase().replace(/[^\w\s]/gi, "").replace(/\s+/g, " ");
    }

    private static getExactKey(query: string, filters: CandidateSearchFilters): string {
        const normalized = this.normalize(query);
        const filterKey = JSON.stringify(filters, Object.keys(filters).sort());
        return `${CACHE_PREFIX}:exact:${normalized}:${filterKey}`;
    }

    static async findExact(
        query: string,
        filters: CandidateSearchFilters
    ): Promise<CachedSearchResult | null> {
        const key = this.getExactKey(query, filters);
        try {
            const data = await redis.get<CachedSearchResult>(key);
            return data || null;
        } catch (error) {
            console.warn("⚠️ Redis Exact Cache Read Failed", error);
            return null;
        }
    }


    static async findSemantic(
        queryEmbedding: number[]
    ): Promise<CachedSearchResult | null> {
        try {
            const results = await vectorIndex.query({
                vector: queryEmbedding,
                topK: 1,
                includeMetadata: true,
            });

            if (results.length > 0 && results[0].score >= SEMANTIC_THRESHOLD) {
                const metadata = results[0].metadata as unknown as VectorMetadata;

                if (metadata && metadata.cacheKey) {
                    console.log(`Semantic Cache Hit! (Score: ${results[0].score}) -> Fetching from Redis`);
                    return await redis.get<CachedSearchResult>(metadata.cacheKey);
                }
            }

            return null;
        } catch (error) {
            console.warn("⚠️ Vector Cache Read Failed", error);
            return null;
        }
    }

    static async set(
        query: string,
        filters: CandidateSearchFilters,
        result: { data: CandidateSummaryDTO[]; total: number },
        embedding?: number[]
    ): Promise<void> {
        const key = this.getExactKey(query, filters);
        const payload: CachedSearchResult = {
            candidates: result.data,
            total: result.total,
            timestamp: Date.now(),
        };

        try {
            const l1Promise = redis.set(key, payload, { ex: CACHE_TTL_SECONDS });

            let l2Promise = Promise.resolve();

            if (embedding) {
                const normalizedId = `${this.normalize(query)}-${Date.now()}`;
                l2Promise = vectorIndex.upsert({
                    id: normalizedId,
                    vector: embedding,
                    metadata: { cacheKey: key },
                }).then(() => { });
            }

            await Promise.all([l1Promise, l2Promise]);

        } catch (error) {
            console.warn("⚠️ Cache Write Failed", error);
        }
    }
}