export type GraphSearchMode = "off" | "shadow" | "on";

export type CandidateSkillSource = "profile" | "extracted";

export interface CandidateSkillEvidence {
  name: string;
  normalizedName: string;
  source: CandidateSkillSource;
  confidence: number;
  skillId?: string;
}

export interface ExpandedSkill {
  seedSkill: string;
  matchedSkill: string;
  normalizedSkill: string;
  depth: number;
  relationType: string;
  relationWeight: number;
  path: string[];
  idfScore?: number;
}

export interface GraphExpansionResult {
  expandedSkills: ExpandedSkill[];
  cacheHit: boolean;
  fallbackUsed: boolean;
  latencyMs: number;
  taxonomyVersion: number;
  policyVersion: number;
  seedDebug?: {
    totalSeeds: number;
    strictSeedCount: number;
    tokenSeedCount: number;
    containsSeedCount: number;
    strictMatchRows: number;
    containsFallbackUsed: boolean;
    containsMatchRows: number;
  };
}

export interface GraphMatchDetail {
  seedSkill: string;
  matchedSkill: string;
  relationType: string;
  depth: number;
  path: string[];
  idfScore: number;
  contribution: number;
}

export interface CandidateGraphScore {
  score: number;
  matches: GraphMatchDetail[];
}

export interface GraphSearchContext {
  userId?: string;
  query: string;
}

export interface GraphMetricEnvelope {
  graphEnabled: boolean;
  graphLatencyMs: number;
  graphFallbackUsed: boolean;
  expandedSkillCount: number;
  graphNewCandidatesFound: number;
  blendVariant?: string;
  graphSeedCount?: number;
  graphStrictMatchRows?: number;
  graphContainsFallbackUsed?: boolean;
  graphContainsMatchRows?: number;
}
