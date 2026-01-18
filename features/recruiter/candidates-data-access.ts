import db from "@/db";
import {
    gfoUserTable,
    gfoCandidatesTable,
    gfoCandidateSkillsTable,
    gfoSkillsLibraryTable,
    gfoCandidateHiddenOrganisationsTable
} from "@/db/schemas";
import { eq, and, gte, isNull, desc, inArray } from "drizzle-orm";
import { generateEmbedding } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import { SemanticCache } from "@/lib/semantic-cache";
import type { CandidateSummaryDTO, CandidateSearchFilters, CandidateMatchResult, SearchResult } from "@/features/recruiter/candidates-dto";

const THRESHOLD_STRICT = 0.32;
const THRESHOLD_LOOSE = 0.10;
const RECALL_POOL_SIZE = 50;

export async function searchCandidatesHybrid(
    query: string,
    page: number,
    pageSize: number,
    filters: CandidateSearchFilters
): Promise<SearchResult> {

    if (!query) {
        return getBrowseResults(page, pageSize, filters);
    }

    if (page === 1) {
        const cached = await SemanticCache.findExact(query, filters);
        if (cached) {
            return { data: cached.candidates, total: cached.total };
        }
    }

    let candidateIds: string[] = [];
    const matchScores: Record<string, number> = {};
    const matchHighlights: Record<string, string> = {};
    let queryVector: number[] | undefined;

    try {
        queryVector = await generateEmbedding(query);

        const semanticCached = await SemanticCache.findSemantic(queryVector);
        if (semanticCached) {
            return { data: semanticCached.candidates, total: semanticCached.total };
        }

        const runSearch = async (threshold: number) => {
            return await supabase.rpc("match_candidates_hybrid", {
                query_embedding: queryVector,
                query_text: query,
                match_threshold: threshold,
                match_count: RECALL_POOL_SIZE,
                min_experience: filters.minYears,
                blocked_org_ids: [filters.recruiterOrgId],
            });
        };

        const response = await runSearch(THRESHOLD_STRICT);
        let rawMatches = (response.data || []) as CandidateMatchResult[];

        if (rawMatches.length < 5) {
            const looseResponse = await runSearch(THRESHOLD_LOOSE);
            const looseMatches = (looseResponse.data || []) as CandidateMatchResult[];

            const existingIds = new Set(rawMatches.map((x) => x.candidate_id));
            const newMatches = looseMatches.filter(
                (x) => !existingIds.has(x.candidate_id)
            );

            rawMatches = [...rawMatches, ...newMatches];
        }

        const totalMatches = rawMatches.length;

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        const pagedMatches = rawMatches.slice(startIndex, endIndex);

        candidateIds = pagedMatches.map((m) => m.candidate_id);
        pagedMatches.forEach((m) => {
            matchScores[m.candidate_id] = m.match_score;
            matchHighlights[m.candidate_id] = m.match_content;
        });

        const result = await hydrateCandidates(candidateIds, page, pageSize, matchScores, matchHighlights);

        const finalResult = { data: result.data, total: totalMatches };

        if (page === 1 && finalResult.data.length > 0) {
            SemanticCache.set(query, filters, finalResult, queryVector)
                .catch(err => console.error("Cache Write Error", err));
        }

        return finalResult;

    } catch (error) {
        console.error("Vector Search Failed", error);
        return { data: [], total: 0 };
    }
}

async function getBrowseResults(
    page: number,
    pageSize: number,
    filters: CandidateSearchFilters
): Promise<SearchResult> {
    const baseQuery = db
        .select({ id: gfoCandidatesTable.userId })
        .from(gfoCandidatesTable)
        .leftJoin(
            gfoCandidateHiddenOrganisationsTable,
            and(
                eq(gfoCandidateHiddenOrganisationsTable.candidateUserId, gfoCandidatesTable.userId),
                eq(gfoCandidateHiddenOrganisationsTable.organisationId, filters.recruiterOrgId)
            )
        )
        .where(and(
            gte(gfoCandidatesTable.yearsExperience, filters.minYears),
            isNull(gfoCandidateHiddenOrganisationsTable.id)
        ))
        .orderBy(desc(gfoCandidatesTable.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

    const rows = await baseQuery;
    const ids = rows.map(r => r.id);

    if (ids.length === 0) return { data: [], total: 0 };

    return hydrateCandidates(ids, page, pageSize);
}

async function hydrateCandidates(
    candidateIds: string[],
    page: number,
    pageSize: number,
    matchScores: Record<string, number> = {},
    matchHighlights: Record<string, string> = {}
): Promise<SearchResult> {
    if (candidateIds.length === 0) return { data: [], total: 0 };

    const rows = await db
        .select({
            id: gfoUserTable.id,
            name: gfoUserTable.name,
            image: gfoUserTable.image,
            title: gfoCandidatesTable.professionalTitle,
            location: gfoCandidatesTable.location,
            yearsExperience: gfoCandidatesTable.yearsExperience,
        })
        .from(gfoUserTable)
        .innerJoin(gfoCandidatesTable, eq(gfoCandidatesTable.userId, gfoUserTable.id))
        .where(inArray(gfoCandidatesTable.userId, candidateIds));


    const userIds = rows.map((r) => r.id);
    const skillsMap: Record<string, string[]> = {};

    if (userIds.length > 0) {
        const skillsRows = await db
            .select({
                userId: gfoCandidateSkillsTable.candidateUserId,
                name: gfoSkillsLibraryTable.name,
            })
            .from(gfoCandidateSkillsTable)
            .innerJoin(
                gfoSkillsLibraryTable,
                eq(gfoSkillsLibraryTable.id, gfoCandidateSkillsTable.skillId)
            )
            .where(inArray(gfoCandidateSkillsTable.candidateUserId, userIds));

        skillsRows.forEach((s) => {
            if (!skillsMap[s.userId]) skillsMap[s.userId] = [];
            skillsMap[s.userId].push(s.name);
        });
    }

    const results: CandidateSummaryDTO[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        image: r.image,
        title: r.title ?? "Untitled",
        location: r.location,
        yearsExperience: r.yearsExperience,
        skills: skillsMap[r.id] || [],
        companyCleared: null,
        matchHighlight: matchHighlights[r.id],
        matchScore: matchScores[r.id],
    }));

    if (Object.keys(matchScores).length > 0) {
        results.sort((a, b) => (matchScores[b.id] || 0) - (matchScores[a.id] || 0));
    }

    return { data: results, total: results.length };
}