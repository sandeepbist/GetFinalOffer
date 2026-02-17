import fs from "fs";
import path from "path";
import { expandSkillsFromGraph } from "@/lib/graph/expansion-service";
import { getGraphBreakerState } from "@/lib/graph/circuit-breaker";
import { closeNeo4jDriver } from "@/lib/graph/driver";
import { redis } from "@/lib/redis";

interface CliOptions {
  queries: string[];
  repeat: number;
  warmup: number;
  delayMs: number;
  noCache: boolean;
  basePolicyVersion: number;
}

interface RunSample {
  query: string;
  run: number;
  policyVersion: number;
  wallMs: number;
  graphLatencyMs: number;
  cacheHit: boolean;
  fallbackUsed: boolean;
  expandedSkillCount: number;
}

const DEFAULT_QUERIES = [
  "frontend engineer",
  "senior frontend developer react typescript",
  "backend engineer nodejs",
  "machine learning engineer python pytorch",
  "data engineer spark airflow",
  "devops engineer kubernetes docker",
  "full stack developer",
  "product designer",
  "qa automation engineer",
  "security engineer",
];

function getArg(flag: string): string | null {
  const idx = process.argv.indexOf(flag);
  if (idx < 0) return null;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("--")) return null;
  return value;
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function parseIntSafe(value: string | null, fallback: number, min: number, max: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  if (parsed < min || parsed > max) return fallback;
  return parsed;
}

function readQueries(options: { queriesArg: string | null; queryFileArg: string | null }): string[] {
  if (options.queriesArg) {
    return options.queriesArg
      .split("|")
      .map((q) => q.trim())
      .filter(Boolean);
  }

  if (options.queryFileArg) {
    const resolved = path.resolve(process.cwd(), options.queryFileArg);
    const content = fs.readFileSync(resolved, "utf8");
    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"));
  }

  return DEFAULT_QUERIES;
}

function quantile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const pos = (sorted.length - 1) * p;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = Math.min(base + 1, sorted.length - 1);
  return sorted[base] + (sorted[next] - sorted[base]) * rest;
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function pct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildOptions(): CliOptions {
  const queriesArg = getArg("--queries");
  const queryFileArg = getArg("--queries-file");

  const repeat = parseIntSafe(getArg("--repeat"), 3, 1, 50);
  const warmup = parseIntSafe(getArg("--warmup"), 1, 0, 20);
  const delayMs = parseIntSafe(getArg("--delay-ms"), 0, 0, 30_000);
  const noCache = hasFlag("--no-cache");

  const queries = readQueries({ queriesArg, queryFileArg });
  if (queries.length === 0) {
    throw new Error("No queries found. Provide --queries or --queries-file.");
  }

  if (hasFlag("--help")) {
    console.log(`
Usage:
  pnpm exec tsx -r dotenv/config scripts/graph/benchmark.ts [options]

Options:
  --queries "<q1>|<q2>|<q3>"    Pipe-separated query list
  --queries-file <path>         File with one query per line (# comments allowed)
  --repeat <n>                  Measured runs per query (default: 3)
  --warmup <n>                  Warmup runs per query before measuring (default: 1)
  --delay-ms <n>                Delay between runs in ms (default: 0)
  --no-cache                    Bypass cache by rotating GRAPH_POLICY_VERSION per call
  --policy-version <n>          Override GRAPH_POLICY_VERSION for this process
  --help                        Show this help
    `);
    process.exit(0);
  }

  const policyVersionArg = getArg("--policy-version");
  if (policyVersionArg) {
    process.env.GRAPH_POLICY_VERSION = policyVersionArg;
  } else if (noCache) {
    const randomBase = Math.floor((Date.now() % 1_000_000_000) + 1000);
    process.env.GRAPH_POLICY_VERSION = String(randomBase);
  }

  const basePolicyVersion = parseIntSafe(
    process.env.GRAPH_POLICY_VERSION || "1",
    1,
    1,
    2_000_000_000
  );
  return { queries, repeat, warmup, delayMs, noCache, basePolicyVersion };
}

async function runSingle(query: string, run: number): Promise<RunSample> {
  const start = Date.now();
  const policyVersion = Number.parseInt(process.env.GRAPH_POLICY_VERSION || "1", 10) || 1;
  const result = await expandSkillsFromGraph(query, []);
  const wallMs = Date.now() - start;

  return {
    query,
    run,
    policyVersion,
    wallMs,
    graphLatencyMs: result.latencyMs,
    cacheHit: result.cacheHit,
    fallbackUsed: result.fallbackUsed,
    expandedSkillCount: result.expandedSkills.length,
  };
}

function printHeader(options: CliOptions): void {
  console.log("\n=== Graph Benchmark ===");
  console.log(`Queries: ${options.queries.length}`);
  console.log(`Repeat: ${options.repeat}`);
  console.log(`Warmup: ${options.warmup}`);
  console.log(`Delay: ${options.delayMs}ms`);
  console.log(`Mode: ${process.env.GRAPH_SEARCH_MODE || "off"}`);
  console.log(`Depth: ${process.env.GRAPH_MAX_DEPTH || "2"}`);
  console.log(`Breaker timeout: ${process.env.GRAPH_BREAKER_TIMEOUT_MS || "200"}ms`);
  console.log(`Policy version: ${process.env.GRAPH_POLICY_VERSION || "1"}`);
  console.log(`No cache mode: ${options.noCache ? "on" : "off"}`);
}

function printRun(sample: RunSample): void {
  console.log(
    `[run ${sample.run}] "${sample.query}" ` +
      `policy=${sample.policyVersion} ` +
      `wall=${sample.wallMs}ms ` +
      `graph=${sample.graphLatencyMs}ms ` +
      `expanded=${sample.expandedSkillCount} ` +
      `cacheHit=${sample.cacheHit ? "yes" : "no"} ` +
      `fallback=${sample.fallbackUsed ? "yes" : "no"}`
  );
}

function printSummary(samples: RunSample[]): void {
  const wallValues = samples.map((s) => s.wallMs).sort((a, b) => a - b);
  const graphValues = samples.map((s) => s.graphLatencyMs).sort((a, b) => a - b);

  const total = samples.length;
  const fallbackCount = samples.filter((s) => s.fallbackUsed).length;
  const cacheHitCount = samples.filter((s) => s.cacheHit).length;
  const withExpansion = samples.filter((s) => s.expandedSkillCount > 0).length;
  const avgExpanded = mean(samples.map((s) => s.expandedSkillCount));

  console.log("\n=== Global Summary ===");
  console.log(`Runs: ${total}`);
  console.log(`Wall avg/p50/p95: ${mean(wallValues).toFixed(1)} / ${quantile(wallValues, 0.5).toFixed(1)} / ${quantile(wallValues, 0.95).toFixed(1)} ms`);
  console.log(`Graph avg/p50/p95: ${mean(graphValues).toFixed(1)} / ${quantile(graphValues, 0.5).toFixed(1)} / ${quantile(graphValues, 0.95).toFixed(1)} ms`);
  console.log(`Fallback rate: ${pct(fallbackCount, total).toFixed(1)}% (${fallbackCount}/${total})`);
  console.log(`Cache hit rate: ${pct(cacheHitCount, total).toFixed(1)}% (${cacheHitCount}/${total})`);
  console.log(`Runs with expansion > 0: ${pct(withExpansion, total).toFixed(1)}% (${withExpansion}/${total})`);
  console.log(`Avg expanded skills/run: ${avgExpanded.toFixed(1)}`);
  console.log(`Breaker state: ${getGraphBreakerState()}`);
}

function printPerQuerySummary(samples: RunSample[], queries: string[]): void {
  console.log("\n=== Per Query Summary ===");
  for (const query of queries) {
    const group = samples.filter((s) => s.query === query);
    const graphValues = group.map((s) => s.graphLatencyMs).sort((a, b) => a - b);
    const fallbackCount = group.filter((s) => s.fallbackUsed).length;
    const cacheHits = group.filter((s) => s.cacheHit).length;
    const avgExpanded = mean(group.map((s) => s.expandedSkillCount));
    console.log(
      `- "${query}" graph avg/p95=${mean(graphValues).toFixed(1)}/${quantile(graphValues, 0.95).toFixed(1)}ms ` +
        `fallback=${pct(fallbackCount, group.length).toFixed(0)}% ` +
        `cacheHit=${pct(cacheHits, group.length).toFixed(0)}% ` +
        `avgExpanded=${avgExpanded.toFixed(1)}`
    );
  }
}

async function main() {
  const options = buildOptions();
  printHeader(options);
  let policyCursor = options.basePolicyVersion;

  if (options.warmup > 0) {
    console.log("\n=== Warmup ===");
    for (let round = 1; round <= options.warmup; round += 1) {
      for (const query of options.queries) {
        if (options.noCache) {
          policyCursor += 1;
          process.env.GRAPH_POLICY_VERSION = String(policyCursor);
        }
        await runSingle(query, round);
        if (options.delayMs > 0) {
          await sleep(options.delayMs);
        }
      }
      console.log(`Warmup round ${round}/${options.warmup} complete`);
    }
  }

  const samples: RunSample[] = [];
  console.log("\n=== Measured Runs ===");
  for (const query of options.queries) {
    for (let run = 1; run <= options.repeat; run += 1) {
      if (options.noCache) {
        policyCursor += 1;
        process.env.GRAPH_POLICY_VERSION = String(policyCursor);
      }
      const sample = await runSingle(query, run);
      samples.push(sample);
      printRun(sample);

      if (options.delayMs > 0) {
        await sleep(options.delayMs);
      }
    }
  }

  printSummary(samples);
  printPerQuerySummary(samples, options.queries);

  await closeNeo4jDriver();
  const maybePgPool = (globalThis as unknown as { postgres?: { end?: () => Promise<void> } }).postgres;
  if (maybePgPool?.end) {
    await maybePgPool.end();
  }
  await redis.quit();
}

main().catch((error) => {
  console.error("Graph benchmark failed:", error);
  process.exit(1);
});
