import assert from "node:assert/strict";
import test from "node:test";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";
import { applyGraphScoresToCandidates, decideGraphExecution } from "@/features/graph/graph-data-access";
import type { GraphExpansionResultDTO } from "@/features/graph/graph-dto";

function makeCandidate(
  id: string,
  skills: string[],
  baselineScore: number
): CandidateSummaryDTO {
  return {
    id,
    name: `Candidate ${id}`,
    title: "Engineer",
    location: "Remote",
    yearsExperience: 5,
    skills,
    companyCleared: null,
    matchScore: baselineScore,
  };
}

function makeExpansion(): GraphExpansionResultDTO {
  return {
    expandedSkills: [
      {
        seedSkill: "frontend engineer",
        matchedSkill: "react",
        normalizedSkill: "react",
        depth: 1,
        relationType: "RELATED_TO",
        relationWeight: 1,
        path: ["frontend engineer", "react"],
        idfScore: 1.2,
      },
      {
        seedSkill: "frontend engineer",
        matchedSkill: "typescript",
        normalizedSkill: "typescript",
        depth: 1,
        relationType: "RELATED_TO",
        relationWeight: 0.9,
        path: ["frontend engineer", "typescript"],
        idfScore: 1.1,
      },
    ],
    cacheHit: false,
    fallbackUsed: false,
    latencyMs: 50,
    taxonomyVersion: 1,
    policyVersion: 1,
  };
}

test("applyGraphScoresToCandidates keeps baseline order in shadow mode", () => {
  const candidates = [
    makeCandidate("a", ["React", "TypeScript"], 0.9),
    makeCandidate("b", ["Go"], 0.8),
  ];
  const baseline = { a: 0.9, b: 0.8 };

  const result = applyGraphScoresToCandidates(
    candidates,
    makeExpansion(),
    baseline,
    "shadow",
    15,
    0.35,
    "65/35"
  );

  assert.equal(result[0].id, "a");
  assert.equal(result[1].id, "b");
  assert.equal(result[0].blendVariant, undefined);
  assert.equal(result[0].graphScore, undefined);
});

test("applyGraphScoresToCandidates annotates and sorts in on mode", () => {
  const candidates = [
    makeCandidate("a", ["React", "TypeScript"], 0.8),
    makeCandidate("b", ["Go"], 0.2),
  ];
  const baseline = { a: 0.8, b: 0.2 };

  const result = applyGraphScoresToCandidates(
    candidates,
    makeExpansion(),
    baseline,
    "on",
    15,
    0.5,
    "50/50"
  );

  assert.equal(result[0].id, "a");
  assert.ok((result[0].graphScore ?? 0) > 0);
  assert.equal(result[0].blendVariant, "50/50");
  assert.ok((result[0].graphMatches?.length ?? 0) > 0);
});

test("decideGraphExecution follows graph mode and traffic config", () => {
  const originalMode = process.env.GRAPH_SEARCH_MODE;
  const originalTraffic = process.env.GRAPH_SEARCH_TRAFFIC_PERCENT;

  process.env.GRAPH_SEARCH_MODE = "off";
  process.env.GRAPH_SEARCH_TRAFFIC_PERCENT = "100";
  let decision = decideGraphExecution("react engineer", "seed-1");
  assert.equal(decision.mode, "off");
  assert.equal(decision.enabled, false);

  process.env.GRAPH_SEARCH_MODE = "shadow";
  process.env.GRAPH_SEARCH_TRAFFIC_PERCENT = "0";
  decision = decideGraphExecution("react engineer", "seed-2");
  assert.equal(decision.mode, "shadow");
  assert.equal(decision.enabled, true);

  process.env.GRAPH_SEARCH_MODE = "on";
  process.env.GRAPH_SEARCH_TRAFFIC_PERCENT = "0";
  decision = decideGraphExecution("react engineer", "seed-3");
  assert.equal(decision.mode, "on");
  assert.equal(decision.enabled, false);

  process.env.GRAPH_SEARCH_MODE = originalMode;
  process.env.GRAPH_SEARCH_TRAFFIC_PERCENT = originalTraffic;
});
