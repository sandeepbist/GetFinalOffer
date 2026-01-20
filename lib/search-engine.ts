import { redis } from "@/lib/redis";
import type { CandidateSearchFilters } from "@/features/recruiter/candidates-dto";

interface ShadowProfile {
    id: string;
    exp: number;
    loc: string;
    role: string;
}

const SEARCH_POOL_KEY = "search:pool:all";
const MAX_SEARCH_POOL_SIZE = 200;

export class SearchEngine {

    static async searchLive(
        query: string | undefined,
        filters: CandidateSearchFilters,
        page: number,
        pageSize: number
    ): Promise<{ ids: string[]; total: number }> {

        let candidateIds: string[] = [];

        if (!query || query.trim() === "") {
            candidateIds = await redis.zrevrange(SEARCH_POOL_KEY, 0, MAX_SEARCH_POOL_SIZE - 1);
        } else {
            const normalizedSkill = query.toLowerCase().trim().replace(/\s+/g, "-");
            const skillKey = `idx:skill:${normalizedSkill}`;

            candidateIds = await redis.smembers(skillKey);
        }

        if (candidateIds.length === 0) {
            return { ids: [], total: 0 };
        }

        const pipeline = redis.pipeline();
        for (const id of candidateIds) {
            pipeline.hgetall(`candidate:shadow:${id}`);
        }

        const rawShadows = await pipeline.exec();

        const validCandidates: ShadowProfile[] = [];

        rawShadows?.forEach((result, idx) => {
            const [err, data] = result as [Error | null, Record<string, string>];
            const id = candidateIds[idx];

            if (!err && data && Object.keys(data).length > 0) {
                validCandidates.push({
                    id,
                    exp: parseInt(data.exp || "0", 10),
                    loc: data.loc || "",
                    role: data.role || "",
                });
            }
        });

        const filtered = validCandidates.filter((c) => {
            if (filters.minYears && c.exp < filters.minYears) {
                return false;
            }
            return true;
        });

        const total = filtered.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        const pagedIds = filtered
            .slice(startIndex, endIndex)
            .map((c) => c.id);

        return { ids: pagedIds, total };
    }
}
