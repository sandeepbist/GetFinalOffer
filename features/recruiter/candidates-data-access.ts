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
import { StrategistAgent, SearchStrategy } from "@/lib/agents/strategist";
import { EvaluatorAgent } from "@/lib/agents/evaluator";
import { getGraphBlendWeight, getGraphTopK } from "@/lib/graph/config";
import { recordGraphSearchMetrics } from "@/lib/graph/metrics";
import type { GraphExpansionResult, GraphMetricEnvelope } from "@/lib/graph/types";
import {
    applyGraphScoresToCandidates,
    decideGraphExecution,
    expandGraphQuery,
} from "@/features/graph/graph-data-access";
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

interface SearchExecutionContext {
    userId?: string;
}

function paginateResults<T>(items: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
}

function dedupeIds(ids: string[]): string[] {
    return Array.from(new Set(ids));
}

function buildRankScoreMap(ids: string[]): Record<string, number> {
    const scores: Record<string, number> = {};
    const total = Math.max(1, ids.length);

    ids.forEach((id, idx) => {
        scores[id] = (total - idx) / total;
    });

    return scores;
}

function buildBlendVariant(weight: number): string {
    const keep = Math.round((1 - weight) * 100);
    const graph = Math.round(weight * 100);
    return process.env.GRAPH_BLEND_VARIANT || `${keep}/${graph}`;
}


function graphMetricDefaults(): GraphMetricEnvelope {
    return {
        graphEnabled: false,
        graphLatencyMs: 0,
        graphFallbackUsed: false,
        expandedSkillCount: 0,
        graphNewCandidatesFound: 0,
        graphSeedCount: 0,
        graphStrictMatchRows: 0,
        graphContainsFallbackUsed: false,
        graphContainsMatchRows: 0,
    };
}

async function safeRecordGraphMetrics(metrics: GraphMetricEnvelope): Promise<void> {
    try {
        await recordGraphSearchMetrics(metrics);
    } catch (error) {
        console.warn("Failed to record graph metrics", error);
    }
}

export async function searchCandidatesHybrid(
    query: string,
    page: number,
    pageSize: number,
    filters: CandidateSearchFilters,
    context: SearchExecutionContext = {}
): Promise<SearchResult> {

    if (page === 1) {
        try {
            const cached = await SemanticCache.findExact(query, filters);
            if (cached) {
                console.log("L1 Cache Hit");
                await safeRecordGraphMetrics(graphMetricDefaults());
                return {
                    data: cached.candidates,
                    total: cached.total,
                    graphTelemetry: graphMetricDefaults(),
                };
            }
        } catch (err) {
            console.error("Cache Read Error", err);
        }
    }

    const graphDecision = decideGraphExecution(query, context.userId);
    const graphMode = graphDecision.mode;
    const graphAllowed = graphDecision.enabled;

    let strategy: SearchStrategy | null = null;
    let graphExpansion: GraphExpansionResult | null = null;
    let graphMetrics: GraphMetricEnvelope = graphMetricDefaults();

    if (query.trim() && graphAllowed) {
        try {
            strategy = await StrategistAgent.analyzeQuery(query);
            graphExpansion = await expandGraphQuery(query, strategy.expandedKeywords);

            graphMetrics = {
                graphEnabled: true,
                graphLatencyMs: graphExpansion.latencyMs,
                graphFallbackUsed: graphExpansion.fallbackUsed,
                expandedSkillCount: graphExpansion.expandedSkills.length,
                graphNewCandidatesFound: 0,
                graphSeedCount: graphExpansion.seedDebug?.totalSeeds || 0,
                graphStrictMatchRows: graphExpansion.seedDebug?.strictMatchRows || 0,
                graphContainsFallbackUsed: graphExpansion.seedDebug?.containsFallbackUsed || false,
                graphContainsMatchRows: graphExpansion.seedDebug?.containsMatchRows || 0,
            };
        } catch (error) {
            console.warn("Graph expansion failed", error);
            graphMetrics.graphEnabled = true;
            graphMetrics.graphFallbackUsed = true;
        }
    }

    try {
        const liveResult = await SearchEngine.searchLive(query, filters, 1, LIVE_POOL_SIZE);

        let graphLiveIds: string[] = [];
        if (graphExpansion && graphExpansion.expandedSkills.length > 0) {
            const graphPool = await SearchEngine.searchByExpandedSkills(
                graphExpansion.expandedSkills.map((s) => s.normalizedSkill),
                filters,
                1,
                LIVE_POOL_SIZE
            );
            graphLiveIds = graphPool.ids;
            graphMetrics.graphNewCandidatesFound = graphLiveIds.filter((id) => !liveResult.ids.includes(id)).length;
        }

        const combinedLiveIds = graphMode === "on"
            ? dedupeIds([...liveResult.ids, ...graphLiveIds])
            : liveResult.ids;

        if (combinedLiveIds.length > 0) {
            console.log(`Live Search Hit: Found ${combinedLiveIds.length} candidates`);

            const baseScores = buildRankScoreMap(combinedLiveIds);
            const hydratedLive = await hydrateCandidates(combinedLiveIds, filters, baseScores);

            if (hydratedLive.total > 0) {
                hydratedLive.data = applyGraphScoresToCandidates(
                    hydratedLive.data,
                    graphExpansion,
                    baseScores,
                    graphMode,
                    getGraphTopK(strategy?.seniorityLevel || "Any"),
                    getGraphBlendWeight(),
                    buildBlendVariant(getGraphBlendWeight())
                );

                const pageResult = {
                    data: paginateResults(hydratedLive.data, page, pageSize),
                    total: hydratedLive.total,
                    graphTelemetry: graphMetrics,
                };

                if (page === 1) {
                    SemanticCache.set(query, filters, pageResult).catch(console.error);
                }

                await safeRecordGraphMetrics(graphMetrics);
                return pageResult;
            }
        }

        if (!query) {
            await safeRecordGraphMetrics(graphMetricDefaults());
            const browse = await getBrowseResults(page, pageSize, filters);
            return {
                ...browse,
                graphTelemetry: graphMetricDefaults(),
            };
        }

    } catch (e) {
        console.warn("Live Search Failed", e);
    }

    const matchScores: Record<string, number> = {};
    const matchHighlights: Record<string, string> = {};
    let queryVector: number[] | undefined;

    try {
        const resolvedStrategy = strategy || await StrategistAgent.analyzeQuery(query);
        strategy = resolvedStrategy;

        console.log("Search Strategy:", resolvedStrategy);

        queryVector = await generateEmbedding(resolvedStrategy.semanticFocus);

        const semanticCached = await SemanticCache.findSemantic(queryVector);
        if (semanticCached) {
            console.log("L2 Semantic Cache Hit");
            await safeRecordGraphMetrics(graphMetrics);
            return {
                data: semanticCached.candidates,
                total: semanticCached.total,
                graphTelemetry: graphMetrics,
            };
        }

        const runSearch = async (threshold: number, forceVectorOnly = false) => {
            const finalText = forceVectorOnly
                ? ""
                : resolvedStrategy.expandedKeywords.map((k) => `"${k}"`).join(" OR ");

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

        let graphCandidateIds: string[] = [];
        if (graphExpansion && graphExpansion.expandedSkills.length > 0) {
            const graphResult = await SearchEngine.searchByExpandedSkills(
                graphExpansion.expandedSkills.map((s) => s.normalizedSkill),
                filters,
                1,
                LIVE_POOL_SIZE
            );
            graphCandidateIds = graphResult.ids;
            graphMetrics.graphNewCandidatesFound = graphCandidateIds.filter((id) => !(id in matchScores)).length;
        }

        const finalCandidateIds = graphMode === "on"
            ? dedupeIds([...rawMatches.map((m) => m.candidate_id), ...graphCandidateIds])
            : rawMatches.map((m) => m.candidate_id);

        const hydratedMatches = await hydrateCandidates(
            finalCandidateIds,
            filters,
            matchScores,
            matchHighlights
        );

        hydratedMatches.data = applyGraphScoresToCandidates(
            hydratedMatches.data,
            graphExpansion,
            matchScores,
            graphMode,
            getGraphTopK(resolvedStrategy.seniorityLevel),
            getGraphBlendWeight(),
            buildBlendVariant(getGraphBlendWeight())
        );

        let pageCandidates = paginateResults(hydratedMatches.data, page, pageSize);

        if (resolvedStrategy.seniorityLevel !== "Any" && pageCandidates.length > 0) {
            pageCandidates = await EvaluatorAgent.evaluateCandidates(query, pageCandidates);
        }

        const finalResult: SearchResult = {
            data: pageCandidates,
            total: hydratedMatches.total,
            graphTelemetry: graphMetrics,
        };

        if (page === 1 && finalResult.data.length > 0) {
            SemanticCache.set(query, filters, finalResult, queryVector)
                .catch((err) => console.error("Cache Write Error", err));
        }

        graphMetrics.blendVariant = finalResult.data[0]?.blendVariant;
        await safeRecordGraphMetrics(graphMetrics);

        return finalResult;

    } catch (error) {
        console.error("Vector Search Failed", error);
        graphMetrics.graphFallbackUsed = true;
        await safeRecordGraphMetrics(graphMetrics);
        return { data: [], total: 0, graphTelemetry: graphMetrics };
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
