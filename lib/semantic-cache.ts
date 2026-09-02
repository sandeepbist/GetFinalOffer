import { Redis } from "@upstash/redis";
import { Index } from "@upstash/vector";
import type { CandidateSummaryDTO, CandidateSearchFilters } from "@/features/recruiter/candidates-dto";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const CACHE_TTL_SECONDS = 60 * 60 * 24;
const CACHE_PREFIX = "search:cache";
const MEMBER_PREFIX = "search:cache:member";
const SEMANTIC_THRESHOLD = 0.95;

interface CachedSearchResult {
    candidates: CandidateSummaryDTO[];
    total: number;
    timestamp: number;
}

interface VectorMetadata {
    cacheKey: string;
}

/**
 * The Upstash Vector client throws at construction when its env vars are
 * missing, which would take down every module importing this file. Build it
 * lazily instead: without Vector configured, the L2 tier is simply skipped
 * and search still works.
 */
let vectorIndex: Index | null = null;
function getVectorIndex(): Index | null {
    if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
        return null;
    }
    if (!vectorIndex) {
        vectorIndex = new Index({
            url: process.env.UPSTASH_VECTOR_REST_URL,
            token: process.env.UPSTASH_VECTOR_REST_TOKEN,
        });
    }
    return vectorIndex;
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

    /**
     * Deterministic vector id: one vector per (query, filter-set) pair. The
     * recruiter organisation lives directly in the id, so a semantic hit from
     * another organisation cannot even match the id, let alone cross-deliver
     * its payload — this replaces the older hash-fingerprint check and has no
     * collision path.
     */
    private static getVectorId(query: string, filters: CandidateSearchFilters): string {
        const normalized = this.normalize(query);
        const filterKey = JSON.stringify(filters, Object.keys(filters).sort());
        return `${normalized}::${filterKey}`;
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
            console.warn("Redis exact cache read failed", error);
            return null;
        }
    }

    static async findSemantic(
        queryEmbedding: number[]
    ): Promise<CachedSearchResult | null> {
        // Org safety lives in the deterministic vector id (per query+filter
        // pair), so a cross-org query never retrieves another org's vector.
        try {
            const index = getVectorIndex();
            if (!index) return null;

            const results = await index.query({
                vector: queryEmbedding,
                topK: 1,
                includeMetadata: true,
            });

            if (results.length > 0 && results[0].score >= SEMANTIC_THRESHOLD) {
                const metadata = results[0].metadata as unknown as VectorMetadata;

                if (metadata && metadata.cacheKey) {
                    console.debug(`Semantic cache hit (score: ${results[0].score})`);
                    return await redis.get<CachedSearchResult>(metadata.cacheKey);
                }
            }

            return null;
        } catch (error) {
            console.warn("Vector cache read failed", error);
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
            const memberKey = (userId: string) => `${MEMBER_PREFIX}:${userId}`;

            const pipeline = redis.pipeline();
            pipeline.set(key, payload, { ex: CACHE_TTL_SECONDS });
            // Track which cached payloads contain each candidate so a
            // profile or resume change can invalidate exactly those keys.
            for (const candidate of result.data) {
                pipeline.sadd(memberKey(candidate.id), key);
                pipeline.expire(memberKey(candidate.id), CACHE_TTL_SECONDS);
            }
            await pipeline.exec();

            if (embedding) {
                const index = getVectorIndex();
                if (index) {
                    // Deterministic id: overwrites the previous vector for the
                    // same query+filters instead of accumulating a new one per
                    // write.
                    await index.upsert({
                        id: this.getVectorId(query, filters),
                        vector: embedding,
                        metadata: { cacheKey: key },
                    });
                }
            }
        } catch (error) {
            console.warn("Cache write failed", error);
        }
    }

    /**
     * Drop every cached search payload containing this candidate. Called
     * when their profile or resume changes so recruiters never see a stale
     * skill set for the remainder of the cache TTL.
     */
    static async invalidateCandidate(userId: string): Promise<void> {
        try {
            const memberKey = `${MEMBER_PREFIX}:${userId}`;
            const keys = await redis.smembers(memberKey);
            await redis.del(memberKey);

            if (keys.length > 0) {
                await redis.del(...keys);
            }

            // The vector payloads die with their Redis keys; their vector
            // entries become inert pointers and are overwritten by the next
            // write for the same query (deterministic ids guarantee reuse).
        } catch (error) {
            console.warn("Cache invalidation failed", error);
        }
    }
}
