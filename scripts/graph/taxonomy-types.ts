export type TaxonomySource = "esco" | "onet" | "curated" | "generated";

export interface TaxonomySkillNode {
  id: string;
  name: string;
  category: string;
  source?: TaxonomySource;
  sourceId?: string;
  tags?: string[];
  qualityScore?: number;
  sources?: TaxonomySource[];
}

export interface TaxonomyRoleNode {
  id: string;
  title: string;
  source?: TaxonomySource;
  sourceId?: string;
  tags?: string[];
  qualityScore?: number;
  sources?: TaxonomySource[];
}

export interface TaxonomyAliasNode {
  alias: string;
  skillId?: string;
  roleId?: string;
  type: "skill" | "role";
  source?: TaxonomySource;
  sourceId?: string;
  tags?: string[];
  qualityScore?: number;
}

export interface TaxonomyRoleRequirement {
  roleId: string;
  skillId: string;
  weight: number;
  source?: TaxonomySource;
}

export interface TaxonomySkillRelation {
  fromSkillId: string;
  toSkillId: string;
  relationType: string;
  weight: number;
  directed?: boolean;
  source?: TaxonomySource;
}

export interface TaxonomyDocument {
  version: number;
  domain: string;
  generatedAt?: string;
  sources?: TaxonomySource[];
  skills: TaxonomySkillNode[];
  roles: TaxonomyRoleNode[];
  aliases: TaxonomyAliasNode[];
  roleRequirements: TaxonomyRoleRequirement[];
  skillRelations: TaxonomySkillRelation[];
}

export interface BuildRejectBreakdown {
  [reason: string]: number;
}

export interface TaxonomyBuildReport {
  generatedAt: string;
  outputPath: string;
  input: Record<string, unknown>;
  counts: Record<string, number>;
  rejectReasons: BuildRejectBreakdown;
  requiredTermCoverage: Record<string, boolean>;
}
