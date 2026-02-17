import type { ExpandedSkill, GraphExpansionResult, GraphMatchDetail } from "@/lib/graph/types";

export type GraphExpandedSkillDTO = ExpandedSkill;
export type GraphExpansionResultDTO = GraphExpansionResult;
export type GraphMatchDetailDTO = GraphMatchDetail;

export interface GraphExecutionDecisionDTO {
  enabled: boolean;
  mode: "off" | "shadow" | "on";
}
