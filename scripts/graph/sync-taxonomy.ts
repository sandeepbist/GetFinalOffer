import fs from "fs";
import path from "path";
import { sql } from "drizzle-orm";
import db from "@/db";
import {
  gfoGraphTaxonomyVersionsTable,
  gfoSkillAliasesTable,
  gfoSkillsLibraryTable,
} from "@/db/schemas";
import { normalizeSkill } from "@/lib/graph/normalize-skill";
import { runCypherWrite } from "@/lib/graph/driver";
import { validateTaxonomyDocument } from "./validate-taxonomy";

interface SkillNode {
  id: string;
  name: string;
  category: string;
  source?: string;
  sourceId?: string;
  tags?: string[];
  qualityScore?: number;
  sources?: string[];
}

interface RoleNode {
  id: string;
  title: string;
  source?: string;
  sourceId?: string;
  tags?: string[];
  qualityScore?: number;
  sources?: string[];
}

interface AliasNode {
  alias: string;
  skillId?: string;
  roleId?: string;
  type: "skill" | "role";
  source?: string;
  sourceId?: string;
  tags?: string[];
  qualityScore?: number;
}

interface RoleRequirement {
  roleId: string;
  skillId: string;
  weight: number;
  source?: string;
}

interface SkillRelation {
  fromSkillId: string;
  toSkillId: string;
  relationType: string;
  weight: number;
  directed?: boolean;
  source?: string;
}

interface TaxonomyDoc {
  version: number;
  skills: SkillNode[];
  roles: RoleNode[];
  aliases: AliasNode[];
  roleRequirements: RoleRequirement[];
  skillRelations: SkillRelation[];
  generatedAt?: string;
  sources?: string[];
}

function loadTaxonomy(): TaxonomyDoc {
  const inputArgIdx = process.argv.indexOf("--input");
  const inputPath =
    inputArgIdx >= 0
      ? process.argv[inputArgIdx + 1]
      : process.argv[2];

  if (!inputPath) {
    throw new Error(
      "Missing taxonomy input. Use: tsx scripts/graph/sync-taxonomy.ts --input <taxonomy.json>"
    );
  }

  const filePath = path.resolve(process.cwd(), inputPath);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as TaxonomyDoc;
}

const BATCH_SIZE = 500;

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function upsertPostgresTaxonomy(taxonomy: TaxonomyDoc): Promise<void> {
  const skillById = new Map(taxonomy.skills.map((skill) => [skill.id, skill]));

  const seenNames = new Set<string>();
  const skillRows: { name: string; normalizedName: string }[] = [];
  for (const skill of taxonomy.skills) {
    if (seenNames.has(skill.name)) continue;
    seenNames.add(skill.name);
    skillRows.push({
      name: skill.name,
      normalizedName: normalizeSkill(skill.name),
    });
  }
  const skillChunks = chunk(skillRows, BATCH_SIZE);
  for (let i = 0; i < skillChunks.length; i++) {
    await db
      .insert(gfoSkillsLibraryTable)
      .values(skillChunks[i])
      .onConflictDoUpdate({
        target: gfoSkillsLibraryTable.name,
        set: {
          normalizedName: sql`excluded.normalized_name`,
          updatedAt: new Date(),
        },
      });
    console.log(`[PG] Skills: ${Math.min((i + 1) * BATCH_SIZE, skillRows.length)}/${skillRows.length}`);
  }

  await db
    .update(gfoGraphTaxonomyVersionsTable)
    .set({ isActive: false, updatedAt: new Date() });

  await db
    .insert(gfoGraphTaxonomyVersionsTable)
    .values({
      version: taxonomy.version,
      status: "published",
      source: "taxonomy-file",
      notes: "Synced via scripts/graph/sync-taxonomy.ts",
      isActive: true,
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: gfoGraphTaxonomyVersionsTable.version,
      set: {
        status: "published",
        isActive: true,
        source: "taxonomy-file",
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    });

  const dbSkills = await db
    .select({
      id: gfoSkillsLibraryTable.id,
      normalizedName: gfoSkillsLibraryTable.normalizedName,
    })
    .from(gfoSkillsLibraryTable);

  const normalizedToSkillId = new Map<string, string>();
  for (const row of dbSkills) {
    if (row.normalizedName) {
      normalizedToSkillId.set(row.normalizedName, row.id);
    }
  }

  const seenAliases = new Set<string>();
  const aliasRows: { skillId: string; alias: string; normalizedAlias: string; source: string }[] = [];
  for (const alias of taxonomy.aliases) {
    if (alias.type !== "skill" || !alias.skillId) continue;
    const taxonomySkill = skillById.get(alias.skillId);
    if (!taxonomySkill) continue;
    const skillDbId = normalizedToSkillId.get(normalizeSkill(taxonomySkill.name));
    if (!skillDbId) continue;
    const normalized = normalizeSkill(alias.alias);
    if (seenAliases.has(normalized)) continue;
    seenAliases.add(normalized);
    aliasRows.push({
      skillId: skillDbId,
      alias: alias.alias,
      normalizedAlias: normalized,
      source: alias.source || "taxonomy",
    });
  }

  const aliasChunks = chunk(aliasRows, BATCH_SIZE);
  for (let i = 0; i < aliasChunks.length; i++) {
    await db
      .insert(gfoSkillAliasesTable)
      .values(aliasChunks[i])
      .onConflictDoUpdate({
        target: gfoSkillAliasesTable.normalizedAlias,
        set: {
          skillId: sql`excluded.skill_id`,
          alias: sql`excluded.alias`,
          source: sql`excluded.source`,
          updatedAt: new Date(),
        },
      });
    console.log(`[PG] Aliases: ${Math.min((i + 1) * BATCH_SIZE, aliasRows.length)}/${aliasRows.length}`);
  }
}

async function syncNeo4jTaxonomy(taxonomy: TaxonomyDoc): Promise<void> {
  const skillById = new Map(taxonomy.skills.map((skill) => [skill.id, skill]));

  const seenNeo4jSkills = new Set<string>();
  const skillNodes: {
    skillId: string;
    name: string;
    normalizedName: string;
    category: string;
    taxonomyVersion: number;
    source: string;
    sourceId: string | null;
    tags: string[];
    qualityScore: number | null;
  }[] = [];
  for (const skill of taxonomy.skills) {
    const normalized = normalizeSkill(skill.name);
    if (seenNeo4jSkills.has(normalized)) continue;
    seenNeo4jSkills.add(normalized);
    skillNodes.push({
      skillId: skill.id,
      name: skill.name,
      normalizedName: normalized,
      category: skill.category,
      taxonomyVersion: taxonomy.version,
      source: skill.source || "taxonomy",
      sourceId: skill.sourceId || null,
      tags: skill.tags || [],
      qualityScore:
        typeof skill.qualityScore === "number" ? skill.qualityScore : null,
    });
  }

  const skillNodeChunks = chunk(skillNodes, BATCH_SIZE);
  for (let i = 0; i < skillNodeChunks.length; i++) {
    await runCypherWrite(
      `
        UNWIND $skills AS skill
        MERGE (s:Skill {normalizedName: skill.normalizedName})
        ON CREATE SET
          s.skillId = skill.skillId,
          s.name = skill.name,
          s.category = skill.category,
          s.taxonomyVersion = skill.taxonomyVersion,
          s.source = skill.source,
          s.sourceId = skill.sourceId,
          s.tags = skill.tags,
          s.qualityScore = skill.qualityScore,
          s.createdAt = datetime(),
          s.updatedAt = datetime()
        ON MATCH SET
          s.skillId = coalesce(s.skillId, skill.skillId),
          s.name = skill.name,
          s.category = skill.category,
          s.taxonomyVersion = skill.taxonomyVersion,
          s.source = coalesce(skill.source, s.source),
          s.sourceId = coalesce(skill.sourceId, s.sourceId),
          s.tags = CASE WHEN size(skill.tags) > 0 THEN skill.tags ELSE coalesce(s.tags, []) END,
          s.qualityScore = coalesce(skill.qualityScore, s.qualityScore),
          s.updatedAt = datetime()
      `,
      { skills: skillNodeChunks[i] }
    );
    console.log(`[Neo4j] Skills: ${Math.min((i + 1) * BATCH_SIZE, skillNodes.length)}/${skillNodes.length}`);
  }

  await runCypherWrite(
    `CREATE INDEX skill_normalized_name IF NOT EXISTS FOR (s:Skill) ON (s.normalizedName)`,
    {}
  );
  await runCypherWrite(
    `CREATE INDEX role_normalized_title IF NOT EXISTS FOR (r:Role) ON (r.normalizedTitle)`,
    {}
  );
  await runCypherWrite(
    `CREATE INDEX alias_normalized_alias IF NOT EXISTS FOR (a:Alias) ON (a.normalizedAlias)`,
    {}
  );
  console.log(`[Neo4j] Indexes ensured on Skill.normalizedName, Role.normalizedTitle, Alias.normalizedAlias`);

  if (taxonomy.roles.length > 0) {
    await runCypherWrite(
      `
        UNWIND $roles AS role
        MERGE (r:Role {roleId: role.roleId})
      SET r.title = role.title,
          r.normalizedTitle = role.normalizedTitle,
          r.taxonomyVersion = role.taxonomyVersion,
          r.source = role.source,
          r.qualityScore = role.qualityScore,
          r.updatedAt = datetime()
      `,
      {
        roles: taxonomy.roles.map((role) => ({
          roleId: role.id,
          title: role.title,
          normalizedTitle: normalizeSkill(role.title),
          taxonomyVersion: taxonomy.version,
          source: role.source || "taxonomy",
          qualityScore:
            typeof role.qualityScore === "number" ? role.qualityScore : null,
        })),
      }
    );
    console.log(`[Neo4j] Roles: ${taxonomy.roles.length}`);
  }

  const skillAliases = taxonomy.aliases
    .filter((alias) => alias.type === "skill" && alias.skillId)
    .map((alias) => {
      const linkedSkill = skillById.get(alias.skillId!);
      if (!linkedSkill) return null;
      return {
        alias: alias.alias,
        normalizedAlias: normalizeSkill(alias.alias),
        skillNormalizedName: normalizeSkill(linkedSkill.name),
        taxonomyVersion: taxonomy.version,
        source: alias.source || "taxonomy",
        qualityScore:
          typeof alias.qualityScore === "number" ? alias.qualityScore : null,
      };
    })
    .filter(Boolean);

  const aliasChunksNeo4j = chunk(skillAliases, BATCH_SIZE);
  for (let i = 0; i < aliasChunksNeo4j.length; i++) {
    await runCypherWrite(
      `
        UNWIND $aliases AS alias
        MERGE (a:Alias {normalizedAlias: alias.normalizedAlias})
        SET a.alias = alias.alias,
            a.taxonomyVersion = alias.taxonomyVersion,
            a.source = alias.source,
            a.qualityScore = alias.qualityScore,
            a.updatedAt = datetime()
        WITH a, alias
        MATCH (s:Skill {normalizedName: alias.skillNormalizedName})
        MERGE (a)-[:ALIAS_OF]->(s)
      `,
      { aliases: aliasChunksNeo4j[i] }
    );
    console.log(`[Neo4j] Aliases: ${Math.min((i + 1) * BATCH_SIZE, skillAliases.length)}/${skillAliases.length}`);
  }

  const roleAliases = taxonomy.aliases.filter((alias) => alias.type === "role" && alias.roleId);
  if (roleAliases.length > 0) {
    await runCypherWrite(
      `
        UNWIND $aliases AS alias
        MERGE (a:Alias {normalizedAlias: alias.normalizedAlias})
        SET a.alias = alias.alias,
            a.taxonomyVersion = alias.taxonomyVersion,
            a.source = alias.source,
            a.qualityScore = alias.qualityScore,
            a.updatedAt = datetime()
        WITH a, alias
        MATCH (r:Role {roleId: alias.roleId})
        MERGE (a)-[:ALIAS_OF_ROLE]->(r)
      `,
      {
        aliases: roleAliases.map((alias) => ({
          alias: alias.alias,
          normalizedAlias: normalizeSkill(alias.alias),
          roleId: alias.roleId,
          taxonomyVersion: taxonomy.version,
          source: alias.source || "taxonomy",
          qualityScore:
            typeof alias.qualityScore === "number" ? alias.qualityScore : null,
        })),
      }
    );
    console.log(`[Neo4j] Role aliases: ${roleAliases.length}`);
  }

  if (taxonomy.roleRequirements.length > 0) {
    await runCypherWrite(
      `
        UNWIND $requirements AS req
        MATCH (r:Role {roleId: req.roleId}), (s:Skill {normalizedName: req.skillNormalizedName})
        MERGE (r)-[rel:REQUIRES]->(s)
        SET rel.weight = req.weight,
            rel.taxonomyVersion = req.taxonomyVersion,
            rel.source = req.source,
            rel.updatedAt = datetime()
      `,
      {
        requirements: taxonomy.roleRequirements.map((req) => {
          const skill = skillById.get(req.skillId);
          if (!skill) {
            throw new Error(`Missing skill for requirement: ${req.roleId} -> ${req.skillId}`);
          }
          return {
            roleId: req.roleId,
            skillNormalizedName: normalizeSkill(skill.name),
            weight: req.weight,
            taxonomyVersion: taxonomy.version,
            source: req.source || "taxonomy",
          };
        }),
      }
    );
    console.log(`[Neo4j] Role requirements: ${taxonomy.roleRequirements.length}`);
  }

  const directed = taxonomy.skillRelations.filter((relation) => relation.directed !== false);
  const directedData = directed.map((relation) => {
    const fromSkill = skillById.get(relation.fromSkillId);
    const toSkill = skillById.get(relation.toSkillId);
    if (!fromSkill || !toSkill) {
      throw new Error(`Missing skills for relation: ${relation.fromSkillId} -> ${relation.toSkillId}`);
    }
    return {
      fromNormalized: normalizeSkill(fromSkill.name),
      toNormalized: normalizeSkill(toSkill.name),
      relationType: relation.relationType,
      weight: relation.weight,
      taxonomyVersion: taxonomy.version,
      source: relation.source || "taxonomy",
    };
  });

  const directedChunks = chunk(directedData, BATCH_SIZE);
  for (let i = 0; i < directedChunks.length; i++) {
    await runCypherWrite(
      `
        UNWIND $relations AS rel
        MATCH (a:Skill {normalizedName: rel.fromNormalized}), (b:Skill {normalizedName: rel.toNormalized})
        MERGE (a)-[r:RELATED_TO {relationType: rel.relationType, directed: true}]->(b)
        SET r.weight = rel.weight,
            r.taxonomyVersion = rel.taxonomyVersion,
            r.source = rel.source,
            r.updatedAt = datetime()
      `,
      { relations: directedChunks[i] }
    );
    console.log(`[Neo4j] Directed relations: ${Math.min((i + 1) * BATCH_SIZE, directedData.length)}/${directedData.length}`);
  }

  const undirected = taxonomy.skillRelations.filter((relation) => relation.directed === false);
  if (undirected.length > 0) {
    const undirectedData = undirected.map((relation) => {
      const fromSkill = skillById.get(relation.fromSkillId);
      const toSkill = skillById.get(relation.toSkillId);
      if (!fromSkill || !toSkill) {
        throw new Error(`Missing skills for relation: ${relation.fromSkillId} -> ${relation.toSkillId}`);
      }
      return {
        fromNormalized: normalizeSkill(fromSkill.name),
        toNormalized: normalizeSkill(toSkill.name),
        relationType: relation.relationType,
        weight: relation.weight,
        taxonomyVersion: taxonomy.version,
        source: relation.source || "taxonomy",
      };
    });

    const undirectedChunks = chunk(undirectedData, BATCH_SIZE);
    for (let i = 0; i < undirectedChunks.length; i++) {
      await runCypherWrite(
        `
          UNWIND $relations AS rel
          MATCH (a:Skill {normalizedName: rel.fromNormalized}), (b:Skill {normalizedName: rel.toNormalized})
          MERGE (a)-[r1:RELATED_TO {relationType: rel.relationType, directed: false}]->(b)
          SET r1.weight = rel.weight,
              r1.taxonomyVersion = rel.taxonomyVersion,
              r1.source = rel.source,
              r1.updatedAt = datetime()
          MERGE (b)-[r2:RELATED_TO {relationType: rel.relationType, directed: false}]->(a)
          SET r2.weight = rel.weight,
              r2.taxonomyVersion = rel.taxonomyVersion,
              r2.source = rel.source,
              r2.updatedAt = datetime()
        `,
        { relations: undirectedChunks[i] }
      );
      console.log(`[Neo4j] Undirected relations: ${Math.min((i + 1) * BATCH_SIZE, undirectedData.length)}/${undirectedData.length}`);
    }
  }
}

async function main() {
  const taxonomy = loadTaxonomy();
  const errors = validateTaxonomyDocument(taxonomy);
  if (errors.length > 0) {
    console.error("Taxonomy validation failed. Refusing sync.");
    for (const error of errors) {
      console.error(` - ${error}`);
    }
    process.exit(1);
  }

  await upsertPostgresTaxonomy(taxonomy);
  await syncNeo4jTaxonomy(taxonomy);

  console.log(`Taxonomy v${taxonomy.version} synced to Postgres + Neo4j.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Failed to sync taxonomy", error);
  process.exit(1);
});
