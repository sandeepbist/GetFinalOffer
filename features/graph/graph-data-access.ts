import {
  getGraphSearchMode,
  shouldRunGraph,
} from "@/lib/graph/config";
import { buildExpansionMap, expandSkillsFromGraph } from "@/lib/graph/expansion-service";
import { blendScores, scoreCandidateFromExpandedSkills } from "@/lib/graph/scoring";
import type { GraphExpansionResultDTO, GraphExecutionDecisionDTO } from "./graph-dto";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";

export function decideGraphExecution(query: string, userId?: string): GraphExecutionDecisionDTO {
  const mode = getGraphSearchMode();
  const enabled = shouldRunGraph(query, userId || "");
  return { enabled, mode };
}

export async function expandGraphQuery(
  query: string,
  hints: string[]
): Promise<GraphExpansionResultDTO> {
  return await expandSkillsFromGraph(query, hints);
}

export function applyGraphScoresToCandidates(
  candidates: CandidateSummaryDTO[],
  expansion: GraphExpansionResultDTO | null,
  existingScores: Record<string, number>,
  mode: "off" | "shadow" | "on",
  topK: number,
  blendWeight: number,
  blendVariant: string
): CandidateSummaryDTO[] {
  if (!expansion || expansion.expandedSkills.length === 0) return candidates;

  const expansionMap = buildExpansionMap(expansion.expandedSkills);
  for (const candidate of candidates) {
    const graph = scoreCandidateFromExpandedSkills(candidate.skills, expansionMap, topK);
    if (mode === "on") {
      candidate.graphScore = graph.score;
      candidate.graphMatches = graph.matches;
      candidate.blendVariant = blendVariant;
      const baselineScore = existingScores[candidate.id] ?? (candidate.matchScore || 0);
      candidate.matchScore = blendScores(baselineScore, graph.score, blendWeight);
    }
  }

  if (mode === "on") {
    candidates.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  return candidates;
}
