import { Job } from "bullmq";
import { eq } from "drizzle-orm";
import db from "@/db";
import {
  gfoCandidateSkillsTable,
  gfoSkillsLibraryTable,
  gfoGraphSyncStateTable,
} from "@/db/schemas";
import { GRAPH_SYNC_QUEUE_NAME, createWorker } from "@/lib/queue";
import { redis } from "@/lib/redis";
import { runCypherWrite } from "@/lib/graph/driver";
import { normalizeSkill, toGraphSkillKey } from "@/lib/graph/normalize-skill";
import { recordGraphOperationalMetric } from "@/lib/graph/metrics";
import type { GraphSyncJobPayload } from "@/lib/graph/sync";
import type { CandidateSkillEvidence } from "@/lib/graph/types";

const EXTRACTED_SKILL_MIN_CONFIDENCE = 0.45;
const EXTRACTED_SKILL_WEIGHT = 0.7;

function mergeSkills(
  profileSkills: CandidateSkillEvidence[],
  extractedSkills: CandidateSkillEvidence[]
): CandidateSkillEvidence[] {
  const merged = new Map<string, CandidateSkillEvidence>();

  for (const skill of profileSkills) {
    merged.set(skill.normalizedName, skill);
  }

  for (const skill of extractedSkills) {
    if (skill.confidence < EXTRACTED_SKILL_MIN_CONFIDENCE) continue;

    if (!merged.has(skill.normalizedName)) {
      merged.set(skill.normalizedName, {
        ...skill,
        confidence: Math.min(1, skill.confidence * EXTRACTED_SKILL_WEIGHT),
      });
    }
  }

  return Array.from(merged.values());
}

async function fetchProfileSkills(userId: string): Promise<CandidateSkillEvidence[]> {
  const rows = await db
    .select({
      skillId: gfoCandidateSkillsTable.skillId,
      name: gfoSkillsLibraryTable.name,
    })
    .from(gfoCandidateSkillsTable)
    .innerJoin(
      gfoSkillsLibraryTable,
      eq(gfoSkillsLibraryTable.id, gfoCandidateSkillsTable.skillId)
    )
    .where(eq(gfoCandidateSkillsTable.candidateUserId, userId));

  return rows.map((row) => ({
    name: row.name,
    normalizedName: normalizeSkill(row.name),
    source: "profile" as const,
    confidence: 1,
    skillId: row.skillId,
  }));
}

async function fetchExtractedSkillsFromRedis(userId: string): Promise<CandidateSkillEvidence[]> {
  const key = `candidate:extracted-skills:${userId}`;
  const raw = await redis.hgetall(key);
  const parsed: CandidateSkillEvidence[] = [];

  for (const [_, value] of Object.entries(raw)) {
    try {
      const item = JSON.parse(value);
      const normalizedName = normalizeSkill(item.name || item.normalizedName || "");
      if (!normalizedName) continue;
      parsed.push({
        name: item.name || normalizedName,
        normalizedName,
        source: "extracted",
        confidence: Number(item.confidence || 0),
      });
    } catch {
      continue;
    }
  }

  return parsed;
}

async function syncCandidateToGraph(
  userId: string,
  skills: CandidateSkillEvidence[]
): Promise<number> {
  if (skills.length === 0) {
    await runCypherWrite(
      `
        MERGE (c:Candidate {userId: $userId})
        SET c.lastSyncedAt = datetime()
        WITH c
        MATCH (c)-[r:HAS_SKILL]->(:Skill)
        DELETE r
      `,
      { userId }
    );
    return 0;
  }

  const result = await runCypherWrite<{ syncedSkills: number }>(
    `
      MERGE (c:Candidate {userId: $userId})
      SET c.lastSyncedAt = datetime()
      WITH c
      UNWIND $skills AS skill
      MERGE (s:Skill {normalizedName: skill.normalizedName})
      ON CREATE SET
        s.name = skill.name,
        s.skillId = coalesce(skill.skillId, randomUUID()),
        s.createdAt = datetime(),
        s.updatedAt = datetime()
      ON MATCH SET
        s.name = coalesce(s.name, skill.name),
        s.updatedAt = datetime()
      MERGE (c)-[r:HAS_SKILL {normalizedName: skill.normalizedName}]->(s)
      SET r.source = skill.source,
          r.confidence = skill.confidence,
          r.updatedAt = datetime()
      WITH c, collect(skill.normalizedName) AS keepSkills
      MATCH (c)-[old:HAS_SKILL]->(existing:Skill)
      WHERE NOT existing.normalizedName IN keepSkills
      DELETE old
      RETURN size(keepSkills) AS syncedSkills
    `,
    {
      userId,
      skills,
    }
  );

  return Number(result[0]?.syncedSkills || 0);
}

async function syncCandidateSkillIndexes(
  userId: string,
  skills: CandidateSkillEvidence[]
): Promise<void> {
  const registryKey = `candidate:skill-indexes:${userId}`;
  const prevSkillKeys = new Set(await redis.smembers(registryKey));
  const nextSkillKeys = new Set<string>();

  for (const skill of skills) {
    const key = toGraphSkillKey(skill.normalizedName || skill.name);
    if (!key) continue;
    nextSkillKeys.add(`idx:skill:${key}`);
  }

  const pipeline = redis.pipeline();

  for (const skillKey of nextSkillKeys) {
    pipeline.sadd(skillKey, userId);
  }

  for (const staleKey of prevSkillKeys) {
    if (!nextSkillKeys.has(staleKey)) {
      pipeline.srem(staleKey, userId);
    }
  }

  pipeline.del(registryKey);
  if (nextSkillKeys.size > 0) {
    for (const skillKey of nextSkillKeys) {
      pipeline.sadd(registryKey, skillKey);
    }
    pipeline.expire(registryKey, 60 * 60 * 24 * 30);
  }

  await pipeline.exec();
}

export async function graphSyncProcessor(job: Job<GraphSyncJobPayload>) {
  const { userId, extractedSkills = [] } = job.data;

  const profileSkills = await fetchProfileSkills(userId);
  const redisExtractedSkills = await fetchExtractedSkillsFromRedis(userId);

  const runtimeExtracted = extractedSkills.map((skill) => ({
    name: skill.name,
    normalizedName: normalizeSkill(skill.name),
    source: "extracted" as const,
    confidence: Number(skill.confidence || 0),
  }));

  const merged = mergeSkills(profileSkills, [...runtimeExtracted, ...redisExtractedSkills]);
  const syncedSkills = await syncCandidateToGraph(userId, merged);
  await syncCandidateSkillIndexes(userId, merged);

  await db
    .insert(gfoGraphSyncStateTable)
    .values({
      candidateUserId: userId,
      lastSyncedAt: new Date(),
      lastError: null,
      retryCount: 0,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: gfoGraphSyncStateTable.candidateUserId,
      set: {
        lastSyncedAt: new Date(),
        lastError: null,
        retryCount: 0,
        updatedAt: new Date(),
      },
    });

  await recordGraphOperationalMetric("graph_sync_success_count", 1);
  await recordGraphOperationalMetric("graph_synced_skill_count", syncedSkills);

  return { userId, syncedSkills };
}

export const graphSyncWorker = createWorker(
  GRAPH_SYNC_QUEUE_NAME,
  graphSyncProcessor,
  1
);

graphSyncWorker.on("failed", async (job, error) => {
  const userId = job?.data?.userId || "";
  if (userId) {
    await db
      .insert(gfoGraphSyncStateTable)
      .values({
        candidateUserId: userId,
        lastError: error.message,
        retryCount: 1,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: gfoGraphSyncStateTable.candidateUserId,
        set: {
          lastError: error.message,
          retryCount: (job?.attemptsMade || 0) + 1,
          updatedAt: new Date(),
        },
      });
  }

  await recordGraphOperationalMetric("graph_sync_failure_count", 1);
});
