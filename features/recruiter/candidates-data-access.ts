import db from "@/db";
import {
    gfoUserTable,
    gfoCandidatesTable,
    gfoCandidateSkillsTable,
    gfoSkillsLibraryTable,
    gfoCandidateHiddenOrganisationsTable,
    gfoCandidateInterviewProgressTable,
    gfoCompaniesTable,
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
    CandidateInterviewPreviewDTO,
    SearchResult
} from "@/features/recruiter/candidates-dto";

const THRESHOLD_STRICT = 0.32;
const THRESHOLD_LOOSE = 0.10;
const RECALL_POOL_SIZE = 50;
const LIVE_POOL_SIZE = 200;

function paginateResults<T>(items: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
}

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
                console.log("L1 Cache Hit");
                return { data: cached.candidates, total: cached.total };
            }
        } catch (err) {
            console.error("Cache Read Error", err);
        }
    }

    try {
        const liveResult = await SearchEngine.searchLive(query, filters, 1, LIVE_POOL_SIZE);

        if (liveResult.total > 0) {
            console.log(`Live Search Hit: Found ${liveResult.total} candidates`);
            const hydratedLive = await hydrateCandidates(liveResult.ids, filters);

            if (hydratedLive.total > 0) {
                const pageResult = {
                    data: paginateResults(hydratedLive.data, page, pageSize),
                    total: hydratedLive.total
                };

                if (page === 1) {
                    SemanticCache.set(query, filters, pageResult).catch(console.error);
                }

                return pageResult;
            }
        }

        if (!query) {
            return getBrowseResults(page, pageSize, filters);
        }

    } catch (e) {
        console.warn("Live Search Failed", e);
    }

    const matchScores: Record<string, number> = {};
    const matchHighlights: Record<string, string> = {};
    let queryVector: number[] | undefined;

    try {
        const strategy = await StrategistAgent.analyzeQuery(query);
        console.log("Search Strategy:", strategy);

        queryVector = await generateEmbedding(strategy.semanticFocus);

        const semanticCached = await SemanticCache.findSemantic(queryVector);
        if (semanticCached) {
            console.log("L2 Semantic Cache Hit");
            return { data: semanticCached.candidates, total: semanticCached.total };
        }

        const runSearch = async (threshold: number, forceVectorOnly = false) => {
            const finalText = forceVectorOnly
                ? ""
                : strategy.expandedKeywords.map((k) => `"${k}"`).join(" OR ");

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
            const looseResponse = await runSearch(THRESHOLD_LOOSE, true);
            rawMatches = (looseResponse.data || []) as CandidateMatchResult[];
        }

        rawMatches.forEach((m) => {
            matchScores[m.candidate_id] = m.match_score;
            matchHighlights[m.candidate_id] = m.match_content;
        });

        const hydratedMatches = await hydrateCandidates(
            rawMatches.map((m) => m.candidate_id),
            filters,
            matchScores,
            matchHighlights
        );

        let pageCandidates = paginateResults(hydratedMatches.data, page, pageSize);

        if (strategy.seniorityLevel !== "Any" && pageCandidates.length > 0) {
            pageCandidates = await EvaluatorAgent.evaluateCandidates(query, pageCandidates);
        }

        const finalResult = { data: pageCandidates, total: hydratedMatches.total };

        if (page === 1 && finalResult.data.length > 0) {
            SemanticCache.set(query, filters, finalResult, queryVector)
                .catch((err) => console.error("Cache Write Error", err));
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
    const rows = await db
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
        .orderBy(desc(gfoCandidatesTable.createdAt));

    const ids = Array.from(new Set(rows.map((r) => r.id)));

    if (ids.length === 0) return { data: [], total: 0 };

    const hydrated = await hydrateCandidates(ids, filters);

    return {
        data: paginateResults(hydrated.data, page, pageSize),
        total: hydrated.total
    };
}

async function hydrateCandidates(
    candidateIds: string[],
    filters: CandidateSearchFilters,
    matchScores: Record<string, number> = {},
    matchHighlights: Record<string, string> = {}
): Promise<SearchResult> {
    if (candidateIds.length === 0) return { data: [], total: 0 };

    const rows = await db
        .select({
            id: gfoUserTable.id,
            name: gfoUserTable.name,
            image: gfoUserTable.image,
            email: gfoUserTable.email,
            title: gfoCandidatesTable.professionalTitle,
            currentRole: gfoCandidatesTable.currentRole,
            location: gfoCandidatesTable.location,
            yearsExperience: gfoCandidatesTable.yearsExperience,
            bio: gfoCandidatesTable.bio,
            verificationStatus: gfoCandidatesTable.verificationStatus,
            resumeUrl: gfoCandidatesTable.resumeUrl,
        })
        .from(gfoUserTable)
        .innerJoin(gfoCandidatesTable, eq(gfoCandidatesTable.userId, gfoUserTable.id))
        .leftJoin(
            gfoCandidateHiddenOrganisationsTable,
            and(
                eq(gfoCandidateHiddenOrganisationsTable.candidateUserId, gfoCandidatesTable.userId),
                eq(gfoCandidateHiddenOrganisationsTable.organisationId, filters.recruiterOrgId)
            )
        )
        .where(and(
            inArray(gfoCandidatesTable.userId, candidateIds),
            gte(gfoCandidatesTable.yearsExperience, filters.minYears),
            isNull(gfoCandidateHiddenOrganisationsTable.id)
        ));

    const userIds = rows.map((r) => r.id);
    const skillsMap: Record<string, string[]> = {};
    const interviewMap: Record<string, CandidateInterviewPreviewDTO[]> = {};

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

        const interviewRows = await db
            .select({
                id: gfoCandidateInterviewProgressTable.id,
                userId: gfoCandidateInterviewProgressTable.candidateUserId,
                companyId: gfoCandidateInterviewProgressTable.companyId,
                companyName: gfoCompaniesTable.name,
                position: gfoCandidateInterviewProgressTable.position,
                roundsCleared: gfoCandidateInterviewProgressTable.roundsCleared,
                totalRounds: gfoCandidateInterviewProgressTable.totalRounds,
                status: gfoCandidateInterviewProgressTable.status,
                verificationStatus: gfoCandidateInterviewProgressTable.verificationStatus,
                dateCleared: gfoCandidateInterviewProgressTable.dateCleared,
            })
            .from(gfoCandidateInterviewProgressTable)
            .innerJoin(
                gfoCompaniesTable,
                eq(gfoCompaniesTable.id, gfoCandidateInterviewProgressTable.companyId)
            )
            .where(inArray(gfoCandidateInterviewProgressTable.candidateUserId, userIds))
            .orderBy(desc(gfoCandidateInterviewProgressTable.dateCleared));

        interviewRows.forEach((row) => {
            if (!interviewMap[row.userId]) interviewMap[row.userId] = [];
            interviewMap[row.userId].push({
                id: row.id,
                companyId: row.companyId,
                companyName: row.companyName,
                position: row.position,
                roundsCleared: row.roundsCleared,
                totalRounds: row.totalRounds,
                status: row.status,
                verificationStatus: row.verificationStatus,
                dateCleared: row.dateCleared instanceof Date
                    ? row.dateCleared.toISOString()
                    : new Date(row.dateCleared).toISOString(),
            });
        });
    }

    let results: CandidateSummaryDTO[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        image: r.image,
        email: r.email,
        title: r.title ?? "Untitled",
        location: r.location,
        yearsExperience: r.yearsExperience,
        skills: skillsMap[r.id] || [],
        companyCleared: null,
        bio: r.bio,
        matchHighlight: matchHighlights[r.id],
        matchScore: matchScores[r.id],
        aiReasoning: undefined,
        verificationStatus: r.verificationStatus,
        resumeUrl: r.resumeUrl,
        profilePreview: {
            id: r.id,
            name: r.name,
            email: r.email,
            image: r.image,
            title: r.title ?? "Untitled",
            currentRole: r.currentRole,
            location: r.location,
            yearsExperience: r.yearsExperience,
            bio: r.bio,
            verificationStatus: r.verificationStatus,
            resumeUrl: r.resumeUrl,
            skills: skillsMap[r.id] || [],
            interviewProgress: interviewMap[r.id] || [],
        },
    }));

    if (filters.companyId) {
        results = results.filter((candidate) =>
            (candidate.profilePreview?.interviewProgress || []).some(
                (progress) => progress.companyId === filters.companyId
            )
        );
    }

    if (Object.keys(matchScores).length > 0) {
        results.sort((a, b) => (matchScores[b.id] || 0) - (matchScores[a.id] || 0));
    } else {
        const idOrder = new Map(candidateIds.map((id, idx) => [id, idx]));
        results.sort(
            (a, b) =>
                (idOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
                (idOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER)
        );
    }

    return { data: results, total: results.length };
}
