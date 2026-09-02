/**
 * Golden-set relevance evaluation for the candidate-search pipeline.
 *
 * Usage:
 *   pnpm graph:evaluate
 *   pnpm graph:evaluate -- --file my-golden.json
 *
 * Reads GOLDEN_SET (or a JSON file of the same shape via --file), runs every
 * query through the pipeline stages, and reports nDCG@10 and MRR per stage:
 *   live   — Redis skill-index retrieval
 *   vector — pgvector hybrid RPC (BM25+RRF)
 *   graph  — graph-expanded skill pool
 *   rerank — cross-encoder reranked final order
 *
 * Requires the golden set to carry at least one judged candidate per query
 * (queries with empty relevance maps are reported as UNJUDGED and skipped).
 */

import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { GOLDEN_SET, type GoldenQuery } from "./golden-set";

/* Env-dependent modules are loaded lazily after dotenv runs; these are
 * populated by loadEnvModules() at the top of main(). */
let db: typeof import("@/db").default;
let gfoCandidatesTable: typeof import("@/db/schemas").gfoCandidatesTable;
let SearchEngine: typeof import("@/lib/search-engine").SearchEngine;
let crossEncoderRerank: typeof import("@/lib/reranker/cross-encoder").crossEncoderRerank;
let closeNeo4jDriver: typeof import("@/lib/graph/driver").closeNeo4jDriver;
let supabase: typeof import("@/lib/supabase").supabase;
let generateEmbedding: typeof import("@/lib/ai").generateEmbedding;

async function loadEnvModules(): Promise<void> {
  ({ default: db } = await import("@/db"));
  ({ gfoCandidatesTable } = await import("@/db/schemas"));
  ({ SearchEngine } = await import("@/lib/search-engine"));
  ({ crossEncoderRerank } = await import("@/lib/reranker/cross-encoder"));
  ({ closeNeo4jDriver } = await import("@/lib/graph/driver"));
  ({ supabase } = await import("@/lib/supabase"));
  ({ generateEmbedding } = await import("@/lib/ai"));
}

const RECALL_POOL_SIZE = 50;
const EMPTY_FILTERS = { minYears: 0, recruiterOrgId: "golden-eval-no-org" };

function getArg(flag: string): string | null {
  const idx = process.argv.indexOf(flag);
  return idx >= 0 ? process.argv[idx + 1] || null : null;
}

/** Discounted cumulative gain at cutoff 10. */
function dcgAt10(ranking: string[], grades: Record<string, number>): number {
  let dcg = 0;
  for (let i = 0; i < Math.min(10, ranking.length); i++) {
    const grade = grades[ranking[i]] ?? 0;
    dcg += (Math.pow(2, grade) - 1) / Math.log2(i + 2);
  }
  return dcg;
}

/** Ideal DCG@10: the best achievable ordering of the judged grades. */
function idcgAt10(grades: Record<string, number>): number {
  const ideal = Object.values(grades)
    .filter((g) => g > 0)
    .sort((a, b) => b - a)
    .slice(0, 10);
  let idcg = 0;
  for (let i = 0; i < ideal.length; i++) {
    idcg += (Math.pow(2, ideal[i]) - 1) / Math.log2(i + 2);
  }
  return idcg;
}

function ndcgAt10(ranking: string[], grades: Record<string, number>): number | null {
  const idcg = idcgAt10(grades);
  if (idcg === 0) return null;
  return dcgAt10(ranking, grades) / idcg;
}

/** Reciprocal rank of the first relevant (grade >= 1) result. */
function mrr(ranking: string[], grades: Record<string, number>): number | null {
  for (let i = 0; i < ranking.length; i++) {
    if ((grades[ranking[i]] ?? 0) >= 1) {
      return 1 / (i + 1);
    }
  }
  return null;
}

/** Runs the BM25+RRF vector arm for a query and returns ranked candidate ids. */
async function vectorStageIds(query: string): Promise<string[]> {
  const embedding = await generateEmbedding(query);
  const response = await supabase.rpc("match_candidates_hybrid", {
    query_embedding: embedding,
    query_text: "",
    match_threshold: 0.32,
    match_count: RECALL_POOL_SIZE,
    min_experience: 0,
    blocked_org_ids: [],
  });
  const rows = (response.data || []) as Array<{ candidate_id: string }>;
  return rows.map((r) => r.candidate_id);
}

async function runEvaluation(queries: GoldenQuery[]): Promise<void> {
  // Cache candidate ids -> summary maps once; each stage reuses the pool.
  const stageTotals: Record<string, { ndcg: number[]; mrr: number[] }> = {};
  const stageNames = ["live", "vector", "graph", "rerank"];
  for (const s of stageNames) stageTotals[s] = { ndcg: [], mrr: [] };
  const unjudged: string[] = [];

  for (const golden of queries) {
    if (Object.keys(golden.relevance).length === 0) {
      unjudged.push(golden.query);
      continue;
    }
    console.log(`\nQuery: "${golden.query}"`);

    // Stage: live (Redis index)
    const live = await SearchEngine.searchLive(golden.query, EMPTY_FILTERS, 1, RECALL_POOL_SIZE);
    const liveIds = live.ids;

    // Stage: vector (BM25+RRF RPC)
    let vectorIds: string[] = [];
    try {
      vectorIds = await vectorStageIds(golden.query);
    } catch (err) {
      console.warn("  vector stage failed:", err instanceof Error ? err.message : err);
    }

    // Stage: graph-expanded skill pool (via the same engine path the app uses)
    let graphIds: string[] = [];
    try {
      const graph = await SearchEngine.searchByExpandedSkills(
        golden.query
          .toLowerCase()
          .split(/\s+/)
          .filter((t) => !["engineer", "developer", "senior", "staff"].includes(t)),
        EMPTY_FILTERS,
        1,
        RECALL_POOL_SIZE
      );
      graphIds = graph.ids;
    } catch (err) {
      console.warn("  graph stage failed:", err instanceof Error ? err.message : err);
    }

    // Stage: rerank — rerank the fused pool like the app does (dedupe, cap)
    const fused = Array.from(new Set([...liveIds, ...vectorIds, ...graphIds])).slice(0, RECALL_POOL_SIZE);
    let rerankIds = fused;
    try {
      const all = fused.length
        ? await db.select({
            id: gfoCandidatesTable.userId,
            title: gfoCandidatesTable.professionalTitle,
            bio: gfoCandidatesTable.bio,
          }).from(gfoCandidatesTable)
        : [];
      const byId = new Map(all.map((r) => [r.id, r]));
      const summaries = fused
        .map((id) => byId.get(id))
        .filter((r): r is NonNullable<typeof r> => Boolean(r))
        .map((r) => ({
          id: r.id,
          name: "",
          title: r.title ?? "",
          location: "",
          yearsExperience: 0,
          skills: [],
          companyCleared: null,
          bio: r.bio,
        }));
      const reranked = await crossEncoderRerank(golden.query, summaries as never);
      rerankIds = reranked.map((c) => (c as { id: string }).id);
    } catch (err) {
      console.warn("  rerank stage failed:", err instanceof Error ? err.message : err);
    }

    const stages: Record<string, string[]> = {
      live: liveIds,
      vector: vectorIds,
      graph: graphIds,
      rerank: rerankIds,
    };

    for (const name of stageNames) {
      const ranking = stages[name];
      const ndcg = ndcgAt10(ranking, golden.relevance);
      const reciprocal = mrr(ranking, golden.relevance);
      if (ndcg !== null) stageTotals[name].ndcg.push(ndcg);
      if (reciprocal !== null) stageTotals[name].mrr.push(reciprocal);
      console.log(
        `  ${name.padEnd(6)} nDCG@10=${ndcg === null ? "  n/a" : ndcg.toFixed(4)}  MRR=${reciprocal === null ? "n/a" : reciprocal.toFixed(4)}  (${ranking.length} results)`
      );
    }
  }

  console.log("\n=== Aggregate per stage ===");
  for (const name of stageNames) {
    const { ndcg, mrr: mrrArr } = stageTotals[name];
    const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
    const ndcgMean = mean(ndcg);
    const mrrMean = mean(mrrArr);
    console.log(
      `${name.padEnd(6)} nDCG@10=${ndcgMean === null ? "n/a" : ndcgMean.toFixed(4)} (n=${ndcg.length})  MRR=${mrrMean === null ? "n/a" : mrrMean.toFixed(4)} (n=${mrrArr.length})`
    );
  }

  if (unjudged.length > 0) {
    console.log(`\nUNJUDGED (skipped, empty relevance maps): ${unjudged.length}`);
    for (const q of unjudged) console.log(`  - "${q}"`);
    console.log(
      "\nJudge them: run once with real data in the DB, inspect the result ids,\nthen fill scripts/graph/golden-set.ts relevance maps (grade 0-3)."
    );
  }
}

async function main(): Promise<void> {
  await loadEnvModules();

  const fileArg = getArg("--file");
  let queries: GoldenQuery[] = GOLDEN_SET;
  if (fileArg) {
    queries = JSON.parse(fs.readFileSync(fileArg, "utf-8")) as GoldenQuery[];
    console.log(`Loaded ${queries.length} golden queries from ${fileArg}`);
  }

  await runEvaluation(queries);

  await closeNeo4jDriver().catch(() => undefined);
  process.exit(0);
}

void main();
