import { createHash } from "crypto";
import { desc, eq } from "drizzle-orm";
import { redis } from "@/lib/redis";
import {
  getGraphContainsFallbackDepth,
  getGraphContainsPathLimitPerSeed,
  getGraphContainsSeedLimit,
  getGraphCacheTtlSeconds,
  getGraphGlobalResultLimit,
  getGraphMaxDepth,
  getGraphStrictPathLimitPerSeed,
  getGraphStrictSeedLimit,
  getGraphPolicyVersion,
} from "@/lib/graph/config";
import { normalizeSkill } from "@/lib/graph/normalize-skill";
import { getGraphBreakerState, runGraphQueryWithBreaker } from "@/lib/graph/circuit-breaker";
import { buildSeedKeywords, type SeedBundle } from "@/lib/graph/seed-builder";
import type { ExpandedSkill, GraphExpansionResult } from "@/lib/graph/types";

const GRAPH_EXPANSION_CACHE_PREFIX = "graph:expand";
const TAXONOMY_VERSION_CACHE_TTL_MS = 30_000;
let cachedTaxonomyVersion: { value: number; expiresAt: number } | null = null;

interface ExpansionQueryLimits {
  strictSeedLimit: number;
  containsSeedLimit: number;
  strictPathLimitPerSeed: number;
  containsPathLimitPerSeed: number;
  globalResultLimit: number;
  containsFallbackDepth: number;
}

interface Neo4jExpansionRow {
  seedSkill?: string;
  matchedSkill?: string;
  normalizedSkill?: string;
  depth?: number;
  relationType?: string;
  relationWeight?: number;
  path?: string[];
  idfScore?: number;
}


function toCacheKey(
  query: string,
  taxonomyVersion: number,
  policyVersion: number
): string {
  const queryHash = createHash("sha256")
    .update(query.trim().toLowerCase())
    .digest("hex");
  return `${GRAPH_EXPANSION_CACHE_PREFIX}:v${taxonomyVersion}:p${policyVersion}:${queryHash}`;
}

async function getActiveTaxonomyVersion(): Promise<number> {
  const now = Date.now();
  if (cachedTaxonomyVersion && cachedTaxonomyVersion.expiresAt > now) {
    return cachedTaxonomyVersion.value;
  }

  let version = 1;
  try {
    const [{ default: db }, { gfoGraphTaxonomyVersionsTable }] = await Promise.all([
      import("@/db"),
      import("@/db/schemas"),
    ]);

    const [active] = await db
      .select({ version: gfoGraphTaxonomyVersionsTable.version })
      .from(gfoGraphTaxonomyVersionsTable)
      .where(eq(gfoGraphTaxonomyVersionsTable.isActive, true))
      .orderBy(desc(gfoGraphTaxonomyVersionsTable.version))
      .limit(1);

    version = active?.version ?? 1;
  } catch {
    version = 1;
  }

  cachedTaxonomyVersion = {
    value: version,
    expiresAt: now + TAXONOMY_VERSION_CACHE_TTL_MS,
  };
  return version;
}

export function buildSeedKeywordsForTest(query: string, hints: string[] = []): SeedBundle {
  return buildSeedKeywords(query, hints);
}

function buildStrictCypherQuery(maxDepth: number, limits: ExpansionQueryLimits): string {
  const traversal = buildTraversalSubquery(maxDepth, limits.strictPathLimitPerSeed, "EXACT");
  return `
    CALL {
      MATCH (r:Role)
      WHERE r.normalizedTitle IN $seedKeywords
      RETURN r AS seed
      UNION
      MATCH (s:Skill)
      WHERE s.normalizedName IN $seedKeywords
      RETURN s AS seed
      UNION
      MATCH (a:Alias)
      WHERE a.normalizedAlias IN $seedKeywords
      RETURN a AS seed
    }
    WITH DISTINCT seed
    LIMIT ${limits.strictSeedLimit}
    CALL {
      WITH seed
      WITH CASE
        WHEN "Alias" IN labels(seed) THEN coalesce(
          [(seed)-[:ALIAS_OF]->(s:Skill) | s][0],
          [(seed)-[:ALIAS_OF_ROLE]->(r:Role) | r][0]
        )
        ELSE seed
      END AS seedEntity
      WITH DISTINCT seedEntity
      ${traversal}
      RETURN seedEntity, related, depth, relationWeight, relationType, pathNodes
    }
    RETURN coalesce(seedEntity.name, seedEntity.title, seedEntity.alias) AS seedSkill,
           related.name AS matchedSkill,
           coalesce(related.normalizedName, toLower(related.name)) AS normalizedSkill,
           depth,
           relationType,
           relationWeight,
           pathNodes AS path,
           coalesce(related.idfScore, 1.0) AS idfScore
    LIMIT ${limits.globalResultLimit}
  `;
}

function buildContainsCypherQuery(maxDepth: number, limits: ExpansionQueryLimits): string {
  const fallbackDepth = Math.min(limits.containsFallbackDepth, maxDepth);
  const traversal = buildTraversalSubquery(
    fallbackDepth,
    limits.containsPathLimitPerSeed,
    "CONTAINS"
  );
  return `
    CALL {
      MATCH (r:Role)
      WHERE any(term IN $containsKeywords WHERE r.normalizedTitle CONTAINS term)
      RETURN r AS seed
      UNION
      MATCH (s:Skill)
      WHERE any(term IN $containsKeywords WHERE s.normalizedName CONTAINS term)
      RETURN s AS seed
      UNION
      MATCH (a:Alias)
      WHERE any(term IN $containsKeywords WHERE a.normalizedAlias CONTAINS term)
      RETURN a AS seed
    }
    WITH DISTINCT seed
    LIMIT ${limits.containsSeedLimit}
    CALL {
      WITH seed
      WITH CASE
        WHEN "Alias" IN labels(seed) THEN coalesce(
          [(seed)-[:ALIAS_OF]->(s:Skill) | s][0],
          [(seed)-[:ALIAS_OF_ROLE]->(r:Role) | r][0]
        )
        ELSE seed
      END AS seedEntity
      WITH DISTINCT seedEntity
      ${traversal}
      RETURN seedEntity, related, depth, relationWeight, relationType, pathNodes
    }
    RETURN coalesce(seedEntity.name, seedEntity.title, seedEntity.alias) AS seedSkill,
           related.name AS matchedSkill,
           coalesce(related.normalizedName, toLower(related.name)) AS normalizedSkill,
           depth,
           relationType,
           relationWeight,
           pathNodes AS path,
           coalesce(related.idfScore, 1.0) AS idfScore
    LIMIT ${limits.globalResultLimit}
  `;
}

function buildTraversalSubquery(
  maxDepth: number,
  pathLimit: number,
  exactRelationLabel: "EXACT" | "CONTAINS"
): string {
  if (maxDepth <= 1) {
    return `
      CALL {
        WITH seedEntity
        MATCH (seedEntity)-[rel:RELATED_TO|REQUIRES]->(related:Skill)
        RETURN related,
               1 AS depth,
               coalesce(rel.weight, 1.0) AS relationWeight,
               CASE
                 WHEN type(rel) = "RELATED_TO" THEN coalesce(rel.relationType, "RELATED_TO")
                 ELSE type(rel)
               END AS relationType,
               [coalesce(seedEntity.name, seedEntity.title, seedEntity.alias), coalesce(related.name, related.title, related.alias)] AS pathNodes
        LIMIT ${pathLimit}
        UNION
        WITH seedEntity
        WITH seedEntity WHERE seedEntity:Skill
        RETURN seedEntity AS related,
               1 AS depth,
               1.0 AS relationWeight,
               "${exactRelationLabel}" AS relationType,
               [coalesce(seedEntity.name, seedEntity.title, seedEntity.alias)] AS pathNodes
      }
    `;
  }

  return `
    CALL {
      WITH seedEntity
      MATCH path=(seedEntity)-[r:RELATED_TO|REQUIRES*1..${maxDepth}]->(related:Skill)
      WITH related, path,
           length(path) AS depth,
           reduce(w = 1.0, rel IN relationships(path) | w * coalesce(rel.weight, 1.0)) AS pathWeight
      ORDER BY depth ASC, pathWeight DESC
      RETURN related,
             depth,
             pathWeight AS relationWeight,
             CASE
               WHEN type(relationships(path)[0]) = "RELATED_TO" THEN coalesce(relationships(path)[0].relationType, "RELATED_TO")
               ELSE type(relationships(path)[0])
             END AS relationType,
             [n IN nodes(path) | coalesce(n.name, n.title, n.alias)] AS pathNodes
      LIMIT ${pathLimit}
      UNION
      WITH seedEntity
      WITH seedEntity WHERE seedEntity:Skill
      RETURN seedEntity AS related,
             1 AS depth,
             1.0 AS relationWeight,
             "${exactRelationLabel}" AS relationType,
             [coalesce(seedEntity.name, seedEntity.title, seedEntity.alias)] AS pathNodes
    }
  `;
}

function dedupeExpandedSkills(rows: Neo4jExpansionRow[]): ExpandedSkill[] {
  const map = new Map<string, ExpandedSkill>();

  for (const row of rows) {
    const seedSkill = row.seedSkill || "";
    const matchedSkill = row.matchedSkill || "";
    const normalizedSkill = normalizeSkill(row.normalizedSkill || matchedSkill);
    if (!seedSkill || !matchedSkill || !normalizedSkill) continue;

    const depth = Math.max(1, Math.min(3, Number(row.depth || 1)));
    const relationWeight = Math.max(0, Number(row.relationWeight || 1));
    const relationType = row.relationType || "RELATED_TO";
    const path = Array.isArray(row.path) ? row.path : [seedSkill, matchedSkill];
    const idfScore = Number.isFinite(Number(row.idfScore))
      ? Number(row.idfScore)
      : 1.0;

    const key = `${seedSkill}|${normalizedSkill}|${depth}|${relationType}`;
    const existing = map.get(key);

    if (!existing || relationWeight > existing.relationWeight) {
      map.set(key, {
        seedSkill,
        matchedSkill,
        normalizedSkill,
        depth,
        relationType,
        relationWeight,
        path,
        idfScore,
      });
    }
  }

  return Array.from(map.values());
}

export async function expandSkillsFromGraph(
  query: string,
  hints: string[] = []
): Promise<GraphExpansionResult> {
  const start = Date.now();
  const policyVersion = getGraphPolicyVersion();
  const taxonomyVersion = await getActiveTaxonomyVersion();
  const cacheKey = toCacheKey(query, taxonomyVersion, policyVersion);

  const cachedRaw = await redis.get(cacheKey);
  if (cachedRaw) {
    try {
      const cached = JSON.parse(cachedRaw) as GraphExpansionResult;
      return {
        ...cached,
        cacheHit: true,
        latencyMs: Date.now() - start,
        taxonomyVersion,
        policyVersion,
      };
    } catch {
      await redis.del(cacheKey);
    }
  }

  const seedBundle = buildSeedKeywords(query, hints);
  const limits: ExpansionQueryLimits = {
    strictSeedLimit: getGraphStrictSeedLimit(),
    containsSeedLimit: getGraphContainsSeedLimit(),
    strictPathLimitPerSeed: getGraphStrictPathLimitPerSeed(),
    containsPathLimitPerSeed: getGraphContainsPathLimitPerSeed(),
    globalResultLimit: getGraphGlobalResultLimit(),
    containsFallbackDepth: getGraphContainsFallbackDepth(),
  };
  const strictSeeds = seedBundle.strictSeeds.slice(0, limits.strictSeedLimit);
  const containsSeeds = seedBundle.containsSeeds.slice(0, limits.containsSeedLimit);

  if (seedBundle.strictSeeds.length === 0) {
    return {
      expandedSkills: [],
      cacheHit: false,
      fallbackUsed: false,
      latencyMs: Date.now() - start,
      taxonomyVersion,
      policyVersion,
      seedDebug: {
        totalSeeds: 0,
        strictSeedCount: 0,
        tokenSeedCount: 0,
        containsSeedCount: 0,
        strictMatchRows: 0,
        containsFallbackUsed: false,
        containsMatchRows: 0,
      },
    };
  }

  const strictRows = await runGraphQueryWithBreaker<Neo4jExpansionRow>(
    buildStrictCypherQuery(getGraphMaxDepth(), limits),
    { seedKeywords: strictSeeds }
  );

  let containsRows: Neo4jExpansionRow[] = [];
  let containsFallbackUsed = false;
  if (strictRows.length === 0 && containsSeeds.length > 0) {
    containsFallbackUsed = true;
    containsRows = await runGraphQueryWithBreaker<Neo4jExpansionRow>(
      buildContainsCypherQuery(getGraphMaxDepth(), limits),
      { containsKeywords: containsSeeds }
    );
  }

  const selectedRows = strictRows.length > 0 ? strictRows : containsRows;
  const expandedSkills = dedupeExpandedSkills(selectedRows);
  const fallbackUsed = expandedSkills.length === 0;

  const payload: GraphExpansionResult = {
    expandedSkills,
    cacheHit: false,
    fallbackUsed,
    latencyMs: Date.now() - start,
    taxonomyVersion,
    policyVersion,
    seedDebug: {
      totalSeeds: new Set([...seedBundle.strictSeeds, ...seedBundle.containsSeeds]).size,
      strictSeedCount: strictSeeds.length,
      tokenSeedCount: seedBundle.tokenSeeds.length,
      containsSeedCount: containsSeeds.length,
      strictMatchRows: strictRows.length,
      containsFallbackUsed,
      containsMatchRows: containsRows.length,
    },
  };

  const shouldCachePayload = !fallbackUsed && getGraphBreakerState() !== "open";
  if (shouldCachePayload) {
    await redis.setex(cacheKey, getGraphCacheTtlSeconds(), JSON.stringify(payload));
  }

  return payload;
}

export function buildExpansionMap(expandedSkills: ExpandedSkill[]): Map<string, ExpandedSkill[]> {
  const map = new Map<string, ExpandedSkill[]>();

  for (const skill of expandedSkills) {
    const key = normalizeSkill(skill.normalizedSkill || skill.matchedSkill);
    const bucket = map.get(key) ?? [];
    bucket.push(skill);
    map.set(key, bucket);
  }

  return map;
}
