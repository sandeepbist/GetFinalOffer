import type {
  CandidateGraphScore,
  ExpandedSkill,
  GraphMatchDetail,
} from "@/lib/graph/types";

export const GRAPH_IDF_MIN = 0.2;
export const GRAPH_IDF_MAX = 3.0;
export const GRAPH_EXTRACTED_SKILL_WEIGHT = 0.7;

const GRAPH_DEPTH_PENALTY: Record<number, number> = {
  1: 1.0,
  2: 0.85,
  3: 0.65,
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function getDepthPenalty(depth: number): number {
  return GRAPH_DEPTH_PENALTY[depth] ?? 0.5;
}

export function computeIdf(totalCandidates: number, candidateCount: number): number {
  const n = Math.max(0, totalCandidates);
  const df = Math.max(0, candidateCount);
  const idf = Math.log((n + 1) / (df + 1));
  return clamp(idf, GRAPH_IDF_MIN, GRAPH_IDF_MAX);
}

export function normalizeGraphScore(rawScore: number, topK: number): number {
  if (rawScore <= 0) return 0;
  const scale = Math.max(1, topK);
  return clamp(Math.tanh(rawScore / scale), 0, 1);
}

export function scoreCandidateFromExpandedSkills(
  candidateSkills: string[],
  expansionMap: Map<string, ExpandedSkill[]>,
  topK: number
): CandidateGraphScore {
  const contributions: GraphMatchDetail[] = [];

  for (const skill of candidateSkills) {
    const normalized = skill.trim().toLowerCase().replace(/\s+/g, " ");
    const matches = expansionMap.get(normalized);
    if (!matches) continue;

    for (const match of matches) {
      const depthPenalty = getDepthPenalty(match.depth);
      const idfScore = clamp(match.idfScore ?? 1, GRAPH_IDF_MIN, GRAPH_IDF_MAX);
      const contribution = match.relationWeight * depthPenalty * idfScore;
      contributions.push({
        seedSkill: match.seedSkill,
        matchedSkill: match.matchedSkill,
        relationType: match.relationType,
        depth: match.depth,
        path: match.path,
        idfScore,
        contribution,
      });
    }
  }

  if (contributions.length === 0) return { score: 0, matches: [] };

  contributions.sort((a, b) => b.contribution - a.contribution);
  const topMatches = contributions.slice(0, Math.max(1, topK));
  const raw = topMatches.reduce((sum, m) => sum + m.contribution, 0);

  return {
    score: normalizeGraphScore(raw, topK),
    matches: topMatches,
  };
}

export function blendScores(
  existingScore: number,
  graphScore: number,
  blendWeight: number
): number {
  const weight = clamp(blendWeight, 0, 1);
  return (1 - weight) * existingScore + weight * graphScore;
}
