/**
 * Golden-set evaluation corpus for the search pipeline.
 *
 * Each entry pairs a recruiter query with a judged candidate ranking:
 * `relevance` maps candidate user id -> relevance grade (0-3, 0 = not
 * relevant). Grades are produced by manual judgment against real profiles;
 * keep them honest — the harness is only as good as this file.
 *
 * Grading scale (graded against the query's stated intent):
 *   3 — directly on-target: the role/skills the query asks for
 *   2 — strongly adjacent: same family, transferable core skills
 *   1 — loosely related: one meaningful overlap
 *   0 — not relevant (omit from the map entirely)
 */
export interface GoldenQuery {
  query: string;
  /** Optional intent note recorded at judgment time. */
  intent?: string;
  relevance: Record<string, number>;
}

export const GOLDEN_SET: GoldenQuery[] = [
  {
    query: "frontend engineer react typescript",
    intent: "Component work in the React ecosystem",
    relevance: {},
  },
  {
    query: "backend engineer nodejs postgres",
    intent: "Server-side Node with relational storage",
    relevance: {},
  },
  {
    query: "machine learning engineer pytorch",
    intent: "Hands-on deep learning engineering",
    relevance: {},
  },
  {
    query: "devops kubernetes terraform",
    intent: "Infrastructure automation",
    relevance: {},
  },
  {
    query: "senior full stack developer",
    intent: "Senior generalist across web stack",
    relevance: {},
  },
  {
    query: "data engineer spark airflow",
    intent: "Pipeline and orchestration work",
    relevance: {},
  },
  {
    query: "security engineer",
    intent: "Application or infrastructure security",
    relevance: {},
  },
  {
    query: "mobile developer react native",
    intent: "Cross-platform mobile",
    relevance: {},
  },
  {
    query: "staff engineer distributed systems",
    intent: "Senior systems design",
    relevance: {},
  },
  {
    query: "product designer",
    intent: "Product/UX design",
    relevance: {},
  },
];

/**
 * The harness reports staged rankings for every query. Stages are additive:
 * each later stage includes the previous stage's transformations.
 */
export const PIPELINE_STAGES = [
  "live",
  "vector",
  "graph",
  "rerank",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];
