import { createHash } from "crypto";
import type { GraphSearchMode } from "@/lib/graph/types";

const DEFAULT_BLEND_WEIGHT = 0.35;
const DEFAULT_TRAFFIC_PERCENT = 0;
const DEFAULT_MAX_DEPTH = 2;
const DEFAULT_POLICY_VERSION = 1;
const DEFAULT_TOP_K = 15;
const DEFAULT_TOP_K_SENIOR = 20;
const DEFAULT_STRICT_SEED_LIMIT = 20;
const DEFAULT_CONTAINS_SEED_LIMIT = 8;
const DEFAULT_STRICT_PATH_LIMIT_PER_SEED = 30;
const DEFAULT_CONTAINS_PATH_LIMIT_PER_SEED = 15;
const DEFAULT_GLOBAL_RESULT_LIMIT = 150;
const DEFAULT_CONTAINS_FALLBACK_DEPTH = 1;

function parseNumber(
  value: string | undefined,
  fallback: number,
  { min, max }: { min?: number; max?: number } = {}
): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  if (typeof min === "number" && parsed < min) return fallback;
  if (typeof max === "number" && parsed > max) return fallback;
  return parsed;
}

export function getGraphSearchMode(): GraphSearchMode {
  const raw = (process.env.GRAPH_SEARCH_MODE || "off").toLowerCase();
  if (raw === "on" || raw === "shadow" || raw === "off") return raw;
  return "off";
}

export function getGraphTrafficPercent(): number {
  return parseNumber(process.env.GRAPH_SEARCH_TRAFFIC_PERCENT, DEFAULT_TRAFFIC_PERCENT, {
    min: 0,
    max: 100,
  });
}

export function getGraphBlendWeight(): number {
  return parseNumber(process.env.GRAPH_BLEND_WEIGHT, DEFAULT_BLEND_WEIGHT, {
    min: 0,
    max: 1,
  });
}

export function getGraphMaxDepth(): number {
  return parseNumber(process.env.GRAPH_MAX_DEPTH, DEFAULT_MAX_DEPTH, { min: 1, max: 3 });
}

export function getGraphPolicyVersion(): number {
  return parseNumber(process.env.GRAPH_POLICY_VERSION, DEFAULT_POLICY_VERSION, {
    min: 1,
    max: 2_000_000_000,
  });
}

export function getGraphTopK(seniority?: string): number {
  const isSenior = seniority === "Senior" || seniority === "Lead";
  const fallback = isSenior ? DEFAULT_TOP_K_SENIOR : DEFAULT_TOP_K;
  return parseNumber(process.env.GRAPH_TOP_K, fallback, { min: 1, max: 100 });
}

export function getGraphCacheTtlSeconds(): number {
  return parseNumber(process.env.GRAPH_EXPANSION_CACHE_TTL_SECONDS, 60 * 60 * 24, {
    min: 60,
    max: 60 * 60 * 24 * 30,
  });
}

export function getGraphStrictSeedLimit(): number {
  return parseNumber(
    process.env.GRAPH_STRICT_SEED_LIMIT,
    DEFAULT_STRICT_SEED_LIMIT,
    { min: 1, max: 100 }
  );
}

export function getGraphContainsSeedLimit(): number {
  return parseNumber(
    process.env.GRAPH_CONTAINS_SEED_LIMIT,
    DEFAULT_CONTAINS_SEED_LIMIT,
    { min: 1, max: 50 }
  );
}

export function getGraphStrictPathLimitPerSeed(): number {
  return parseNumber(
    process.env.GRAPH_STRICT_PATH_LIMIT_PER_SEED,
    DEFAULT_STRICT_PATH_LIMIT_PER_SEED,
    { min: 1, max: 300 }
  );
}

export function getGraphContainsPathLimitPerSeed(): number {
  return parseNumber(
    process.env.GRAPH_CONTAINS_PATH_LIMIT_PER_SEED,
    DEFAULT_CONTAINS_PATH_LIMIT_PER_SEED,
    { min: 1, max: 200 }
  );
}

export function getGraphGlobalResultLimit(): number {
  return parseNumber(
    process.env.GRAPH_GLOBAL_RESULT_LIMIT,
    DEFAULT_GLOBAL_RESULT_LIMIT,
    { min: 50, max: 1000 }
  );
}

export function getGraphContainsFallbackDepth(): number {
  return parseNumber(
    process.env.GRAPH_CONTAINS_FALLBACK_DEPTH,
    DEFAULT_CONTAINS_FALLBACK_DEPTH,
    { min: 1, max: 3 }
  );
}

export function shouldRunGraph(query: string, stickySeed = ""): boolean {
  const mode = getGraphSearchMode();
  if (mode === "off") return false;
  if (!query.trim()) return false;
  if (mode === "shadow") return true;

  const traffic = getGraphTrafficPercent();
  if (traffic >= 100) return true;
  if (traffic <= 0) return false;

  const hash = createHash("sha256")
    .update(`${query.trim().toLowerCase()}|${stickySeed}`)
    .digest("hex");
  const bucket = parseInt(hash.slice(0, 8), 16) % 100;
  return bucket < traffic;
}

export function isGraphConfigured(): boolean {
  return Boolean(
    process.env.NEO4J_URI &&
      process.env.NEO4J_USERNAME &&
      process.env.NEO4J_PASSWORD
  );
}
