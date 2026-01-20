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
import { SearchEngine } from "@/lib/search-engine";
import { StrategistAgent } from "@/lib/agents/strategist";
import { EvaluatorAgent } from "@/lib/agents/evaluator";
import type {
    CandidateSummaryDTO,
    CandidateSearchFilters,
    CandidateMatchResult,
    SearchResult
} from "@/features/recruiter/candidates-dto";

const THRESHOLD_STRICT = 0.32;
const THRESHOLD_LOOSE = 0.10;
const RECALL_POOL_SIZE = 50;

export async function searchCandidatesHybrid(
    query: string,
    page: number,
    pageSize: number,
    filters: CandidateSearchFilters
): Promise<SearchResult> {

    if (page === 1) {
        try {
            const cached = await SemanticCache.findExact(query, filters);
            if (cached) {
                console.log("⚡ L1 Cache Hit");
                return { data: cached.candidates, total: cached.total };
            }
        } catch (err) {
            console.error("Cache Read Error", err);
        }
    }

    try {
        const liveResult = await SearchEngine.searchLive(query, filters, page, pageSize);

        if (liveResult.total > 0) {
            console.log(`⚡ Live Search Hit: Found ${liveResult.total} candidates`);
            const hydrated = await hydrateCandidates(liveResult.ids, page, pageSize);

            if (page === 1) {
                SemanticCache.set(query, filters, hydrated).catch(console.error);
            }
            return { data: hydrated.data, total: liveResult.total };
        }

        if (!query) {
            return getBrowseResults(page, pageSize, filters);
        }

    } catch (e) {
        console.warn("⚠️ Live Search Failed", e);
    }

    let candidateIds: string[] = [];
    const matchScores: Record<string, number> = {};
    const matchHighlights: Record<string, string> = {};
    let queryVector: number[] | undefined;

    try {
        const strategy = await StrategistAgent.analyzeQuery(query);
        console.log("🧠 Search Strategy:", strategy);

        queryVector = await generateEmbedding(strategy.semanticFocus);

        const semanticCached = await SemanticCache.findSemantic(queryVector);
        if (semanticCached) {
            console.log("🧠 L2 Semantic Cache Hit");
            return { data: semanticCached.candidates, total: semanticCached.total };
        }

        const runSearch = async (threshold: number, forceVectorOnly: boolean = false) => {
            const finalText = forceVectorOnly
                ? ""
                : strategy.expandedKeywords.map(k => `"${k}"`).join(" OR ");

            if (forceVectorOnly) console.log("🛟 Attempting Semantic Rescue (Pure Vector)...");

            return await supabase.rpc("match_candidates_hybrid", {
                query_embedding: queryVector,
                query_text: finalText,
                match_threshold: threshold,
                match_count: RECALL_POOL_SIZE,
                min_experience: filters.minYears,
                blocked_org_ids: [filters.recruiterOrgId],
            });
        };

        const response = await runSearch(THRESHOLD_STRICT, false);
        let rawMatches = (response.data || []) as CandidateMatchResult[];

        if (rawMatches.length === 0) {
            console.log("⚠️ Text Match Failed. Falling back to Vector meaning.");
            const looseResponse = await runSearch(THRESHOLD_LOOSE, true);
            rawMatches = (looseResponse.data || []) as CandidateMatchResult[];
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
        let finalCandidates = result.data;

        if (strategy.seniorityLevel !== "Any" && finalCandidates.length > 0) {
            console.log("🕵️‍♀️ Running AI Evaluation...");
            finalCandidates = await EvaluatorAgent.evaluateCandidates(query, finalCandidates);
        }

        const finalResult = { data: finalCandidates, total: totalMatches };

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
            bio: gfoCandidatesTable.bio,
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
        bio: r.bio,
        matchHighlight: matchHighlights[r.id],
        matchScore: matchScores[r.id],
        aiReasoning: undefined
    }));

    if (Object.keys(matchScores).length > 0) {
        results.sort((a, b) => (matchScores[b.id] || 0) - (matchScores[a.id] || 0));
    }

    return { data: results, total: results.length };
}